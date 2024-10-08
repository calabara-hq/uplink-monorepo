import { db, sqlOps } from "./database.js";
import { GraphQLError } from "graphql";
import { schema, Decimal } from "lib";
import { getCacheValue, setCacheValue } from "./cache.js";
import { TokenController } from 'lib';
import dotenv from 'dotenv';
dotenv.config();


// Fetch voting policy based on the strategy type
export const fetchVotingPolicy = async (contestId: number, strategyType: string) => {
    const votingPolicy = await db.select({
        ...schema[`${strategyType}VotingStrategy`],
        token: schema.tokens
    })
        .from(schema.votingPolicy)
        .leftJoin(schema[`${strategyType}VotingStrategy`], sqlOps.eq(schema[`${strategyType}VotingStrategy`].votingPolicyId, schema.votingPolicy.id))
        .leftJoin(schema.tokens, sqlOps.eq(schema.tokens.id, schema[`${strategyType}VotingStrategy`].tokenLink))
        .where(sqlOps.and(sqlOps.eq(schema.votingPolicy.contestId, contestId), sqlOps.eq(schema.votingPolicy.strategyType, strategyType)));

    return strategyType === 'arcade' ? votingPolicy.map((policy) => {
        return {
            ...policy,
            votingPower: new Decimal(policy.votingPower)
        }
    }) : votingPolicy;
}

export const fetchContestParams = async (contestId: number) => {
    const result = await db.select({
        selfVote: schema.contests.selfVote,
        chainId: schema.contests.chainId,
        deadlines: {
            startTime: schema.contests.startTime,
            voteTime: schema.contests.voteTime,
            endTime: schema.contests.endTime,
            snapshot: schema.contests.snapshot,
        }
    })
        .from(schema.contests)
        .where(sqlOps.eq(schema.contests.id, contestId));

    return result[0];
}

// select submissions that the user has voted on
export const fetchUserVotes = async (user: any, contestId: any) => {
    const userVotes = await db.select({
        id: schema.votes.id,
        submissionId: schema.votes.submissionId,
        votes: schema.votes.amount,
        submissionUrl: schema.submissions.url
    }).from(schema.votes).leftJoin(schema.submissions, sqlOps.eq(schema.votes.submissionId, schema.submissions.id))
        .where(sqlOps.and(sqlOps.eq(schema.votes.contestId, contestId), sqlOps.eq(schema.votes.userId, user.id)));

    return userVotes.map((el: any) => {
        return {
            ...el,
            votes: new Decimal(el.votes),
        }
    });
}

export const fetchContestSubmissions = async (contestId: number) => {
    const contestSubmissions = await db.select({ id: schema.submissions.id, userId: schema.submissions.userId })
        .from(schema.submissions)
        .where(sqlOps.eq(schema.submissions.contestId, contestId))
    return contestSubmissions;
}


export const getCacheTotalVotingPower = async (
    user: { id: string },
    contestId: number
) => {
    const key = `voting-power:${user.id}-${contestId}`;
    return await getCacheValue(key).then(value => {
        if (value === null) return null
        return new Decimal(value);
    });
}

export const setCacheTotalVotingPower = async (
    user: { id: string },
    contestId: number,
    votingPower: Decimal
) => {
    const key = `voting-power:${user.id}-${contestId}`;
    const value = votingPower.toString();
    return await setCacheValue(key, value);
}


// given the theoretical voting power, calculate the "real" voting power based on the deadlines
export const deadlineAdjustedVotingPower = (
    theoreticalVotingPower: Decimal,
    deadlines: {
        startTime: string,
        voteTime: string,
        endTime: string,
        snapshot: string
    }
) => {

    const { voteTime, endTime } = deadlines;
    const now = new Date().toISOString();

    if ((now < voteTime) || (now > endTime)) return new Decimal(0);
    return theoreticalVotingPower;
}

export const computeArcadeVotingPowerUserValues = async (
    user: { address: string },
    blockNum: number,
    arcadeStrategy: {
        token: {
            tokenHash: string,
            type: string,
            symbol: string,
            decimals: number,
            address?: string,
            tokenId?: string,
        }
        votingPower: Decimal,
    }[],
    tokenController: TokenController
) => {

    const arcadeVotingPowerUserValues = await Promise.all(arcadeStrategy.map(async (policy: any) => {
        const { token, votingPower } = policy;
        const userBalance = await tokenController.computeUserTokenBalance({ token, blockNum, walletAddress: user.address });
        //if (userBalance > new Decimal(0)) return votingPower;
        if (userBalance.greaterThan(new Decimal(0))) return votingPower;
        return new Decimal(0);
    }));

    return arcadeVotingPowerUserValues;
}


export const computeWeightedVotingPowerUserValues = async (
    user: { address: string },
    blockNum: number,
    weightedStrategy: {
        token: {
            tokenHash: string,
            type: string,
            symbol: string,
            decimals: number,
            address?: string,
            tokenId?: string,
        }
    }[],
    tokenController: TokenController
) => {
    const weightedVotingPowerUserValues = await Promise.all(weightedStrategy.map(async (policy: any) => {
        const { token } = policy;
        const userBalance = await tokenController.computeUserTokenBalance({ token, blockNum, walletAddress: user.address });
        // if (userBalance > new Decimal(0)) return userBalance;
        if (userBalance.greaterThan(new Decimal(0))) return userBalance;
        return new Decimal(0);

    }));

    return weightedVotingPowerUserValues
}



// calculate the total theoretical voting power and cache it. return the deadline adjusted voting power

export const calculateTotalVotingPower = async (
    user: any,
    contestId: number,
    deadlines: {
        startTime: string,
        voteTime: string,
        endTime: string,
        snapshot: string
    },
    chainId: number
) => {
    if (!user || !user.id) return new Decimal(0);

    // not cached
    const tokenController = new TokenController(process.env.ALCHEMY_KEY!, chainId);
    const [arcadeVotingStrategy, weightedVotingStrategy] = await Promise.all([
        fetchVotingPolicy(contestId, 'arcade'),
        fetchVotingPolicy(contestId, 'weighted'),
    ]);
    if (!arcadeVotingStrategy && !weightedVotingStrategy) return new Decimal(0);
    const blockNum = await tokenController.calculateBlockFromTimestamp(deadlines.snapshot);
    const [arcadeVotingPowerUserValues, weightedVotingPowerUserValues] = await Promise.all([
        computeArcadeVotingPowerUserValues(user, blockNum, arcadeVotingStrategy, tokenController),
        computeWeightedVotingPowerUserValues(user, blockNum, weightedVotingStrategy, tokenController),
    ]);

    // total vp is the max(max arcade vp, max weighted vp)

    const totalTheoreticalVotingPower = new Decimal(Decimal.max(...arcadeVotingPowerUserValues, ...weightedVotingPowerUserValues));
    // cache the total theoretical vp for the user / contest
    // return the deadline adjusted vp

    return deadlineAdjustedVotingPower(totalTheoreticalVotingPower, deadlines);

    // cache the total vp for the user / contest

}


// compute the difference between total voting power and votes spent.
// return vp, vs, and vr (vp - vs)
export const calculateUserVotingParams = async (
    user: any,
    contestId: number,
    deadlines: {
        startTime: string,
        voteTime: string,
        endTime: string,
        snapshot: string
    },
    chainId: number
) => {

    const [totalVotingPower, userVotes] = await Promise.all([
        calculateTotalVotingPower(user, contestId, deadlines, chainId),
        fetchUserVotes(user, contestId),
    ]);

    const votesSpent = userVotes.reduce((acc: Decimal, vote: any) => Decimal.add(acc, vote.votes), new Decimal(0));
    const votesRemaining = new Decimal(Decimal.sub(totalVotingPower, votesSpent));

    return {
        totalVotingPower,
        votesSpent,
        votesRemaining,
        userVotes
    }
}



// clean the payload & insert votes into table with unique constraint on (user, contest, submission, votes)
export const insertVotes = async (user: any, contestId: any, payload: any) => {
    try {
        const preparedPayload = payload.map((el: any) => {
            return {
                contestId,
                submissionId: el.submissionId,
                userId: user.id,
                created: new Date().toISOString(),
                amount: el.votes.toString(),
            } as schema.dbNewVoteType
        });


        await db.transaction(async (tx) => {
            // delete all user votes
            await tx.delete(schema.votes).where(sqlOps.and(sqlOps.eq(schema.votes.contestId, contestId), sqlOps.eq(schema.votes.userId, user.id)));
            // set new votes
            await tx.insert(schema.votes).values(preparedPayload);
        });

    } catch (err) {
        console.log(err)
        throw new GraphQLError('Failed to create votes', {
            extensions: {
                code: 'FAILED_TO_CREATE_VOTES'
            }
        })
    }

}



// the payload contains a batch of submissions / votes to cast
// sum the proposed votes and compare to the total voting power
// if the sum is greater than the total voting power, throw an error
// if the sum is less than the total voting power, cast the votes and return the updated voting power

export const castVotes = async (
    user: any,
    contestId: number,
    payload: {
        submissionId: number,
        votes: Decimal,
    }[],
) => {

    const contestParams = await fetchContestParams(contestId);
    if (!contestParams) {
        throw new GraphQLError('Contest does not exist', {
            extensions: {
                code: 'CONTEST_DOES_NOT_EXIST'
            }
        })
    }

    const votingPower = await calculateTotalVotingPower(user, contestId, contestParams.deadlines, contestParams.chainId);
    const proposedVoteTotal = payload.reduce((acc: Decimal, el: { submissionId: number, votes: Decimal }) => acc.plus(el.votes), new Decimal(0));


    if (proposedVoteTotal.greaterThan(votingPower)) throw new GraphQLError('Insufficient voting power', {
        extensions: {
            code: 'INSUFFICIENT_VOTING_POWER'
        }
    });


    const contestSubmissions = await fetchContestSubmissions(contestId);

    const contestSubmissionIds = new Set(contestSubmissions.map((el: any) => el.id.toString()));
    const userSubmissionIds = contestParams.selfVote ? null : new Set(contestSubmissions.filter((el: any) => el.userId === user.id).map((el: any) => el.id.toString()));
    let submissionIdErrors = [];
    let selfVoteErrors = [];

    for (let el of payload) {
        if (!contestSubmissionIds.has(el.submissionId.toString())) {
            submissionIdErrors.push(el.submissionId);
        }
        if (!contestParams.selfVote && userSubmissionIds.has(el.submissionId.toString())) {
            selfVoteErrors.push(el.submissionId);
        }
    }

    if (submissionIdErrors.length > 0) throw new GraphQLError('Invalid submissionId', {
        extensions: {
            code: 'INVALID_SUBMISSION_ID'
        }
    });


    if (selfVoteErrors.length > 0) throw new GraphQLError('Self voting is disabled', {
        extensions: {
            code: 'SELF_VOTING_DISABLED'
        }
    });

    await insertVotes(user, contestId, payload);

    const { totalVotingPower, votesSpent, votesRemaining, userVotes } = await calculateUserVotingParams(user, contestId, contestParams.deadlines, contestParams.chainId);

    return {
        success: true,
        userVotingParams: {
            totalVotingPower,
            votesSpent,
            votesRemaining,
            userVotes
        }
    }
}


export const retractAllVotes = async (user: any, contestId: any) => {
    try {

        const contestParams = await fetchContestParams(contestId);

        const totalVotingPower = await calculateTotalVotingPower(user, contestId, contestParams.deadlines, contestParams.chainId);

        await db.delete(schema.votes).where(sqlOps.and(sqlOps.eq(schema.votes.contestId, contestId), sqlOps.eq(schema.votes.userId, user.id)));
        // reset the voting params state
        return {
            success: true,
            userVotingParams: {
                totalVotingPower,
                votesSpent: new Decimal(0),
                votesRemaining: totalVotingPower,
                userVotes: []
            }
        }
    } catch (err) {
        throw new GraphQLError('Failed to delete votes', {
            extensions: {
                code: 'FAILED_TO_DELETE_VOTES'
            }
        })
    }
}


export const retractSingleVote = async (user: any, contestId: any, submissionId: any) => {
    const contestParams = await fetchContestParams(contestId);
    if (!contestParams) {
        throw new GraphQLError('Contest does not exist', {
            extensions: {
                code: 'CONTEST_DOES_NOT_EXIST'
            }
        })
    }

    try {
        await db.delete(schema.votes).where(sqlOps.and(sqlOps.eq(schema.votes.submissionId, submissionId), sqlOps.eq(schema.votes.userId, user.id)));
        const { totalVotingPower, votesSpent, votesRemaining, userVotes } = await calculateUserVotingParams(user, contestId, contestParams.deadlines, contestParams.chainId);

        return {
            success: true,
            userVotingParams: {
                totalVotingPower,
                votesSpent,
                votesRemaining,
                userVotes
            }
        }
    } catch (err) {
        throw new GraphQLError('Failed to delete votes', {
            extensions: {
                code: 'FAILED_TO_DELETE_VOTES'
            }
        })
    }
}
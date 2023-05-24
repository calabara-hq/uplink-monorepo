import { db, sqlOps } from "../utils/database.js";
import { GraphQLError } from "graphql";
import { schema, computeUserTokenBalance, Decimal } from "lib";
import { getCacheValue, setCacheValue } from "./cache.js";
import dotenv from 'dotenv';
dotenv.config();




export const fetchArcadeVotingPolicy = async (contestId: number) => {
    const arcadeVotingPolicy = await db.select({
        ...schema.arcadeVotingStrategy,
        token: schema.tokens
    })
        .from(schema.votingPolicy)
        .leftJoin(schema.arcadeVotingStrategy, sqlOps.eq(schema.arcadeVotingStrategy.votingPolicyId, schema.votingPolicy.id))
        .leftJoin(schema.tokens, sqlOps.eq(schema.tokens.id, schema.arcadeVotingStrategy.tokenLink))
        .where(sqlOps.and(sqlOps.eq(schema.votingPolicy.contestId, contestId), sqlOps.eq(schema.votingPolicy.strategyType, "arcade")));

    return arcadeVotingPolicy.map((policy) => {
        return {
            ...policy,
            votingPower: new Decimal(policy.votingPower)
        }
    })
}

export const fetchWeightedVotingPolicy = async (contestId: number) => {
    const weightedVotingPolicy = await db.select({
        ...schema.weightedVotingStrategy,
        token: schema.tokens
    })
        .from(schema.votingPolicy)
        .leftJoin(schema.weightedVotingStrategy, sqlOps.eq(schema.weightedVotingStrategy.votingPolicyId, schema.votingPolicy.id))
        .leftJoin(schema.tokens, sqlOps.eq(schema.tokens.id, schema.weightedVotingStrategy.tokenLink))
        .where(sqlOps.and(sqlOps.eq(schema.votingPolicy.contestId, contestId), sqlOps.eq(schema.votingPolicy.strategyType, "weighted")));

    return weightedVotingPolicy
}

export const fetchDeadlines = async (contestId: number) => {
    const deadlines = await db.select({
        deadlines: {
            startTime: schema.contests.startTime,
            voteTime: schema.contests.voteTime,
            endTime: schema.contests.endTime,
            snapshot: schema.contests.snapshot,
        }
    })
        .from(schema.contests)
        .where(sqlOps.eq(schema.contests.id, contestId));

    return deadlines[0];
}


// TODO: query the cache and return the total voting power for the user / contest
export const getCacheTotalVotingPower = async (
    user: { address: string },
    contestId: number
) => {
    const key = `voting-power:${user.address}-${contestId}`;
    return await getCacheValue(key).then(value => {
        if (value === null) return null
        return new Decimal(value);
    });
}

// TODO: cache the total voting power for the user / contest
export const setCacheTotalVotingPower = async (
    user: { address: string },
    contestId: number,
    votingPower: Decimal
) => {
    const key = `voting-power:${user.address}-${contestId}`;
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
    snapshot: string,
    arcadePolicy: {
        token: {
            tokenHash: string,
            type: string,
            symbol: string,
            decimals: number,
            address?: string,
            tokenId?: string,
        }
        votingPower: Decimal,
    }[]
) => {
    const arcadeVotingPowerUserValues = await Promise.all(arcadePolicy.map(async (policy: any) => {
        const { token, votingPower } = policy;
        const userBalance = await computeUserTokenBalance({ token, snapshot, walletAddress: user.address });
        if (userBalance > new Decimal(0)) return votingPower;
        return new Decimal(0);
    }));

    return arcadeVotingPowerUserValues;
}


export const computeWeightedVotingPowerUserValues = async (
    user: { address: string },
    snapshot: string,
    weightedPolicy: {
        token: {
            tokenHash: string,
            type: string,
            symbol: string,
            decimals: number,
            address?: string,
            tokenId?: string,
        }
    }[]
) => {
    const weightedVotingPowerUserValues = await Promise.all(weightedPolicy.map(async (policy: any) => {
        const { token } = policy;
        const userBalance = await computeUserTokenBalance({ token, snapshot, walletAddress: user.address });
        if (userBalance > new Decimal(0)) return userBalance;
        return new Decimal(0);

    }));

    return weightedVotingPowerUserValues
}



// calculate the total theoretical voting power and cache it. return the deadline adjusted voting power

export const calculateTotalVotingPower = async (
    user: { address: string },
    contestId: number
) => {
    if (!user || !user.address) return new Decimal(0);


    const [cachedVotingPower, deadlines] = await Promise.all([
        getCacheTotalVotingPower(user, contestId),
        fetchDeadlines(contestId)
    ]);



    if (cachedVotingPower !== null) return deadlineAdjustedVotingPower(cachedVotingPower, deadlines);


    else {
        const [arcadeVotingPolicy, weightedVotingPolicy] = await Promise.all([
            fetchArcadeVotingPolicy(contestId),
            fetchWeightedVotingPolicy(contestId),
        ]);

        if (!arcadeVotingPolicy && !weightedVotingPolicy) return new Decimal(0);

        const [arcadeVotingPowerUserValues, weightedVotingPowerUserValues] = await Promise.all([
            computeArcadeVotingPowerUserValues(user, deadlines.snapshot, arcadeVotingPolicy),
            computeWeightedVotingPowerUserValues(user, deadlines.snapshot, weightedVotingPolicy),
        ]);


        // total vp is the max(max arcade vp, max weighted vp)

        const totalTheoreticalVotingPower = new Decimal(Decimal.max(...arcadeVotingPowerUserValues, ...weightedVotingPowerUserValues));

        // cache the total theoretical vp for the user / contest
        // return the deadline adjusted vp

        setCacheTotalVotingPower(user, contestId, totalTheoreticalVotingPower);

        return deadlineAdjustedVotingPower(totalTheoreticalVotingPower, deadlines);

    }

    // cache the total vp for the user / contest

}

// select submissions that the user has voted on
export const fetchUserVotes = async (user: any, contestId: any) => {
    const userVotes = await db.select({
        id: schema.votes.id,
        submissionId: schema.votes.submissionId,
        votes: schema.votes.amount,
    }).from(schema.votes)
        .where(sqlOps.and(sqlOps.eq(schema.votes.contestId, contestId), sqlOps.eq(schema.votes.voter, user.address)));

    return userVotes;
}

// compute the difference between total voting power and votes spent.
// return vp, vs, and vr (vp - vs)
export const calculateUserVotingParams = async (user: any, contestId: any) => {
    const [totalVotingPower, userVotes] = await Promise.all([
        calculateTotalVotingPower(user, contestId),
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

/*
export const getAdditionalContestParams = async (contestId: number) => {
    const params = await db.select({
        selfVote: schema.contests.selfVote,
    }).from(schema.contests).where(sqlOps.eq(schema.contests.id, contestId));

    return params[0];
}

export const getContestSubmissions = async (contestId: number) => {
    const contestSubmissions = await db.select({ id: schema.submissions.id, author: schema.submissions.author })
        .from(schema.submissions)
        .where(sqlOps.eq(schema.submissions.contestId, contestId))
    return contestSubmissions;
}
*/

export const getAdditionalParamsAndSubmissions = async (contestId: number) => {
    const result = await db.select({
        selfVote: schema.contests.selfVote,
        submissions: {
            id: schema.submissions.id,
            author: schema.submissions.author
        }
    })
        .from(schema.contests)
        .leftJoin(schema.submissions, sqlOps.eq(schema.submissions.contestId, schema.contests.id))
        .where(sqlOps.eq(schema.contests.id, contestId));

    console.log(result);
    return result[0];
}


// clean the payload & insert votes into table with unique constraint on (user, contest, submission, votes)
export const insertVotes = async (user: any, contestId: any, payload: any) => {
    try {
        const preparedPayload = payload.map((el: any) => {
            return {
                contestId,
                ...el.submissionId,
                voter: user.address,
                created: new Date().toISOString(),
                amount: el.votes.toString(),
            }
        });
        await db.insert(schema.votes).values(preparedPayload).onDuplicateKeyUpdate({ amount: db.raw('VALUES(amount)') });
        return true;
    } catch (err) {
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
    user: { address: string },
    contestId: number,
    payload: {
        submissionId: number,
        votes: Decimal,
    }[]
) => {
    const votingPower = await calculateTotalVotingPower(user, contestId);
    const proposedVotes = payload.reduce((acc: Decimal, el: any) => Decimal.add(acc, el.votes), new Decimal(0));

    if (proposedVotes > votingPower) throw new GraphQLError('Insufficient voting power', {
        extensions: {
            code: 'INSUFFICIENT_VOTING_POWER'
        }
    });

    const { selfVote: isSelfVote, submissions: contestSubmissions } = await getAdditionalParamsAndSubmissions(contestId);

    const submissionIds = new Set(contestSubmissions.map((el: any) => el.id));
    const userSubmissionIds = isSelfVote ? null : new Set(contestSubmissions.filter((el: any) => el.author === user.address).map((el: any) => el.id));
    let invalidSubmissionIds = [];
    let selfVotes = [];

    for (let el of payload) {
        if (!submissionIds.has(el.submissionId)) {
            invalidSubmissionIds.push(el.submissionId);
        }
        if (userSubmissionIds && userSubmissionIds.has(el.submissionId)) {
            selfVotes.push(el.submissionId);
        }
    }

    if (invalidSubmissionIds.length > 0) throw new GraphQLError('Invalid submissionId', {
        extensions: {
            code: 'INVALID_SUBMISSION_ID'
        }
    });

    if (selfVotes.length > 0) throw new GraphQLError('Self voting is disabled', {
        extensions: {
            code: 'SELF_VOTING_DISABLED'
        }
    });

    await insertVotes(user, contestId, payload);

    const { totalVotingPower, votesSpent, votesRemaining, userVotes } = await calculateUserVotingParams(user, contestId);

    return {
        totalVotingPower,
        votesSpent,
        votesRemaining,
        userVotes
    }
}


export const retractAllVotes = async (user: any, contestId: any) => {
    try {
        const totalVotingPower = await calculateTotalVotingPower(user, contestId);
        await db.deleteFrom(schema.votes).where(sqlOps.and(sqlOps.eq(schema.votes.contestId, contestId), sqlOps.eq(schema.votes.voter, user.address)));
        // reset the voting params state
        return {
            totalVotingPower,
            votesSpent: new Decimal(0),
            votesRemaining: totalVotingPower,
            userVotes: []
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
    try {
        await db.deleteFrom(schema.votes).where(sqlOps.and(sqlOps.eq(schema.votes.submissionId, submissionId), sqlOps.eq(schema.votes.voter, user.address)));
        const { totalVotingPower, votesSpent, votesRemaining, userVotes } = await calculateUserVotingParams(user, contestId);
        return {
            totalVotingPower,
            votesSpent,
            votesRemaining,
            userVotes
        }
    } catch (err) {
        throw new GraphQLError('Failed to delete votes', {
            extensions: {
                code: 'FAILED_TO_DELETE_VOTES'
            }
        })
    }
}
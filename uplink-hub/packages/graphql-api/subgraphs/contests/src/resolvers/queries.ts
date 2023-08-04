import { Decimal, schema } from "lib";
import { sqlOps, db } from '../utils/database.js';

const fetchContestTopLevel = async (contestId?: string, spaceId?: string) => {
    const where = contestId
        ? sqlOps.eq(schema.contests.id, contestId)
        : spaceId
            ? sqlOps.eq(schema.contests.spaceId, spaceId)
            : null;

    if (!where) return null;


    const result = await db.select({
        id: schema.contests.id,
        spaceId: schema.contests.spaceId,
        space: schema.spaces,
        promptUrl: schema.contests.promptUrl,
        created: schema.contests.created,
        metadata: {
            type: schema.contests.type,
            category: schema.contests.category,
        },
        deadlines: {
            startTime: schema.contests.startTime,
            voteTime: schema.contests.voteTime,
            endTime: schema.contests.endTime,
            snapshot: schema.contests.snapshot,
        },
        additionalParams: {
            anonSubs: schema.contests.anonSubs,
            visibleVotes: schema.contests.visibleVotes,
            selfVote: schema.contests.selfVote,
            subLimit: schema.contests.subLimit,
        },
    })
        .from(schema.contests)
        .leftJoin(schema.spaces, sqlOps.eq(schema.spaces.id, schema.contests.spaceId))
        .where(where);

    return result;
}

const fetchActiveContests = async () => {
    const result = await db.select({
        id: schema.contests.id,
        spaceId: schema.contests.spaceId,
        space: schema.spaces,
        promptUrl: schema.contests.promptUrl,
        created: schema.contests.created,
        metadata: {
            type: schema.contests.type,
            category: schema.contests.category,
        },
        deadlines: {
            startTime: schema.contests.startTime,
            voteTime: schema.contests.voteTime,
            endTime: schema.contests.endTime,
            snapshot: schema.contests.snapshot,
        },
        additionalParams: {
            anonSubs: schema.contests.anonSubs,
            visibleVotes: schema.contests.visibleVotes,
            selfVote: schema.contests.selfVote,
            subLimit: schema.contests.subLimit,
        },
    })
        .from(schema.contests)
        .leftJoin(schema.spaces, sqlOps.eq(schema.spaces.id, schema.contests.spaceId))
        .where(sqlOps.gt(schema.contests.endTime, new Date().toISOString()));

    return result;
}


const fetchSubmitterRewards = async (contestId: string) => {
    const submitterRewards = await db.select({
        id: schema.rewards.id,
        contestId: schema.rewards.contestId,
        recipient: schema.rewards.recipient,
        rank: schema.rewards.rank,
        tokenReward: {
            ...schema.tokenRewards,
            amount: schema.tokenRewards.amount,
            token: schema.tokens
        } as any
    })
        .from(schema.rewards)
        .leftJoin(schema.tokenRewards, sqlOps.eq(schema.tokenRewards.rewardId, schema.rewards.id))
        .leftJoin(schema.tokens, sqlOps.eq(schema.tokens.id, schema.tokenRewards.tokenLink))
        .where(sqlOps.and(sqlOps.eq(schema.rewards.contestId, contestId), sqlOps.eq(schema.rewards.recipient, "submitter")));


    return submitterRewards.map((reward) => {
        return {
            ...reward,
            tokenReward: {
                ...reward.tokenReward,
                amount: new Decimal(reward.tokenReward.amount)
            }
        }
    });
}

const fetchVoterRewards = async (contestId: string) => {
    const voterRewards = await db.select({
        id: schema.rewards.id,
        contestId: schema.rewards.contestId,
        recipient: schema.rewards.recipient,
        rank: schema.rewards.rank,
        tokenReward: {
            ...schema.tokenRewards,
            amount: schema.tokenRewards.amount,
            token: schema.tokens
        }
    })
        .from(schema.rewards)
        .leftJoin(schema.tokenRewards, sqlOps.eq(schema.tokenRewards.rewardId, schema.rewards.id))
        .leftJoin(schema.tokens, sqlOps.eq(schema.tokens.id, schema.tokenRewards.tokenLink))
        .where(sqlOps.and(sqlOps.eq(schema.rewards.contestId, contestId), sqlOps.eq(schema.rewards.recipient, "voter")));

    return voterRewards.map((reward) => {
        return {
            ...reward,
            tokenReward: {
                ...reward.tokenReward,
                amount: new Decimal(reward.tokenReward.amount)
            }
        }
    });
}



const fetchSubmitterRestrictions = async (contestId: string) => {
    const submitterRestrictions = await db.select({
        id: schema.submitterRestrictions.id,
        contestId: schema.submitterRestrictions.contestId,
        restrictionType: schema.submitterRestrictions.restrictionType,
        tokenRestriction: {
            ...schema.tokenRestrictions,
            token: schema.tokens
        } as any
    })
        .from(schema.submitterRestrictions)
        .leftJoin(schema.tokenRestrictions, sqlOps.eq(schema.tokenRestrictions.restrictionId, schema.submitterRestrictions.id))
        .leftJoin(schema.tokens, sqlOps.eq(schema.tokens.id, schema.tokenRestrictions.tokenLink))
        .where(sqlOps.eq(schema.submitterRestrictions.contestId, contestId));


    return submitterRestrictions.map((restriction) => {
        return {
            ...restriction,
            tokenRestriction: {
                ...restriction.tokenRestriction,
                threshold: new Decimal(restriction.tokenRestriction.threshold)
            }

        }
    });
}


const fetchArcadeVotingPolicy = async (contestId: string) => {
    const arcadeVotingPolicy = await db.select({
        id: schema.votingPolicy.id,
        contestId: schema.votingPolicy.contestId,
        strategyType: schema.votingPolicy.strategyType,
        arcadeVotingPolicy: {
            ...schema.arcadeVotingStrategy,
            token: schema.tokens
        } as any,
    })
        .from(schema.votingPolicy)
        .leftJoin(schema.arcadeVotingStrategy, sqlOps.eq(schema.arcadeVotingStrategy.votingPolicyId, schema.votingPolicy.id))
        .leftJoin(schema.tokens, sqlOps.eq(schema.tokens.id, schema.arcadeVotingStrategy.tokenLink))
        .where(sqlOps.and(sqlOps.eq(schema.votingPolicy.contestId, contestId), sqlOps.eq(schema.votingPolicy.strategyType, "arcade")));

    console.log(JSON.stringify(arcadeVotingPolicy, null, 2))

    return arcadeVotingPolicy.map((policy) => {
        return {
            ...policy,
            arcadeVotingPolicy: {
                ...policy.arcadeVotingPolicy,
                votingPower: new Decimal(policy.arcadeVotingPolicy.votingPower)
            },
        }
    })
}

const fetchWeightedVotingPolicy = async (contestId: string) => {
    const weightedVotingPolicy = await db.select({
        id: schema.votingPolicy.id,
        contestId: schema.votingPolicy.contestId,
        strategyType: schema.votingPolicy.strategyType,
        weightedVotingPolicy: {
            ...schema.weightedVotingStrategy,
            token: schema.tokens
        } as any,
    })
        .from(schema.votingPolicy)
        .leftJoin(schema.weightedVotingStrategy, sqlOps.eq(schema.weightedVotingStrategy.votingPolicyId, schema.votingPolicy.id))
        .leftJoin(schema.tokens, sqlOps.eq(schema.tokens.id, schema.weightedVotingStrategy.tokenLink))
        .where(sqlOps.and(sqlOps.eq(schema.votingPolicy.contestId, contestId), sqlOps.eq(schema.votingPolicy.strategyType, "weighted")));

    return weightedVotingPolicy.map((policy) => {
        return {
            ...policy,
            weightedVotingPolicy: {
                ...policy.weightedVotingPolicy,
            },
        }
    })
}



const singleContestByContestId = async (contestId: string) => {

    const [contestTopLevel, submitterRewards, voterRewards, submitterRestrictions, arcadeVotingPolicy, weightedVotingPolicy] = await Promise.all([
        fetchContestTopLevel(contestId, null),
        fetchSubmitterRewards(contestId),
        fetchVoterRewards(contestId),
        fetchSubmitterRestrictions(contestId),
        fetchArcadeVotingPolicy(contestId),
        fetchWeightedVotingPolicy(contestId)
    ])

    const data = {
        ...contestTopLevel[0],
        submitterRewards,
        voterRewards,
        submitterRestrictions,
        votingPolicy: [
            ...arcadeVotingPolicy,
            ...weightedVotingPolicy
        ]
    }

    return data

}


const multiContestsBySpaceId = async (spaceId: string) => {
    const contestTopLevel = await fetchContestTopLevel(null, spaceId);
    const result = await Promise.all(contestTopLevel.map(async (contest) => {
        const [submitterRewards, voterRewards, submitterRestrictions, arcadeVotingPolicy, weightedVotingPolicy] = await Promise.all([
            fetchSubmitterRewards(contest.id),
            fetchVoterRewards(contest.id),
            fetchSubmitterRestrictions(contest.id),
            fetchArcadeVotingPolicy(contest.id),
            fetchWeightedVotingPolicy(contest.id)
        ])
        return {
            ...contest,
            submitterRewards,
            voterRewards,
            submitterRestrictions,
            votingPolicy: [
                ...arcadeVotingPolicy,
                ...weightedVotingPolicy
            ]
        }
    }));
    return result
}




const queries = {
    Query: {
        async contest(_, { contestId }, contextValue, info) {
            const contest = await singleContestByContestId(contestId)
            return contest;
        },

        async activeContests() {
            const active = await fetchActiveContests();
            return await Promise.all(active.map(contest => {
                return singleContestByContestId(contest.id)
            }))
        }

    },

    // used to resolve contests to spaces
    Space: {
        contests(space) {
            console.log('got a space')
            console.log(space)
            return multiContestsBySpaceId(space.id);
        }
    },


    ActiveContest: {
        spaceLink(contest) {
            return {
                id: contest.spaceId,
                name: contest.spaceName
            }
        }
    }

};




export default queries
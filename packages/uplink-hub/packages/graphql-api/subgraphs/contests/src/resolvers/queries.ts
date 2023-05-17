import { DecimalScalar, schema } from "lib";
import { sqlOps, db } from '../utils/database.js';

const fetchContestTopLevel = async (contestId?: number, spaceId?: number) => {
    const where = contestId
        ? sqlOps.eq(schema.contests.id, contestId)
        : spaceId
            ? sqlOps.eq(schema.contests.spaceId, spaceId)
            : null;

    if (!where) return null;


    const result = await db.select({
        id: schema.contests.id,
        spaceId: schema.contests.spaceId,
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
        .where(where);
    
    return result;
}


const fetchSubmitterRewards = async (contestId: number) => {
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
                amount: DecimalScalar.parseValue(reward.tokenReward.amount)
            }
        }
    });
}

const fetchVoterRewards = async (contestId: number) => {
    const voterRewards = await db.select({
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
        .where(sqlOps.and(sqlOps.eq(schema.rewards.contestId, contestId), sqlOps.eq(schema.rewards.recipient, "voter")));

    return voterRewards.map((reward) => {
        return {
            ...reward,
            tokenReward: {
                ...reward.tokenReward,
                amount: DecimalScalar.parseValue(reward.tokenReward.amount)
            }
        }
    });
}


const fetchSubmitterRestrictions = async (contestId: number) => {
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
                threshold: DecimalScalar.parseValue(restriction.tokenRestriction.threshold)
            }

        }
    });
}

const fetchVotingPolicy = async (contestId: number) => {
    const votingPolicy = await db.select({
        id: schema.votingPolicy.id,
        contestId: schema.votingPolicy.contestId,
        strategyType: schema.votingPolicy.strategyType,
        arcadeVotingPolicy: {
            ...schema.arcadeVotingStrategy,
            token: schema.tokens
        } as any,
        weightedVotingPolicy: {
            ...schema.weightedVotingStrategy,
            token: schema.tokens
        } as any
    })
        .from(schema.votingPolicy)
        .leftJoin(schema.arcadeVotingStrategy, sqlOps.eq(schema.arcadeVotingStrategy.votingPolicyId, schema.votingPolicy.id))
        .leftJoin(schema.weightedVotingStrategy, sqlOps.eq(schema.weightedVotingStrategy.votingPolicyId, schema.votingPolicy.id))
        .leftJoin(schema.tokens, sqlOps.eq(schema.tokens.id, schema.arcadeVotingStrategy.tokenLink))
        .where(sqlOps.eq(schema.votingPolicy.contestId, contestId));




    return votingPolicy.map((policy) => {
        return {
            ...policy,
            arcadeVotingPolicy: {
                ...policy.arcadeVotingPolicy,
                votingPower: DecimalScalar.parseValue(policy.arcadeVotingPolicy.votingPower)
            },
        }
    })
}


const singleContestByContestId = async (id: string) => {
    const contestId = parseInt(id);

    const [contestTopLevel, submitterRewards, voterRewards, submitterRestrictions, votingPolicy] = await Promise.all([
        fetchContestTopLevel(contestId, null),
        fetchSubmitterRewards(contestId),
        fetchVoterRewards(contestId),
        fetchSubmitterRestrictions(contestId),
        fetchVotingPolicy(contestId)
    ])

    return {
        ...contestTopLevel[0],
        submitterRewards,
        voterRewards,
        submitterRestrictions,
        votingPolicy
    }
}


const multiContestsBySpaceId = async (id: string) => {
    const spaceId = parseInt(id);
    const contestTopLevel = await fetchContestTopLevel(null, spaceId);
    const result = await Promise.all(contestTopLevel.map(async (contest) => {
        const [submitterRewards, voterRewards, submitterRestrictions, votingPolicy] = await Promise.all([
            fetchSubmitterRewards(contest.id),
            fetchVoterRewards(contest.id),
            fetchSubmitterRestrictions(contest.id),
            fetchVotingPolicy(contest.id)
        ])
        return {
            ...contest,
            submitterRewards,
            voterRewards,
            submitterRestrictions,
            votingPolicy
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

        activeContests() {
            return contests.filter(contest => contest.deadlines.startTime > '0')
        }

    },

    // used to resolve contests to spaces
    Space: {
        contests(space) {
            console.log('IN HERE')
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

const contests = [
    {
        id: 1,
        spaceId: 1,
        metadata: {
            type: 'contest',
            category: 'art'
        },
        deadlines: {
            startTime: '2021-05-01T00:00:00.000Z',
            voteTime: '2021-05-08T00:00:00.000Z',
            endTime: '2021-05-15T00:00:00.000Z',
            snapshot: '2021-04-30T00:00:00.000Z'
        },
        created: '2021-04-01T00:00:00.000Z',
        promptUrl: 'https://calabara.mypinata.cloud/ipfs/QmUVdqmqf1KDy6syiZeYXBZcn7a849qssJckRwxr35MMDd',
        submitterRewards: [
            {
                rank: 1,
                rewards: [
                    {
                        token: {
                            address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                            symbol: 'DAI',
                            decimals: 18,
                            type: 'ERC20'
                        },
                        tokenId: 100
                    }
                ]
            }
        ]
    },
];



export default queries
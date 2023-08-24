import { Decimal, schema } from "lib";
import { sqlOps, db } from '../utils/database.js';


const dbWith = {
    submissions: false,
    rewards: {
        with: {
            tokenReward: {
                with: {
                    token: true,
                }
            }
        }
    },
    submitterRestrictions: {
        with: {
            tokenRestriction: {
                with: {
                    token: true,
                }
            }
        }
    },
    votingPolicy: {
        with: {
            weightedVotingStrategy: {
                with: {
                    token: true
                }
            },
            arcadeVotingStrategy: {
                with: {
                    token: true
                }
            }
        }
    }
}

const dbExtras = {
    metadata: sqlOps.sql`json_object(
        'type', ${schema.contests.type},
        'category', ${schema.contests.category}
    )`.as('metadata'),
    deadlines: sqlOps.sql`json_object(
        'startTime', ${schema.contests.startTime},
        'voteTime', ${schema.contests.voteTime},
        'endTime', ${schema.contests.endTime},
        'snapshot', ${schema.contests.snapshot}
    )`.as('deadlines'),
    additionalParams: sqlOps.sql`json_object(
        'anonSubs', ${schema.contests.anonSubs},
        'visibleVotes', ${schema.contests.visibleVotes},
        'selfVote', ${schema.contests.selfVote},
        'subLimit', ${schema.contests.subLimit}
    )`.as('additional_params'),
}



export const dbSingleContestById = db.query.contests.findFirst({
    where: (contest) => sqlOps.eq(contest.id, sqlOps.placeholder('contestId')),
    with: dbWith,
    extras: dbExtras
}).prepare();


const dbMultiContestsBySpaceId = db.query.contests.findMany({
    where: (contest) => sqlOps.eq(contest.spaceId, sqlOps.placeholder('spaceId')),
    with: dbWith,
    extras: dbExtras,
    orderBy: sqlOps.desc(schema.contests.created),
}).prepare();


// don't show contests that are waiting for announcement tweets
const dbActiveContests = db.query.contests.findMany({
    where: (contest) => sqlOps.and(
        sqlOps.gt(contest.endTime, new Date().toISOString()),
        sqlOps.or(
            sqlOps.and(
                sqlOps.eq(contest.type, 'twitter'),
                sqlOps.not(sqlOps.isNull(contest.tweetId)),
            ),
            sqlOps.eq(contest.type, 'standard')
        )
    ),
    with: dbWith,
    extras: dbExtras,
    limit: 10,
}).prepare();

export const dbContestTweetQueue = db.query.tweetQueue.findFirst({
    where: (queue) => sqlOps.and(
        sqlOps.eq(queue.contestId, sqlOps.placeholder('contestId')),
        sqlOps.eq(queue.jobContext, 'contest')
    )
}).prepare();

const postProcessContest = (contest, user) => {
    if (!contest) return null;

    const submitterRewards = [];
    const voterRewards = [];
    const submitterRestrictions = contest.submitterRestrictions.map(restriction => ({
        ...restriction,
        tokenRestriction: {
            ...restriction.tokenRestriction,
            threshold: new Decimal(restriction.tokenRestriction.threshold)
        }
    }));
    const votingPolicy = contest.votingPolicy.map(policy => {
        if (policy.strategyType === 'arcade') {
            return {
                ...policy,
                arcadeVotingPolicy: {
                    ...policy.arcadeVotingStrategy,
                    votingPower: new Decimal(policy.arcadeVotingStrategy.votingPower)
                }
            };
        } else if (policy.strategyType === 'weighted') {
            return {
                ...policy,
                weightedVotingPolicy: {
                    ...policy.weightedVotingStrategy
                }
            };
        }
        return policy;
    });

    for (const reward of contest.rewards) {
        const newReward = {
            ...reward,
            tokenReward: {
                ...reward.tokenReward,
                amount: new Decimal(reward.tokenReward.amount)
            }
        };
        if (reward.recipient === 'submitter') {
            submitterRewards.push(newReward);
        } else if (reward.recipient === 'voter') {
            voterRewards.push(newReward);
        }
    }

    return {
        ...contest,
        submitterRewards,
        voterRewards,
        submitterRestrictions,
        votingPolicy
    };
}


const queries = {
    Query: {
        async contest(_, { contestId }, contextValue, info) {
            const data = await dbSingleContestById.execute({ contestId }).then(postProcessContest)
            return data;
        },

        async activeContests() {
            const data = await dbActiveContests.execute().then(async (contests) => {
                return await Promise.all(contests.map(postProcessContest))
            });
            console.log(data)
            return data;
        },

        async isContestTweetQueued(_, { contestId }, contextValue, info) {
            const data = await dbContestTweetQueue.execute({ contestId });
            return !!data;
        }
    },

    // used to resolve contests to spaces
    Space: {
        async contests(space) {
            const data = await dbMultiContestsBySpaceId.execute({ spaceId: space.id })
                .then(async (contests) => {
                    return await Promise.all(contests.map(postProcessContest))
                });
            return data;
        }
    },

    Contest: {
        space: async (contest) => {
            return { id: contest.spaceId };
        }
    },

    ActiveContest: {
        space(contest) {
            return {
                id: contest.spaceId,
                name: contest.spaceName
            }
        }
    }

};


export default queries
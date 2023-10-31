import { DatabaseController, schema } from "lib";
import dotenv from 'dotenv';
dotenv.config();

const databaseController = new DatabaseController(process.env.DATABASE_HOST!, process.env.DATABASE_USERNAME!, process.env.DATABASE_PASSWORD!);
export const db = databaseController.db;
export const sqlOps = databaseController.sqlOps;


const dbWith = {
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


const postProcessContest = (contest: schema.dbContestType) => {
    if (!contest) return null;
    const submitterRewards = [];
    const voterRewards = [];

    for (const reward of contest.rewards) {
        if (reward.recipient === 'submitter') {
            submitterRewards.push({ rank: reward.rank, reward });
        } else if (reward.recipient === 'voter') {
            voterRewards.push({ rank: reward.rank, reward });
        }
    }

    return {
        ...contest,
        submitterRewards,
        voterRewards,
    };
}

const prepared_dbSingleContestById = db.query.contests.findFirst({
    where: (contest: schema.dbContestType) => sqlOps.eq(contest.id, sqlOps.placeholder('contestId')),
    with: dbWith,
    extras: dbExtras
}).prepare();


// don't show contests that are waiting for announcement tweets
const prepared_dbActiveContests = db.query.contests.findMany({
    where: (contest: schema.dbContestType) => sqlOps.and(
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


const prepared_dbMultiContestsBySpaceId = db.query.contests.findMany({
    where: (contest: schema.dbContestType) => sqlOps.eq(contest.spaceId, sqlOps.placeholder('spaceId')),
    with: dbWith,
    extras: dbExtras,
    orderBy: sqlOps.desc(schema.contests.created),
}).prepare();

const prepared_dbContestTweetQueue = db.query.tweetQueue.findFirst({
    where: (queue: schema.dbTweetQueueType) => sqlOps.and(
        sqlOps.eq(queue.contestId, sqlOps.placeholder('contestId')),
        sqlOps.eq(queue.jobContext, 'contest')
    )
}).prepare();

const prepared_dbUserSpaceAdmin = db.query.admins.findFirst({
    where: (admin: schema.dbAdminType) => sqlOps.and(
        sqlOps.eq(admin.address, sqlOps.placeholder('address')),
        sqlOps.eq(admin.spaceId, sqlOps.placeholder('spaceId'))
    )

}).prepare();


export const dbSingleContestById = async (contestId: number) => {
    return prepared_dbSingleContestById.execute({ contestId }).then(postProcessContest)
}

export const dbActiveContests = async () => {
    return prepared_dbActiveContests.execute().then(async (contests: schema.dbContestType[]) => await Promise.all(contests.map(postProcessContest)))
}

export const dbMultiContestsBySpaceId = async (spaceId: number) => {
    return prepared_dbMultiContestsBySpaceId.execute({ spaceId }).then(async (contests: schema.dbContestType[]) => await Promise.all(contests.map(postProcessContest)))
}

export const dbIsContestTweetQueued = async (contestId: number) => {
    return prepared_dbContestTweetQueue.execute({ contestId }).then((result: schema.dbTweetQueueType) => result ? true : false)
}

export const dbIsUserSpaceAdmin = async (user: any, spaceId: number) => {
    const isAdmin = await prepared_dbUserSpaceAdmin.execute({ address: user.address, spaceId: spaceId })
    return isAdmin
}
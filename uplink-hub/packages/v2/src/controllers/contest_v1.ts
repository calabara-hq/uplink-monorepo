import { Request, Response, NextFunction } from 'express'
import { db, sqlOps } from '../utils/database.js'
import { DatabaseController, schema } from "lib";
import dotenv from 'dotenv';
dotenv.config();

const databaseController = new DatabaseController(process.env.DATABASE_HOST!, process.env.DATABASE_USERNAME!, process.env.DATABASE_PASSWORD!);

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



const prepared_dbMultiContestsBySpaceId = db.query.contests.findMany({
    where: (contest: schema.dbContestType) => sqlOps.eq(contest.spaceId, sqlOps.placeholder('spaceId')),
    with: dbWith,
    extras: dbExtras,
    orderBy: sqlOps.desc(schema.contests.created),
}).prepare();


const prepared_dbUserSpaceAdmin = db.query.admins.findFirst({
    where: (admin: schema.dbAdminType) => sqlOps.and(
        sqlOps.eq(admin.address, sqlOps.placeholder('address')),
        sqlOps.eq(admin.spaceId, sqlOps.placeholder('spaceId'))
    )

}).prepare();

export const getSingleV1Contest = async (req: Request, res: Response, next: NextFunction) => {

    const id = req.query.id;

    try {
        const contest = await prepared_dbSingleContestById.execute({ contestId: id }).then(postProcessContest)
        res.send(contest).status(200);
    } catch (err) {
        next(err);
    }

}

export const getMultiV1ContestsBySpaceId = async (spaceId: string) => {
    const contests = await prepared_dbMultiContestsBySpaceId.execute({ spaceId }).then(contests => contests.map(postProcessContest))
    return contests;
}
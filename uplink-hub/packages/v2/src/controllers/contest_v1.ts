import { Request, Response, NextFunction } from 'express'
import { db, sqlOps } from '../utils/database.js'
import { Decimal, schema } from "lib";
import dotenv from 'dotenv';
import { dbVoteType } from 'lib/dist/drizzle/schema.js';
dotenv.config();

const dbWith = {
    space: true,
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

const postProcessSubmission = (submission: schema.dbSubmissionType) => {

    return {
        ...submission,
        totalVotes: submission.votes.reduce((acc: Decimal, vote: dbVoteType) => acc.plus(new Decimal(vote.amount)), new Decimal(0)),
        author: submission.author,
    }
}

const sortSubmissions = (submissions: any) => {

    // contest is over, sort by total votes.
    return submissions.sort((a: any, b: any) => {
        if (!a.totalVotes || !b.totalVotes) return 0;
        const diff = b.totalVotes.minus(a.totalVotes)
        // if there is a tie, give the submission with more unique voters the higher rank.
        if (diff.equals(new Decimal(0))) {
            const voteCountDiff = b.votes.length - a.votes.length;
            // if there is still a tie, give the submission that was submitted first the higher rank.
            if (voteCountDiff === 0) {
                return Date.parse(a.created) - Date.parse(b.created);
            }
            return voteCountDiff;
        }
        return diff.toNumber();
    })

}


const prepared_dbSingleContestById = db.query.contests.findFirst({
    where: (contest: schema.dbContestType) => sqlOps.eq(contest.id, sqlOps.placeholder('contestId')),
    with: { ...dbWith, submissions: { with: { votes: true } } },
    extras: dbExtras
}).prepare();


const prepared_dbMultiContestsBySpaceId = db.query.contests.findMany({
    where: (contest: schema.dbContestType) => sqlOps.eq(contest.spaceId, sqlOps.placeholder('spaceId')),
    with: dbWith,
    extras: dbExtras,
    orderBy: sqlOps.desc(schema.contests.created),
}).prepare();

const prepared_singleSubmissionById = db.query.submissions.findFirst({
    where: (submission: schema.dbSubmissionType) => sqlOps.eq(submission.id, sqlOps.placeholder('id')),
    with: {
        author: true,
        votes: true,
        contest: true,
    }
}).prepare();

export const getSingleV1Contest = async (req: Request, res: Response, next: NextFunction) => {

    const id = req.query.id;

    try {
        const contest = await prepared_dbSingleContestById.execute({ contestId: id })
            .then(postProcessContest)
            .then(data => {
                return {
                    ...data,
                    submissions: sortSubmissions(data.submissions.map(postProcessSubmission))
                }
            })


        res.send(contest).status(200);
    } catch (err) {
        next(err);
    }

}

export const getSingleLegacyContestSubmission = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.query.id;

    try {
        const submission = await prepared_singleSubmissionById.execute({ id }).then(res => {
            return {
                ...res,
                totalVotes: res.votes.reduce((acc: Decimal, vote: { amount: string }) => acc.plus(new Decimal(vote.amount)), new Decimal(0)),
            }
        })
        res.send(submission).status(200);
    } catch (err) {
        next(err);
    }
}

export const getMultiV1ContestsBySpaceId = async (spaceId: string) => {
    const contests = await prepared_dbMultiContestsBySpaceId.execute({ spaceId }).then(contests => contests.map(postProcessContest))
    return contests;
}


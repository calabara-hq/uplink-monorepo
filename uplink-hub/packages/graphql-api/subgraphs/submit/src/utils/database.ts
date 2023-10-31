import { DatabaseController, schema } from "lib";
import dotenv from 'dotenv';
import { Submission } from "../__generated__/resolvers-types";
dotenv.config();

const databaseController = new DatabaseController(process.env.DATABASE_HOST!, process.env.DATABASE_USERNAME!, process.env.DATABASE_PASSWORD!);
export const db = databaseController.db;
export const sqlOps = databaseController.sqlOps;


// include the contest object so we can filter fields that may need to be hidden (votes, author)
const prepared_singleSubmissionById = db.query.submissions.findFirst({
    where: (submission: schema.dbSubmissionType) => sqlOps.eq(submission.id, sqlOps.placeholder('submissionId')),
    with: {
        votes: true,
        contest: true
    }
}).prepare();

// we don't need to include the contest object here because the reference to the fields we need 
// (additional params, deadlines)  is resolved by the schema
const prepared_submissionsByContestId = db.query.submissions.findMany({
    where: (submission: schema.dbSubmissionType) => sqlOps.eq(submission.contestId, sqlOps.placeholder('contestId')),
    with: {
        votes: true,
    }
}).prepare();



const prepared_getRewards = db.query.rewards.findMany({
    where: (reward: schema.dbRewardType) => sqlOps.eq(reward.contestId, sqlOps.placeholder('contestId')),
    with: {
        tokenReward: {
            with: {
                token: true,
            }
        }
    }
}).prepare();


export const dbSingleSubmissionById = async (submissionId: number): Promise<schema.dbSubmissionType> => {
    return prepared_singleSubmissionById.execute({ submissionId });
}

export const dbSubmissionsByContestId = async (contestId: number): Promise<Array<schema.dbSubmissionType>> => {
    return prepared_submissionsByContestId.execute({ contestId });
}

export const dbGetRewards = async (contestId: number): Promise<Array<schema.dbRewardType>> => {
    return prepared_getRewards.execute({ contestId });
}


// get the last 3 contests that have ended, get submissions with more than 3 unique votes, and take a random sample of 20

export const dbGetPopularSubmissions = async (): Promise<Array<schema.dbSubmissionType>> => {
    const data = await db.execute(sqlOps.sql`
        SELECT s.*
        FROM submissions s
        JOIN (
            SELECT id, created
            FROM contests
            ORDER BY created DESC
            LIMIT 3
        ) AS latest_contests ON s.contestId = latest_contests.id
        WHERE EXISTS (
            SELECT 1
            FROM votes v
            WHERE v.submissionId = s.id
            GROUP BY v.submissionId
            HAVING COUNT(DISTINCT v.id) > 3
        )
        ORDER BY RAND()
        LIMIT 20;
    `)
    return data.rows
}
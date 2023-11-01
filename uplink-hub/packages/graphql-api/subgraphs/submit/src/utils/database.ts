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
    // const data = await db.execute(sqlOps.sql`
    //     SELECT s.*
    //     FROM submissions s
    //     JOIN (
    //         SELECT id, created, endTime
    //         FROM contests
    //         WHERE endTime < NOW()
    //         ORDER BY created DESC
    //         LIMIT 3
    //     ) AS latest_contests ON s.contestId = latest_contests.id
    //     WHERE EXISTS (
    //         SELECT 1
    //         FROM votes v
    //         WHERE v.submissionId = s.id
    //         GROUP BY v.submissionId
    //         HAVING COUNT(DISTINCT v.id) > 3
    //     )
    //     ORDER BY RAND()
    //     LIMIT 20;
    // `)




    const data = await db.execute(sqlOps.sql`
        SELECT s.*, COALESCE(vote_counts.uniqueVotes, 0) AS uniqueVotes
        FROM submissions s
        JOIN (
            SELECT id, created, endTime
            FROM contests
            WHERE endTime < NOW()
            ORDER BY created DESC
            LIMIT 3
        ) AS latest_contests ON s.contestId = latest_contests.id
        LEFT JOIN (
            SELECT v.submissionId, COUNT(DISTINCT v.id) AS uniqueVotes
            FROM votes v
            GROUP BY v.submissionId
            HAVING uniqueVotes > 1
        ) AS vote_counts ON s.id = vote_counts.submissionId
        ORDER BY RAND()
    `)

    // sample the subs that have more than 3 unique votes
    // if length of 3vote array is < 10, sample the subs that have 2 unique votes
    // if length of 2vote array is < 10, just return the original array

    const subsWith3PlusVotes = data.rows.filter((sub: Submission & { uniqueVotes: number }) => sub.uniqueVotes >= 3)
    // if > 20, return a random sample of 20
    if (subsWith3PlusVotes.length > 20) {
        return subsWith3PlusVotes.sort(() => Math.random() - Math.random()).slice(0, 20)
    }
    // if > 10, return the array as is
    if (subsWith3PlusVotes.length >= 10) {
        return subsWith3PlusVotes
    }

    // if < 10, keep going

    const subsWith2PlusVotes = data.rows.filter((sub: Submission & { uniqueVotes: number }) => sub.uniqueVotes >= 2)

    // if > 20, return a random sample of 20
    if (subsWith2PlusVotes.length > 20) {
        return subsWith2PlusVotes.sort(() => Math.random() - Math.random()).slice(0, 20)
    }
    // if > 10, return the array as is
    if (subsWith2PlusVotes.length >= 10) {
        return subsWith2PlusVotes
    }

    // if < 10, work with the original array

    // if > 20, return a random sample of 20
    if (data.rows.length > 20) {
        return data.rows.sort(() => Math.random() - Math.random()).slice(0, 20)
    }

    // otherwise return the original array
    return data.rows
}
import cron from 'node-cron';
import { DatabaseController, schema, CipherController } from 'lib';
import dotenv from 'dotenv';
import { TwitterController } from './twitter.js';
import { SendTweetV2Params, TwitterApiError } from 'twitter-api-v2';
dotenv.config();


const cipherController = new CipherController(process.env.APP_SECRET);
const databaseController = new DatabaseController(process.env.DATABASE_HOST, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);
export const db = databaseController.db;
export const sqlOps = databaseController.sqlOps;


type ThreadItem = {
    id: string;
    text: string;
    media?: {
        type: string;
        size: string;
        url: string;
    }
}


const setJobStatus = async (id: number, status: 'ready' | 'failed' | 'pending' | 'success') => {
    const statusMap = {
        ready: 0,
        failed: 1,
        pending: 2,
        success: 3
    }

    await db.update(schema.tweetQueue).set({ status: statusMap[status] }).where(sqlOps.eq(schema.tweetQueue.id, id))

}


const setJobError = async (id: number, error: string) => {
    await db.update(schema.tweetQueue).set({ error }).where(sqlOps.eq(schema.tweetQueue.id, id))
}

const setJobRetries = async (id: number) => {
    await db.update(schema.tweetQueue).set({ retries: schema.tweetQueue.retries + 1 }).where(sqlOps.eq(schema.tweetQueue.id, id))
}

const getJobQuoteTweetId = async (contestId: string) => {
    const quoteTweetId = await db.select({
        tweetId: schema.contests.tweetId
    }).from(schema.contests).where(sqlOps.eq(schema.contests.id, contestId))
    return quoteTweetId;
}


// id: serial('id').primaryKey(),
// contestId: int('contestId').notNull(),
// author: varchar('author', { length: 255 }).notNull(),
// jobContext: varchar('jobContext', { length: 255 }).notNull(),   // 'submission' or 'contest'
// payload: json('payload').notNull().default('[]'),
// accessToken: varchar('accessToken', { length: 255 }).notNull(),
// accessSecret: varchar('accessSecret', { length: 255 }).notNull(),
// retries: int('retries').notNull(),
// status: tinyint('status').notNull(),                        // 0 = ready, 1 = failed, 2 = pending, 3 = success

const triageJobs = async () => {
    const jobs = await db.select({
        id: schema.tweetQueue.id,
        contestId: schema.tweetQueue.contestId,
        author: schema.tweetQueue.author,
        jobContext: schema.tweetQueue.jobContext,
        payload: schema.tweetQueue.payload,
        accessToken: schema.tweetQueue.accessToken,
        accessSecret: schema.tweetQueue.accessSecret,
        retries: schema.tweetQueue.retries,
        status: schema.tweetQueue.status,
    }).from(schema.tweetQueue)
        .where(sqlOps.lt(schema.tweetQueue.status, 2))
        .orderBy(sqlOps.asc(schema.tweetQueue.jobContext))  // give priority to announcement tweets
        .orderBy(sqlOps.asc(schema.tweetQueue.created))   // give priority to oldest jobs
        .limit(15);

    return jobs;
}

const handleJob = async (job: schema.dbTweetQueueType) => {
    const payload = job.payload as ThreadItem[]
    const { accessToken, accessSecret } = job;
    const quoteTweetId = job.jobContext === 'submission' ? await getJobQuoteTweetId(job.contestId) : undefined;
    if (job.jobContext === 'submission' && !quoteTweetId) return; // need to wait for contest to be announced
    await setJobStatus(job.id, 'pending');

    try {
        const token = {
            key: cipherController.decrypt(accessToken),
            secret: cipherController.decrypt(accessSecret)
        }

        const twitterController = new TwitterController(token.key, token.secret);
        await Promise.all(payload.map(async (item) => {
            if (item.media) {
                const media_id = await twitterController.uploadTweetMedia(item);
                return {
                    ...item,
                    media: { media_ids: [media_id] }
                }
            } else {
                return item;
            }
        }))
            .then(async (res) => {
                await twitterController.sendTweet(res as SendTweetV2Params[], quoteTweetId)
                    .then(async () => {
                        await setJobStatus(job.id, 'success');
                        console.log('successfully sent tweet!')
                    })
            })
    } catch (err) {
        console.log(err)
        await setJobStatus(job.id, 'failed');
        await setJobError(job.id, err.message);
        await setJobRetries(job.id);
    }
}

const mainLoop = async () => {
    const jobs = await triageJobs();
    await Promise.all(jobs.map(async (job) => {
        await handleJob(job);
    }));
}

export const tweet = async (frequency) => {
    cron.schedule(frequency, () => {
        mainLoop();
    })
}
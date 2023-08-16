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

// job status levels
const statusMap = {
    ready: 0,
    failed: 1,
    pending: 2,
    success: 3
}


const getJobs = db.query.tweetQueue.findMany({
    with: { contest: true },
    where: (tweetQueue) =>
        sqlOps.and(
            sqlOps.lt(schema.tweetQueue.status, 2),
            sqlOps.or(
                sqlOps.and(
                    sqlOps.eq(schema.tweetQueue.jobContext, 'contest'),
                    sqlOps.or(   // pluck contests that are close to starting or have technically already started. ignore contests that are far in the future
                        sqlOps.and(
                            sqlOps.gte(schema.tweetQueue.created, sqlOps.placeholder('adjustedTime')),
                            sqlOps.lte(schema.tweetQueue.created, sqlOps.placeholder('currentTime'))
                        ),
                        sqlOps.gt(sqlOps.placeholder('currentTime'), schema.tweetQueue.created)
                    )
                ),
                sqlOps.eq(schema.tweetQueue.jobContext, 'submission')
            )),
    orderBy: (jobs => [
        sqlOps.asc(jobs.jobContext), // give priority to announcement tweets
        sqlOps.asc(jobs.created)   // give priority to oldest jobs
    ]),

    limit: 15,
}).prepare();



const setJobStatus = async (id: number, status: 'ready' | 'failed' | 'pending' | 'success') => {
    await db.update(schema.tweetQueue).set({ status: statusMap[status] }).where(sqlOps.eq(schema.tweetQueue.id, id))
}


const setJobError = async (id: number, error: string) => {
    await db.update(schema.tweetQueue).set({ error }).where(sqlOps.eq(schema.tweetQueue.id, id))
}

const setJobRetries = async (id: number) => {
    await db.update(schema.tweetQueue).set({ retries: sqlOps.sql`${schema.tweetQueue.retries} + 1` }).where(sqlOps.eq(schema.tweetQueue.id, id))
}

const getJobQuoteTweetId = async (contestId: number) => {
    const quoteTweetId = await db.select({
        tweetId: schema.contests.tweetId
    }).from(schema.contests).where(sqlOps.eq(schema.contests.id, contestId))
    return quoteTweetId;
}

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
        .where(
            sqlOps.and(
                sqlOps.lt(schema.tweetQueue.status, 2),
                sqlOps.or(
                    sqlOps.and(
                        sqlOps.eq(schema.tweetQueue.jobContext, 'contest'),
                        sqlOps.gte(schema.tweetQueue.created, sqlOps.sql`NOW() - INTERVAL '5 minutes'`)
                    ),
                    sqlOps.eq(schema.tweetQueue.jobContext, 'submission')
                ))
        )
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
    //const jobs = await triageJobs();
    //const adjustedTime = new Date(Date.now() - 5 * 60 * 1000);
    // create an adjustedTime to be now - 5 minutes
    const adjustedTime = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const currentTime = new Date().toISOString();
    const jobs = await getJobs.execute({ adjustedTime, currentTime });

    await Promise.all(jobs.map(async ({ contest, ...job }) => {
        await handleJob(job as schema.dbTweetQueueType);
    }));
}

export const tweet = async (frequency) => {
    cron.schedule(frequency, () => {
        mainLoop();
    })
}
import cron from 'node-cron';
import { DatabaseController, schema, CipherController } from 'lib';
import dotenv from 'dotenv';
import { TwitterController } from './twitter';
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
        //   size: number;
        url: string;
    }
}


const triageJobs = async () => {
    const jobs = await db.select({
        contestId: schema.tweetQueue.id,
        author: schema.tweetQueue.author,
        jobType: schema.tweetQueue.jobType,
        jobContext: schema.tweetQueue.jobContext,
        payload: schema.tweetQueue.payload,
        accessToken: schema.tweetQueue.accessToken,
        expiresAt: schema.tweetQueue.expiresAt,
        retries: schema.tweetQueue.retries,
        status: schema.tweetQueue.status,
    }).from(schema.tweetQueue)
        .where(sqlOps.lt(schema.tweetQueue.status, 2))
        .orderBy(sqlOps.asc(schema.tweetQueue.jobContext))  // give priority to announcement tweets
        .orderBy(sqlOps.asc(schema.tweetQueue.expiresAt))   // give priority to credentials that are about to expire
        .limit(15);

    return jobs;
}


const sendTweet = async (job: schema.dbTweetQueueType) => {
    console.log('sending tweet')
}

const uploadMedia = async (job: schema.dbTweetQueueType) => {
    const payload = job.payload as ThreadItem[]
    const { accessToken, accessSecret } = job;

    const token = {
        key: cipherController.decrypt(accessToken),
        secret: cipherController.decrypt(accessSecret)
    }

    const twitterController = new TwitterController(token.key, token.secret);
    const thread = await Promise.all(payload.map(async (item) => {
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
        .then(res => {
            console.log('success uploading media')
            return res;
        })
        .catch(err => {
            console.log(JSON.stringify(err, null, 2))
        })

}

const mainLoop = async () => {
    const jobs = await triageJobs();
    //console.log('jobs', JSON.stringify(jobs, null, 2))
    for (const job of jobs) {
        if (job.jobType === 'upload') {
            await uploadMedia(job);
        } else if (job.jobType === 'tweet') {
            await sendTweet(job);
        }
    }
}

export const tweet = async (frequency) => {
    cron.schedule(frequency, () => {
        mainLoop();
    })
}
import axios from 'axios';
import { TwitterApi, SendTweetV2Params, MediaStatusV1Result } from 'twitter-api-v2';
import stream from 'stream';
import dotenv from 'dotenv';
dotenv.config();



const sleepSecs = (seconds: number) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

type ThreadItem = {
    id: string;
    text: string;
    media?: {
        type: string;
        size: string;
        url: string;
    }
}


export class TwitterController {

    private client: any;

    constructor(accessToken: string, accessSecret: string) {
        this.client = new TwitterApi({ appKey: process.env.TWITTER_CONSUMER_KEY, appSecret: process.env.TWITTER_CONSUMER_SECRET, accessToken, accessSecret })
    }

    public async validateSession() {
        try {
            const session = await this.client.currentUser();
            return session;
        } catch (e) {
            throw new Error(`failed to establish a twitter session`)
        }
    }

    public async processThread(thread: SendTweetV2Params[]) {
        const processedThread = thread.map((el) => {
            const { text, media } = el;
            return {
                ...(text && { text }),
                ...(media && { media }),
            }
        });
        if (!processedThread || processedThread.length === 0) throw new Error('invalid thread');
        return processedThread;
    }



    public async uploadTweetMedia(tweet: ThreadItem) {

        await this.validateSession();
        // INIT
        const mediaUrl = tweet.media.url;

        const acceptedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'video/mp4'];
        if (!acceptedMimeTypes.includes(tweet.media.type)) throw new Error('invalid media type');

        const initResponse = await this.client.v1.post(
            'media/upload.json',
            {
                command: 'INIT',
                total_bytes: tweet.media.size,
                media_type: tweet.media.type,
                additional_owners: ['1539985534327595008']
            },
            { prefix: 'https://upload.twitter.com/1.1/' }
        );

        // APPEND
        const mediaStream = await axios.get(mediaUrl, { responseType: 'stream' });
        const chunks = mediaStream.data.pipe(new stream.PassThrough({ highWaterMark: 64 * 1024 }));
        let index = 0;

        for await (const chunk of chunks) {
            console.log(`Uploading chunk ${index}...`)
            const res = await this.client.v1.post(
                'media/upload.json',
                {
                    command: 'APPEND',
                    media_id: initResponse.media_id_string,
                    segment_index: index.toString(),
                    media: chunk,
                },
                { prefix: 'https://upload.twitter.com/1.1/' }
            );
            index++;
        }

        // FINALIZE
        const finalizeResponse = await this.client.v1.post(
            'media/upload.json',
            { command: 'FINALIZE', media_id: initResponse.media_id_string, allow_async: true },
            { prefix: 'https://upload.twitter.com/1.1/' }
        );

        // WAIT FOR PROCESSING
        if (finalizeResponse.processing_info && finalizeResponse.processing_info.state !== 'succeeded') {
            // Must wait if video is still computed
            await this.waitForUploadCompletion(finalizeResponse);
        }

        // Video is ready, return media_id
        return finalizeResponse.media_id_string;

    }


    async waitForUploadCompletion(mediaData: MediaStatusV1Result) {
        while (true) {
            const status = await this.client.v1.mediaInfo(mediaData.media_id_string);
            console.log('CURRENT MEDIA DATA \n', JSON.stringify(status, null, 2))
            const { processing_info } = status;

            if (!processing_info || processing_info.state === 'succeeded') {
                // Ok, completed!
                console.log('success')
                return;
            }

            if (processing_info.state === 'failed') {
                if (processing_info.error) {
                    const { name, message } = processing_info.error;
                    throw new Error(`Failed to process media: ${name} - ${message}.`);
                }

                throw new Error('Failed to process the media.');
            }

            if (processing_info.check_after_secs) {
                // Await for given seconds
                await sleepSecs(processing_info.check_after_secs);
            }
            else {
                // No info; Await for 5 seconds
                await sleepSecs(5);
            }
        }
    }


    public async sendTweet(thread: SendTweetV2Params[], quoteTweetId?: string) {
        await this.validateSession();
        const processedThread: SendTweetV2Params[] = await this.processThread(thread);
        if (quoteTweetId) processedThread[0].quote_tweet_id = quoteTweetId;
        const tweetResponse = await this.client.v2.tweetThread(processedThread);
        return tweetResponse[0].data.id;
    }


}
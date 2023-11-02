// look at account DMs and attempt to verify codes
import { TwitterApi } from 'twitter-api-v2';

import dotenv from 'dotenv';
dotenv.config();

const client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY!,
    appSecret: process.env.TWITTER_CONSUMER_SECRET!,
    accessToken: process.env.UPLINK_TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.UPLINK_TWITTER_ACCESS_SECRET!
})

const listen = async () => {

    //const { data: userObject } = await client.v2.me({ "user.fields": ["profile_image_url"] });
    //console.log(userObject);

    const { data: dmList } = await client.v2.listDmEvents({

    });
    console.log(dmList)

    // const session = await client.currentUser();
    // console.log(session)
}

export default listen;

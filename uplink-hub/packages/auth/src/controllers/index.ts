import { randomBytes, randomUUID } from 'crypto';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import { CipherController, schema } from 'lib'
import { createPublicClient, http, verifyMessage } from 'viem';
import { mainnet } from 'viem/chains';
import Redis, { Redis as RedisType } from 'ioredis';

dotenv.config();

import { sqlOps, db } from "../utils/database.js";

const cipherController = new CipherController(process.env.APP_SECRET)
const twitterClient = new TwitterApi({ appKey: process.env.TWITTER_CONSUMER_KEY, appSecret: process.env.TWITTER_CONSUMER_SECRET, accessToken: process.env.TWITTER_ACCESS_TOKEN, accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET })
const redisClient = new Redis(process.env.REDIS_URL);



export const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`),
})


const twitterRedirect = process.env.TWITTER_CALLBACK_URL

const twitterScopes = {
    write: ['tweet.read', 'users.read', 'tweet.write'],
    read: ['tweet.read', 'users.read']
}


interface SiweMessage {
    nonce: string;
    address: string;
    domain: string;
    version: string;
    chainId: number;
    uri: string;
    statement: string;
    issuedAt: ISODateString;
}

export type ISODateString = string;

type Session = {
    user?: {
        address?: string | null;
    };
    expires: ISODateString;
}




const prepareMessage = (message: SiweMessage) => {
    const header = `${message.domain} wants you to sign in with your Ethereum account:`;
    const uriField = `URI: ${message.uri}`;
    let prefix = [header, message.address].join("\n");
    const versionField = `Version: ${message.version}`;
    const chainField = `Chain ID: ` + message.chainId || "1";
    const nonceField = `Nonce: ${message.nonce}`;
    const suffixArray = [uriField, versionField, chainField, nonceField];
    suffixArray.push(`Issued At: ${message.issuedAt}`);
    const statement = message.statement;
    const suffix = suffixArray.join("\n");
    prefix = [prefix, statement].join("\n\n");
    return [(prefix += "\n"), suffix].join("\n");
};



const getCacheValue = async (key: string) => {
    const data = await redisClient.get(key);
    if (data) return JSON.parse(data);
    return null;
}

const setCacheValue = async (key: string, value: string) => {
    try {
        const data = await redisClient.set(key, value);
        return true;
    } catch (error) {
        console.error(`Failed to set cache value: ${error}`);
        return false;
    }

}


const addUser = async (user: Session['user']) => {
    try {
        await db.insert(schema.users).values({
            address: user.address,
        })
        return true;
    } catch (err) {
        return false;
    }
}

export const getCsrfToken = function (req, res) {
    let csrf = randomUUID().replace(/-/g, '')
    req.session.csrfToken = csrf
    res.send({ csrfToken: csrf })
}


export const getSession = function (req, res) {
    const session = req.session
    res.send(
        session.user
            ?
            { user: session.user, expires: session.cookie.expires, csrfToken: session.csrfToken }
            : {}
    )
}

export const verifySignature = async (req, res) => {
    try {
        const { message, signature } = req.body;
        const parsedMessage = JSON.parse(message)
        const siweMessage = prepareMessage(parsedMessage)
        const isValid = await verifyMessage({
            address: parsedMessage.address,
            message: siweMessage,
            signature
        })

        if (!isValid) return res.sendStatus(401);

        const session = req.session;
        const user = { address: parsedMessage.address }
        req.session.user = user
        await addUser(user);

        res.send({ user: user, expires: req.session.cookie.expires, csrfToken: session.csrfToken })
    } catch (err) {
        console.error(err)
        res.sendStatus(401)
    }

}


export const signOut = async (req, res) => {

    const { csrfToken } = req.body
    if (csrfToken !== req.session.csrfToken) return res.send(false)

    req.session.destroy((err) => {
        if (err) return res.send(false)
        return res.send(true)
    })
}

export const initiateTwitterAuth = async (req, res) => {
    const { scope, csrfToken } = req.body;
    if (!req.session.user) return res.status(401).send('You must be logged in to initiate Twitter OAuth');
    if (csrfToken !== req.session.csrfToken) return res.status(401).send('Invalid CSRF Token');
    const data = await twitterClient.generateAuthLink(twitterRedirect, { linkMode: 'authorize' });

    const { url, oauth_token, oauth_token_secret } = data;

    await setCacheValue(`SIWT-${oauth_token}`, JSON.stringify(oauth_token_secret));

    res.send({ url, scope })
}


export const oauthCallback = async (req, res) => {
    const { oauth_token, oauth_verifier } = req.query;
    const oauth_token_secret = await getCacheValue(`SIWT-${oauth_token}`)

    if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
        return res.status(400).send('You denied the app or your session expired!');
    }

    // Obtain the persistent tokens
    // Create a client from temporary tokens
    const client = new TwitterApi({
        appKey: process.env.TWITTER_CONSUMER_KEY,
        appSecret: process.env.TWITTER_CONSUMER_SECRET,
        accessToken: oauth_token,
        accessSecret: oauth_token_secret,
    });

    client.login(oauth_verifier)
        .then(async ({ client: loggedClient, accessToken, accessSecret }) => {
            const { data: userObject } = await loggedClient.v2.me({ "user.fields": ["profile_image_url"] });
            req.session.user.twitter = {
                ...userObject,
                profile_image_url_large: userObject.profile_image_url.replace('_normal', '_400x400'),
                accessToken: cipherController.encrypt(accessToken),
                accessSecret: cipherController.encrypt(accessSecret),
            }
            return res.send(`<script>window.close()</script>`)
        })
        .catch(() => res.status(403).send('Invalid verifier or access tokens!'));
}

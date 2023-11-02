import { randomUUID } from 'crypto';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import { CipherController, schema } from 'lib'
import { createPublicClient, http, verifyMessage } from 'viem';
import { mainnet } from 'viem/chains';
import Redis, { Redis as RedisType } from 'ioredis';

dotenv.config();

import { sqlOps, db } from "../utils/database.js";

const cipherController = new CipherController(process.env.APP_SECRET)
const twitterClient = new TwitterApi({ clientId: process.env.TWITTER_OAUTH_CLIENT_ID, clientSecret: process.env.TWITTER_OAUTH_CLIENT_SECRET })
const redisClient = new Redis(process.env.REDIS_URL);

export const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`),
})

const successful_redirect = '<script>window.close()</script><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Ubuntu"><html style="width: 100vw; height: 100vh; background-color: rgb(20, 20, 22); font-family: Ubuntu,sans,sans-serif"><body><div style="display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center;"><p style="font-size: 4.5em; color: rgb(211, 211, 211);">Successfully linked your account ✅</p><p style="font-size: 2em; color: grey;">Please close this window</p></div></html></body>'
const failed_redirect = '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Ubuntu"><html style="width: 100vw; height: 100vh; background-color: rgb(20, 20, 22); font-family: Ubuntu,sans,sans-serif"><body><div style="display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center;"><p style="font-size: 4.5em; color: rgb(211, 211, 211);">There was a problem linking your account 😕</p><p style="font-size: 2em; color: grey;">Please close this window and try again</p></div></html></body>'

const twitterRedirect = process.env.TWITTER_CALLBACK_URL

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

// add user to db. if anything fails, let it throw
const addUser = async (user: Session['user']) => {

    const [existing] = await db.select({ id: schema.users.id }).from(schema.users).where(sqlOps.eq(schema.users.address, user.address));
    if (existing) return existing.id;
    const insertResult = await db.insert(schema.users).values(user)
    return insertResult.insertId;
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
        const userId = await addUser(user);
        const userWithId = { ...user, id: userId }
        req.session.user = userWithId;

        res.send({ user: userWithId, expires: req.session.cookie.expires, csrfToken: session.csrfToken })
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


const scopes = {
    write: ['tweet.read', 'users.read', 'tweet.write'],
    read: ['tweet.read', 'users.read']
}

export const initiateTwitterAuth = async (req, res) => {
    const { scopeType, csrfToken } = req.body;

    if (!scopeType) {
        return res.status(400).send('Invalid scope type')
    }

    if (!scopes[scopeType]) {
        return res.status(400).send('Invalid scope type')
    }

    if (!req.session.user) return res.status(401).send('You must be logged in to initiate Twitter OAuth');
    if (csrfToken !== req.session.csrfToken) return res.status(401).send('Invalid CSRF Token');

    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(twitterRedirect, { scope: scopes[scopeType] });

    const sessionID = req.sessionID;

    // set a pointer to the current session. This is necc because the oauth callback is a different session.

    // gen a random uuid and base64 it 
    const randID = randomUUID()
    const randIDBase64 = Buffer.from(randID).toString('base64')

    await setCacheValue(`SIWT-${randIDBase64}`, JSON.stringify({ sessionID, state: randIDBase64, codeVerifier }));

    // replace the state query param with the base64 encoded random uuid
    const urlWithState = url.replace(`state=${state}`, `state=${randIDBase64}`)
    res.send({ url: urlWithState })
}

// oauth 2


export const oauthCallback = async (req, res) => {
    const { state, code } = req.query;
    const { sessionID, state: stateVerifier, codeVerifier } = await getCacheValue(`SIWT-${state}`)

    if (!codeVerifier || !state || !code || !stateVerifier) {
        return res.status(400).send('You denied the app or your session expired!');
    }

    if (state !== stateVerifier) return res.status(400).send('Stored tokens didnt match!');

    twitterClient.loginWithOAuth2({ code, codeVerifier, redirectUri: twitterRedirect })
        .then(async ({ client: loggedClient, accessToken, expiresIn }) => {
            const { data: userObject } = await loggedClient.v2.me({ "user.fields": ["profile_image_url"] });
            const { id, username, profile_image_url } = userObject;


            const userTwitterSession = {
                ...userObject,
                profile_image_url_large: profile_image_url.replace('_normal', '_400x400'),
                accessToken: cipherController.encrypt(accessToken),
                expiresAt: new Date(Date.now() + expiresIn * 1000),
            }

            const existingSession = await getCacheValue(`uplink-session:${sessionID}`)
            const newSession = { ...existingSession, user: { ...existingSession.user, twitter: userTwitterSession } }
            await setCacheValue(`uplink-session:${sessionID}`, JSON.stringify(newSession))
            await db.update(schema.users).set({ twitterId: id, twitterHandle: username, twitterAvatarUrl: profile_image_url }).where(sqlOps.eq(schema.users.address, newSession.user.address))
            return res.send(successful_redirect)

        })

        .catch((e) => {
            console.log(e)
            return res.send(failed_redirect)
        })
}





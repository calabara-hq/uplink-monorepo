import { randomUUID } from 'crypto';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import { CipherController, schema } from 'lib'
import { createPublicClient, http, verifyMessage } from 'viem';
import { base, mainnet, baseSepolia } from 'viem/chains';
import Redis, { Redis as RedisType } from 'ioredis';
import { parseErc6492Signature } from "viem/experimental";


dotenv.config();

import { sqlOps, db } from "../utils/database.js";

const cipherController = new CipherController(process.env.APP_SECRET)
const twitterClient = new TwitterApi({ clientId: process.env.TWITTER_OAUTH_CLIENT_ID, clientSecret: process.env.TWITTER_OAUTH_CLIENT_SECRET })
const redisClient = new Redis(process.env.REDIS_URL);

const SUPPORTED_CHAIN_IDS = [8453, 84532]

export const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`),
})

const successful_redirect = '<script>window.close()</script><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Ubuntu"><html style="width: 100vw; height: 100vh; background-color: rgb(20, 20, 22); font-family: Ubuntu,sans,sans-serif"><body><div style="display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center;"><p style="font-size: 4.5em; color: rgb(211, 211, 211);">Successfully linked your account ✅</p><p style="font-size: 2em; color: grey;">Please close this window</p></div></html></body>'
const failed_redirect = '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Ubuntu"><html style="width: 100vw; height: 100vh; background-color: rgb(20, 20, 22); font-family: Ubuntu,sans,sans-serif"><body><div style="display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center;"><p style="font-size: 4.5em; color: rgb(211, 211, 211);">There was a problem linking your account 😕</p><p style="font-size: 2em; color: grey;">Please close this window and try again</p></div></html></body>'

const twitterRedirect = process.env.TWITTER_CALLBACK_URL

const getChainById = (chainId: number) => {
    if (!SUPPORTED_CHAIN_IDS.includes(chainId)) return null;
    if (chainId === 8453) return base;
    if (chainId === 84532) return baseSepolia;
}

const createSigVerifyPubClient = (chainId: number) => {
    return createPublicClient({
        chain: getChainById(chainId),
        transport: http()
    })
}

console.log(parseErc6492Signature("0x000000000000000000000000ca11bde05977b3631167028862be2a173976ca110000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000028000000000000000000000000000000000000000000000000000000000000001e482ad56cb0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000ba5ed0c6aa8c49038f819e587e2633c4a9f428a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e43ffba36f00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000040ebb59c9b608c2fb0a7c973af3b3d60b70265f7c5a10feff5199022137c4488bbe1a38868876f08fd35e5c7f45ca4e686a475bb6b2be21d2474180517e3851e45000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000170000000000000000000000000000000000000000000000000000000000000001f6b8c7ef657b85c602861a7eebf3dbc9baeb029e2b13f05968f30179a7a6c95355b0597e1ad423118572c44059bd910c7c8254516240e56a8be13451311028650000000000000000000000000000000000000000000000000000000000000025f198086b2db17256731bc456673b96bcef23f51d1fbacdd7c4379ef65465572f1d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f77b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a22726c4e48776a354d316e50477079534e444650356a38785f73306f3972562d38646476644c524966517367222c226f726967696e223a2268747470733a2f2f6b6579732e636f696e626173652e636f6d222c2263726f73734f726967696e223a66616c73652c226f746865725f6b6579735f63616e5f62655f61646465645f68657265223a22646f206e6f7420636f6d7061726520636c69656e74446174614a534f4e20616761696e737420612074656d706c6174652e205365652068747470733a2f2f676f6f2e676c2f796162506578227d0000000000000000006492649264926492649264926492649264926492649264926492649264926492").signature.length)

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
const upsertUser = async (address: string): Promise<{ id: string, userName: string | null, displayName: string | null, profileAvatar: string | null }> => {

    const [existing] = await db.select({
        id: schema.users.id,
        userName: schema.users.userName,
        displayName: schema.users.displayName,
        profileAvatar: schema.users.profileAvatar,
    }).from(schema.users).where(sqlOps.eq(schema.users.address, address));
    if (existing) return {
        id: existing.id.toString(),
        userName: existing.userName,
        displayName: existing.displayName,
        profileAvatar: existing.profileAvatar
    }
    const insertResult = await db.insert(schema.users).values({ address })
    return {
        id: insertResult.insertId.toString(),
        userName: null,
        displayName: null,
        profileAvatar: null
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

        console.log(parsedMessage)
        console.log('///////')
        console.log(siweMessage)
        console.log(signature)

        const isValid = await createSigVerifyPubClient(parsedMessage.chainId).verifyMessage({
            address: parsedMessage.address,
            message: siweMessage,
            signature
        })

        if (!isValid) return res.sendStatus(401);

        const session = req.session;
        const user = await upsertUser(parsedMessage.address);
        const userWithDbInfo = { ...user, address: parsedMessage.address }
        req.session.user = userWithDbInfo;

        res.send({ user: userWithDbInfo, expires: req.session.cookie.expires, csrfToken: session.csrfToken })
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





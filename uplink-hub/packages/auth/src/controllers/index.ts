import { randomBytes, randomUUID } from 'crypto';
import { generateNonce, SiweMessage } from 'siwe';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import { CipherController, schema } from 'lib'
dotenv.config();

import { sqlOps, db } from "../utils/database.js";

const cipherController = new CipherController(process.env.APP_SECRET)
const twitterClient = new TwitterApi({ appKey: process.env.TWITTER_CONSUMER_KEY, appSecret: process.env.TWITTER_CONSUMER_SECRET, accessToken: process.env.TWITTER_ACCESS_TOKEN, accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET })

const twitterRedirect = "http://localhost:8080/api/auth/twitter/oauth"
const twitterScopes = {
    write: ['tweet.read', 'users.read', 'tweet.write'],
    read: ['tweet.read', 'users.read']
}


export type ISODateString = string;

type Session = {
    user?: {
        address?: string | null;
    };
    expires: ISODateString;
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
    console.log('session1', req.session, '\n')
    req.session.csrfToken = csrf
    console.log('session2', req.session, '\n')
    res.send({ csrfToken: csrf })
}


export const getSession = function (req, res) {
    const session = req.session
    res.send(
        session.user
            ?
            { user: session.user, expires: session.cookie.expires }
            : {}
    )
}

export const verifySignature = async (req, res) => {
    try {
        const { message, signature } = req.body;
        const siweMessage = new SiweMessage(JSON.parse(message));
        const session = req.session;
        const result = await siweMessage.verify({ signature, nonce: session.csrfToken })
        req.session.user = { address: result.data.address }
        const user = { address: result.data.address }
        await addUser(user);
        res.send({ user: user, expires: req.session.cookie.expires })
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
    const { scope } = req.body;
    if (!req.session.user) return res.status(401).send('You must be logged in to initiate Twitter OAuth')
    const data = await twitterClient.generateAuthLink(twitterRedirect, { linkMode: 'authorize' });

    const { url, oauth_token, oauth_token_secret } = data;

    req.session.SIWT = {
        oauth_token,
        oauth_token_secret
    }

    res.send({ url, scope })
}


export const oauthCallback = async (req, res) => {
    const { oauth_token, oauth_verifier } = req.query;
    const { oauth_token_secret } = req.session.SIWT;

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
            console.log(JSON.stringify(loggedClient, null, 2))

            const { data: userObject } = await loggedClient.v2.me({ "user.fields": ["profile_image_url"] });
            req.session.user.twitter = {
                ...userObject,
                profile_image_url_large: userObject.profile_image_url.replace('_normal', '_400x400'),
                accessToken: cipherController.encrypt(accessToken),
                accessSecret: cipherController.encrypt(accessSecret),
            }
            //TODO: send html page with success message
            return res.sendStatus(200)
        })
        .catch(() => res.status(403).send('Invalid verifier or access tokens!'));
}
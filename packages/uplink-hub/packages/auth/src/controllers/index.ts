import { randomBytes, randomUUID } from 'crypto';
import { generateNonce, SiweMessage } from 'siwe';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import { redisClient } from '../index.js';
dotenv.config();


const twitterClient = new TwitterApi({ clientId: process.env.TWITTER_OAUTH_CLIENT_ID, clientSecret: process.env.TWITTER_OAUTH_CLIENT_SECRET });
const twitterRedirect = "https://localhost:443/api/auth/twitter/oauth2"
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




export const getCsrfToken = function (req, res) {
    let csrf = randomUUID().replace(/-/g, '')
    req.session.csrfToken = csrf
    res.send({ csrfToken: csrf })
}


// returns Session or {}
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
    console.log('initiate session', req.sessionID)
    const { scope } = req.body;
    const { url, codeVerifier, state: stateVerifier } = twitterClient.generateOAuth2AuthLink(twitterRedirect, { scope: twitterScopes[scope] });
    req.session.SIWT = {
        codeVerifier,
        stateVerifier
    }

    res.send({ url, scope })
}


export const twitterOauth2 = async (req, res) => {
    const { state, code } = req.query;

    console.log('twitterOauth2', req.sessionID)

    const { codeVerifier, stateVerifier } = req.session.SIWT;

    if (!codeVerifier || !state || !stateVerifier || !code) {
        return res.status(400).send('You denied the app or your session expired!');
    }

    if (state !== stateVerifier) {
        return res.status(400).send('Stored tokens didnt match!');
    }

    // Obtain access token

    twitterClient.loginWithOAuth2({ code, codeVerifier, redirectUri: twitterRedirect })
        .then(async ({ client: loggedClient, accessToken, refreshToken, expiresIn }) => {
            // {loggedClient} is an authenticated client in behalf of some user
            // Store {accessToken} somewhere, it will be valid until {expiresIn} is hit.
            // If you want to refresh your token later, store {refreshToken} (it is present if 'offline.access' has been given as scope)

            // Example request
            const { data: userObject } = await loggedClient.v2.me({ "user.fields": ["profile_image_url"] });
            req.session.user.twitter = userObject
            console.log('TWITTER USER OBJECT', userObject)
            return res.sendStatus(200)
        })
        .catch(() => res.status(403).send('Invalid verifier or access tokens!'));

}
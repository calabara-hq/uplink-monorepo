import { randomBytes, randomUUID } from 'crypto';
import { generateNonce, SiweMessage } from 'siwe';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
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
    console.log(req.sessionID)
    const { scope } = req.body;
    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(twitterRedirect, { scope: twitterScopes[scope] });
    res.send({ url, scope })
}


export const twitterOauth2 = async (req, res) => {
    const { state, code } = req.query;
    console.log(req.sessionID)
    res.status(200).send({ state, code })

}
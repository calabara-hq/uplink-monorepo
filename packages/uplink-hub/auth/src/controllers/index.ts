import { randomBytes, randomUUID } from 'crypto';
import { generateNonce, SiweMessage } from 'siwe';

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
        // TODO on successful verification generate an access token for the user
        req.session.user = { address: result.data.address }
        const user = { address: result.data.address }
        res.send({ user: user, expires: req.session.cookie.expires })
    } catch (err) {
        console.error(err)
        res.sendStatus(401)
    }

}

export const signOut = async (req, res, next) => {

    const { csrfToken } = req.body;
    if (csrfToken !== req.session.csrfToken) {
        // bail early if csrf token is invalid
        return res.send(false)
    }

    req.session.destroy((err) => {
        if (err) {
            return res.send(false)
        } else {
            return res.send(true)
        }
    })
}


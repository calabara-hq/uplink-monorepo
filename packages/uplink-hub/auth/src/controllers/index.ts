import { generateNonce, SiweMessage } from 'siwe';

export type ISODateString = string;

type Session = {
    user?: {
        address?: string | null;
    };
    expires: ISODateString;
}


// returns Session or {}
export const getSession = function (req, res) {
    console.log('session id is', req.sessionID)
    console.log(req.session)
    res.send(req.session.user ? { user: req.session.user, expires: req.session.cookie.expires } : {})
}


// {"csrfToken":"2517a701f9584b236eb05fe8e090976b4b7daeece0dcf9468862a06ef51a8c8f"}
export const getCsrfToken = function (_, res) {
    res.send({ csrfToken: generateNonce() })
}

export const verifySignature = async (req, res) => {
    try {
        console.log('session id is', req.sessionID)
        const { message, signature, csrfToken } = req.body;
        const siweMessage = new SiweMessage(JSON.parse(message));
        const result = await siweMessage.verify({ signature, nonce: csrfToken })
        // TODO on successful verification generate an access token for the user
        req.session.user = { address: result.data.address }
        const user = { address: result.data.address }
        res.send({ user: user, expires: req.session.cookie.expires })
    } catch (err) {
        console.error(err)
        res.send(false)
    }

}

export const signOut = async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send(false)
        } else {
            return res.send(true)
        }
    })
}


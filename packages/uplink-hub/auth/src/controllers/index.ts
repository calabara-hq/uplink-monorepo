import { generateNonce, SiweMessage } from 'siwe';

export const getNonce = function (_, res) {
    res.send({ nonce: generateNonce() })
}

export const verifySignature = async (req, res) => {
    console.log(req.body)
    try {
        const { message, signature } = req.body;
        console.log(message, signature)
        const siweMessage = new SiweMessage(message);
        const result = await siweMessage.verify({ signature })
        console.log(result)
        res.send(true)
    } catch (err) {
        console.log(err)
        res.send(false)
    }

}

export const signOut = function (req, res, next) {
    res.send('NOT IMPLEMENTED')
}


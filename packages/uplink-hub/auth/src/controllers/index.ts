import { generateNonce, SiweMessage } from 'siwe';

export const getNonce = function (_, res) {
    res.send({ nonce: generateNonce() })
}

export const verifySignature = async (req, res) => {
    //console.log(req.body)
    try {
        const { message, signature } = req.body;
        //console.log(message, signature)
        const siweMessage = new SiweMessage(JSON.parse(message));
        console.log('MESSAGE', siweMessage)
        const result = await siweMessage.verify({ signature })
        res.send(result)
    } catch (err) {
        console.error(err)
        res.send(false)
    }

}

export const signOut = function (req, res, next) {
    res.send('NOT IMPLEMENTED')
}


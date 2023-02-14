import { SiweMessage } from 'siwe';


const userOperations = {
    generateNonce: () => {
        return 1
    },

    verifySignature: async (authData) => {
        try {

            const { message, signature } = authData
            const siweMessage = new SiweMessage(message);
            const fields = await message.verify({ signature })
            const currentNonce = '1';
            //if (currentNonce !== fields.nonce) return 'invalid nonce';
            return fields.data.address
        }
        catch (_err) {
            throw _err;
        }
    },
}


export default userOperations
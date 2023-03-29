import queries from "../src/resolvers/queries";
import mutations from "../src/resolvers/mutations";
import { SiweMessage } from 'siwe';
import { Wallet } from 'ethers';
import 'jest'


const testNonce = '1';
const wallet = Wallet.createRandom();
describe('test authentication', () => {
    it('test generate nonce', () => {
        let nonce = queries.Query.generateNonce();
        expect(nonce).toHaveProperty('nonce')
    })

    it('test sign in', async () => {
        const message = new SiweMessage({
            domain: "www.uplink.wtf",
            address: wallet.address,
            statement: "Sign in with Ethereum to Tally",
            uri: "https://uplink.wtf",
            version: "1",
            chainId: 1,
            nonce: "15050747",
        })

        let signature = await wallet.signMessage(message.toMessage());

        let signatureResponse = await mutations.Mutation.signIn(null, {
            authData: {
                message: message,
                signature: signature
            }
        })

        expect(signatureResponse.code).toBe(200)
        expect(signatureResponse.success).toBe(true)
        expect(signatureResponse.address).toBe(wallet.address)


    })
})

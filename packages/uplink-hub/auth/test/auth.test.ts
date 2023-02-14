import request from 'supertest';
import auth from '../src/routes';
import { generateNonce, SiweMessage } from 'siwe';
import { Wallet } from 'ethers';
import 'jest';
/*
const message = new SiweMessage({
    domain: "www.uplink.wtf",
    address: wallet.address,
    statement: "Sign in with Ethereum to Tally",
    uri: "https://uplink.wtf",
    version: "1",
    chainId: 1,
    nonce: "15050747",
})
*/

//let signature = await wallet.signMessage(message.toMessage());

const createMessage = (address, statement, nonce) => {
    return new SiweMessage({
        domain: "uplink.wtf",
        address: address,
        statement: statement,
        uri: "https://uplink.wtf",
        version: "1",
        chainId: 1,
        nonce: "15050748",
    })
}


describe("auth endpoint tests", () => {

    describe("nonce tests", () => {
        it("generate nonce", async () => {
            const response = await request(auth)
                .get("/generate_nonce")
                .send()
            expect(response.statusCode).toBe(200)
            expect(response.body.nonce).toHaveLength(17)
        })
    })


    describe("sign in tests", () => {

        it("w/o body", async () => {
            const response = await request(auth)
                .post("/sign_in")
                .send()
            expect(response.body).toBe(false)
        })

        it("tampered message / sig", async () => {
            const wallet = Wallet.createRandom();
            const nonce = '15050748';
            let message = createMessage(
                wallet.address,
                "sign in to the app",
                "15050748"
            );
            let signature = await wallet.signMessage(message.toMessage());
            
            // edit the message after signing

            let tamperedMessage = message;
            tamperedMessage.statement = "edited statement"

            const response = await request(auth)
                .post("/sign_in")
                .send({ message: tamperedMessage.toMessage(), signature: signature })
            expect(response.body).toBe(false)
        })

        it("successful sign in", async () => {

            const wallet = Wallet.createRandom();
            const message = createMessage(
                wallet.address,
                "sign in to the app",
                "1505074"
            ).toMessage();

            let signature = await wallet.signMessage(message);

            const response = await request(auth)
                .post("/sign_in")
                .send({ message: message, signature: signature })
            expect(response.body).toBe(true)
        })

    })
})
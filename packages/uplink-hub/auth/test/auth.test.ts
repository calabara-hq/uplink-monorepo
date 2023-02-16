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
        /*
        domain: "uplink.wtf",
        address: address,
        statement: statement,
        uri: "https://localhost:3000",
        version: "1",
        chainId: 1,
        nonce: "15050748",
        */
        "domain": "uplink.wtf",
        "statement": "sign here please!",
        "uri": "http://localhost:3000", 
        "version": "1", 
        "address": address,
        "chainId": 1, 
        "nonce": nonce, 
        "issuedAt": "2023-02-16T06:09:58.738Z"
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

        /*
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
        */
        it("successful sign in", async () => {

            const wallet = Wallet.createRandom();
            const message = createMessage(
                wallet.address,
                "sign in to the app",
                "b5260680a6ecbfc026d8c3afa0d95e861e657c646421ad4543237d9955ccb1fc"
            ).toMessage();

            let signature = await wallet.signMessage(message);

            const response = await request(auth)
                .post("/sign_in")
                .send({ message: message, signature: signature })
            expect(response.body).toBe(true)
        })

    })

})
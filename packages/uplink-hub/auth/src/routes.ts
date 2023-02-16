import express from 'express';
import * as authController from './controllers/index.js'
const auth = express();
import bodyParser from 'body-parser';
auth.use(bodyParser.json())

auth.get('/', (req, res) => {
    res.send({ auth: { version: "1.0.0" } })
})

auth.get('/generate_nonce', authController.getNonce)

auth.post('/sign_in', authController.verifySignature)

auth.get('/sign_out', authController.signOut)


export default auth
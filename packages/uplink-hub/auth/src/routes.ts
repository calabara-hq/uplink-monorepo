import express from 'express';
import * as authController from './controllers/index'
import bodyParser from 'body-parser';
const auth = express();
auth.use(bodyParser.json())

auth.get('/', (req, res) => {
    res.send({ auth: { version: "1.0.0" } })
})

auth.get('/generate_nonce', authController.getNonce)

auth.post('/sign_in', authController.verifySignature)

auth.post('/sign_out', authController.signOut)

export default auth
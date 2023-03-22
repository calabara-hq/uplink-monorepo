import express from 'express';
import * as authController from './controllers/index.js'
const auth = express();
import bodyParser from 'body-parser';
auth.use(bodyParser.json())

auth.get('/', (req, res) => {
    res.send({ auth: { version: "1.0.0" } })
})


auth.get('/session', authController.getSession)

auth.get('/csrf', authController.getCsrfToken)

auth.post('/sign_in', authController.verifySignature)

/*
auth.post('/sign_out',
    async (req, res) => {
        console.log(req.session)
        res.send('hello from sign_out').status(200)
    })
*/



auth.post('/sign_out', authController.signOut)

export default auth
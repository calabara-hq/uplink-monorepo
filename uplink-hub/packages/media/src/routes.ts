import express from 'express';
import * as mediaController from './controllers/index.js'
const media = express();
import bodyParser from 'body-parser';
import cookie from 'cookie';
media.use(bodyParser.json())


media.get('/health', (req, res) => {
    res.send('ready')
})


const sessionMiddleware = async (req, res, next) => {
    // get the user token from the headers
    // get the 'session-cookie' header from the request
    const token = cookie.parse(req.headers['cookie'] || '');
    // add the user to the context
    req.token = token;
    next();
}




//media.get('/preupload', sessionMiddleware, mediaController.preUpload)

media.post('/upload', mediaController.upload)



export default media
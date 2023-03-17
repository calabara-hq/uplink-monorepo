import express from 'express';
import * as mediaController from './controllers/index.js'
const media = express();
import bodyParser from 'body-parser';
media.use(bodyParser.json())


media.get('/test', (req, res) => {
    res.send('media test')
})

media.post('/upload', mediaController.upload)



export default media
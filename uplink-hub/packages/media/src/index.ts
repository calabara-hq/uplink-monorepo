import express from 'express';
import media from './routes.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.MEDIA_SERVICE_PORT;


app.use(bodyParser.json())

app.use(media)
app.listen(port, () => {
  console.log(`📼  Media server ready on port ${port}`);
})



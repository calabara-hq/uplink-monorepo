import express from 'express';
import auth from './routes.js';
import bodyParser from 'body-parser';
const port = 5000
const app = express();

app.use(bodyParser.json())

app.use(auth)
app.listen(port, () => {
  console.log(`📼  Media server ready on port ${port}`);
})



import express from 'express';
import v2 from './routes.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.V2_SERVICE_PORT;


app.use(bodyParser.json())

/// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.use(v2)
app.listen(port, () => {
  console.log(`📼  V2 server ready on port ${port}`);
})



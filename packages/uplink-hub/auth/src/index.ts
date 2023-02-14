import express from 'express';
import { readFileSync } from "fs";
import auth from './routes.js';
const app = express();
const port = 5000

app.use('/auth', auth)

app.listen(port, () => {
  console.log(`🔗  Auth server ready on port ${port}`);
})



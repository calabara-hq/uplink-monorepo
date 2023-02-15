import express from 'express';
import { readFileSync } from "fs";
import auth from './routes.js';

const port = 5000
const app = express();
app.use('/auth', auth)

app.listen(port, () => {
  console.log(`🔗  Auth server ready on port ${port}`);
})



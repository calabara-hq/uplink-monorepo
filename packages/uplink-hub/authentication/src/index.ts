import express from 'express';
import { readFileSync } from "fs";
const app = express();
const port = 5000

app.get('/', (req, res) => {
  res.send('hello from the auth server!')
})

app.get('/auth', (req, res) => {
  res.send('hello from auth!')
})


app.listen(port, () => {
  console.log(`🔗  Auth server ready on port ${port}`);
})



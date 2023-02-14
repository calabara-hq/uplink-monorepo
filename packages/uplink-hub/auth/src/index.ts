import express from 'express';
import { readFileSync } from "fs";
const app = express();
const port = 5000

app.get('/auth', (req, res) => {
  res.send({ auth: { version: "1.0.0" } })
})


app.listen(port, () => {
  console.log(`🔗  Auth server ready on port ${port}`);
})



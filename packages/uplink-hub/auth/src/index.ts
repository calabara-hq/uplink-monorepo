import express from 'express';
import auth from './routes.js';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
const port = 5000
const app = express();

app.use(bodyParser.json())

//app.set("trust proxy", 1)
/*
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))
*/

app.use(session({
  name: "uplink-hub",
  secret: "SESS_SECRET",
  store: new session.MemoryStore(),
  saveUninitialized: false,
  resave: false,
  cookie: {
    sameSite: false,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 60 * 60 * 1000),
    httpOnly: true,
  },

}))

app.use(auth)
app.listen(port, () => {
  console.log(`🔗  Auth server ready on port ${port}`);
})



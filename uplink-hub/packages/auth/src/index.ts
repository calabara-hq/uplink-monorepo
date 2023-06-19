import express from 'express';
import bodyParser from 'body-parser';
import auth from './routes.js';
import session from 'express-session';
import Redis from 'ioredis';
import RedisStore from 'connect-redis';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

const port = process.env.AUTH_SERVICE_PORT

export const redisClient = new Redis(process.env.REDIS_URL);

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "uplink-session:",
})


app.use(bodyParser.json())

app.use(session({
  name: "uplink-hub",
  secret: "SESS_SECRET",
  store: redisStore,
  //store: new session.MemoryStore,
  saveUninitialized: false,
  resave: false,
  cookie: {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 60 * 60 * 1000),
    httpOnly: true,
  },
}))


app.use(auth)

app.listen(port, () => {
  console.log(`🔗  Auth server ready on port ${port}`);
})

import express from 'express';
import auth from './routes.js';
import bodyParser from 'body-parser';
import session from 'express-session';
import prisma from 'shared-prisma';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
const port = 5000
const app = express();

app.use(bodyParser.json())

app.use(session({
  name: "uplink-hub",
  secret: "SESS_SECRET",
  saveUninitialized: false,
  resave: false,
  // memory store
  //store: new session.MemoryStore(),

  store: new PrismaSessionStore(prisma, {
    checkPeriod: 5 * 60 * 1000, // 5 minutes
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),


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



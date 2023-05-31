import axios from 'axios';
import Redis from 'ioredis';
import { DatabaseController, schema } from "lib";
import { GraphQLClient } from 'graphql-request';
import 'isomorphic-fetch'
import dotenv from 'dotenv';
dotenv.config();

let redisClient;
const databaseController = new DatabaseController(process.env.DATABASE_HOST, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);
export const db = databaseController.db;
export const sqlOps = databaseController.sqlOps;

const endpoint = 'http://localhost:8080/api/graphql'
const testSessionId = 'TESTING123456789';
const testSession = {
    cookie: {
        originalMaxAge: 2961826,
        expires: "2023-05-26T15:14:08.379Z",
        secure: false,
        httpOnly: true,
        path: "/",
        sameSite: "lax"
    },
    user: {
        address: "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C"
    }
}


export const authenticatedGraphqlClient = new GraphQLClient(endpoint, {
    headers: {
        'cookie': `uplink-hub=s%3A${testSessionId}.nonsense`
    }
})


const createSession = async () => {

    try {
        await redisClient.set(`uplink-session:${testSessionId}`, JSON.stringify(testSession))
        const session = await redisClient.get(`uplink-session:${testSessionId}`)
        if (!session) throw new Error('could not set test session');

    } catch (error) {
        console.log('could not set test session')
    }

}

export const resetDatabase = async () => {
    await db.delete(schema.spaces)
    await db.delete(schema.admins)
    await db.delete(schema.contests)
    await db.delete(schema.tokens)
    await db.delete(schema.votingPolicy)
    await db.delete(schema.arcadeVotingStrategy)
    await db.delete(schema.weightedVotingStrategy)
    await db.delete(schema.submissions)
    await db.delete(schema.votes)
    await db.delete(schema.submitterRestrictions)
    await db.delete(schema.tokenRestrictions)
}

export const setup = async () => {
    console.log('\n running global setup');
    if (!process.env.REDIS_URL) {
        throw new Error('REDIS_URL is not defined')
    }

    if (!process.env.DATABASE_HOST || !process.env.DATABASE_USERNAME || !process.env.DATABASE_PASSWORD) {
        throw new Error('DATABASE_HOST, DATABASE_USERNAME, or DATABASE_PASSWORD is not defined')
    }


    axios.get('http://localhost:8080/api/auth/')
        .catch((err) => {
            throw new Error('Could not connect to the cluster. are you sure it\'s running?')
        })


    await new Promise((resolve, reject) => {
        redisClient = new Redis(process.env.REDIS_URL, { retryStrategy: null })
            .on('connect', async () => {
                console.log('connected to redis');
                await createSession();
                resolve();
            })
            .on('error', (err) => {
                console.log('could not connect to redis', err);
                reject(err);
            })
    });

}

export const teardown = async () => {
    console.log('\n running global teardown');
    await redisClient.flushall();
    await redisClient.disconnect();
    await db.delete(schema.spaces)
    await db.delete(schema.admins)
    await db.delete(schema.contests)
    await db.delete(schema.tokens)
    await db.delete(schema.votingPolicy)
    await db.delete(schema.arcadeVotingStrategy)
    await db.delete(schema.weightedVotingStrategy)
    await db.delete(schema.submissions)
    await db.delete(schema.votes)
    await db.delete(schema.submitterRestrictions)
    await db.delete(schema.tokenRestrictions)
};
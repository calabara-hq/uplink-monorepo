import { describe, expect, test, jest, afterEach, afterAll, beforeAll } from '@jest/globals';
import axios, { AxiosResponse } from 'axios';
import { request, GraphQLClient, gql } from 'graphql-request';
import { DatabaseController, schema } from "lib";
import Redis from 'ioredis';
import "isomorphic-fetch";

import dotenv from 'dotenv';
dotenv.config();


const redisClient = new Redis(process.env.REDIS_URL);
const databaseController = new DatabaseController(process.env.DATABASE_HOST, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);
const db = databaseController.db;
const sqlOps = databaseController.sqlOps;

const nickAddress = '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C'
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

const authenticatedGraphqlClient = new GraphQLClient(endpoint, {
    headers: {
        'cookie': `uplink-hub=s%3A${testSessionId}.nonsense`
    }
})


const createSpace = async (spaceData: any) => {
    const query = gql` mutation CreateSpace($spaceData: SpaceBuilderInput!){
        createSpace(spaceData: $spaceData){
            spaceName
            success
            errors{
                name
                logoUrl
                twitter
                website
                admins
            }
        }
    }`;
    return authenticatedGraphqlClient.request(query, { spaceData });
}


const cleanupRedis = async () => {
    await redisClient.del(`uplink-session:${testSessionId}`)
    await redisClient.quit();
}

const cleanupDatabase = async () => {
    await db.delete(schema.spaces)
    await db.delete(schema.admins)

}

describe('e2e spaces', () => {

    beforeAll(async () => {
        //const redisClient = new Redis(process.env.REDIS_URL);
        try {
            await redisClient.set(`uplink-session:${testSessionId}`, JSON.stringify(testSession))
        } catch (error) {
            console.log('could not set test session')
        }
    });


    afterAll(async () => { await cleanupRedis() });

    test('successfully create a space', async () => {

        const spaceData = {
            name: 'test space',
            logoUrl: 'https://calabara.mypinata.cloud/ipfs/QmNsiBiUh1x2mB9V6fdQN8KNEmLZWjK3WWCWMhAfmCENkP',
            twitter: '@nickddsn',
            website: 'https://calabara.com',
            admins: [nickAddress]
        }

        const result: any = await createSpace(spaceData);

        console.log(result)

        expect(result.createSpace.success).toBe(true);
        expect(result.createSpace.errors).toEqual({
            name: null,
            logoUrl: null,
            twitter: null,
            website: null,
            admins: null
        });


        const spaceResult = await db.select({
            spaceId: schema.spaces.id,
            name: schema.spaces.name,
            displayName: schema.spaces.displayName,
            logoUrl: schema.spaces.logoUrl,
            twitter: schema.spaces.twitter,
        }).from(schema.spaces).where(sqlOps.eq(schema.spaces.name, spaceData.name.replace(' ', '')))

        const { spaceId, name, displayName, logoUrl, twitter } = spaceResult[0];


        const adminsResult = await db.select({
            adminId: schema.admins.id,
            spaceId: schema.admins.spaceId,
            address: schema.admins.address,
        }).from(schema.admins).where(sqlOps.eq(schema.admins.spaceId, spaceId))


        expect(adminsResult[0].address).toBe(nickAddress);

        await cleanupDatabase();
    })
});


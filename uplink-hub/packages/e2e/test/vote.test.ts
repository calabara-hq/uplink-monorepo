import { describe, expect, test, jest, afterEach, afterAll, beforeAll } from '@jest/globals';
import axios, { AxiosResponse } from 'axios';
import { request, GraphQLClient, gql } from 'graphql-request';
import { DatabaseController, schema } from "lib";
import Redis from 'ioredis';
import "isomorphic-fetch";

import dotenv from 'dotenv';
dotenv.config();

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


const getUserVotingParams = async (walletAddress: string, contestId: string) => {
    const query = gql` query getUserVotingParams($walletAddress: String!, $contestId: ID!) {
            getUserVotingParams(walletAddress: $walletAddress, contestId: $contestId) {
                totalVotingPower
                votesSpent
                votesRemaining
                userVotes{
                    submissionId
                }
            }
        }
    `;
    return request(endpoint, query, { walletAddress, contestId });
};



describe('e2e vote', () => {
    test('vote', async () => { });
});
import { describe, expect, test, jest, afterEach, afterAll, beforeAll } from '@jest/globals';
import { request, GraphQLClient, gql } from 'graphql-request';
import { schema } from "lib";
import "isomorphic-fetch";
import { dbNewContestType } from 'lib/dist/drizzle/schema';
import { db, authenticatedGraphqlClient, sqlOps } from './config';
import dotenv from 'dotenv';
dotenv.config();


const nickAddress = '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C'
const endpoint = 'http://localhost:8080/api/graphql'



/// seed db with test contest ///
const seedContests = async () => {
    const contest1: dbNewContestType = {
        id: 1,
        spaceId: 1,
        type: 'standard',
        created: new Date(Date.now() - 2 * 864e5).toISOString(),
        category: 'art',
        startTime: new Date(Date.now() - 2 * 864e5).toISOString(),
        voteTime: new Date(Date.now() - 1 * 864e5).toISOString(),
        endTime: new Date(Date.now() + 1 * 864e5).toISOString(),
        snapshot: new Date(Date.now() - 2 * 864e5).toISOString(),
        promptUrl: 'https://calabara.com',
        anonSubs: false,
        visibleVotes: false,
        selfVote: true,
        subLimit: 3,
    }
    const contestToken1: schema.dbNewTokenType = {
        id: 1,
        tokenHash: '123456',
        type: 'ETH',
        symbol: 'ETH',
        decimals: 18,
    };
    const insertedContest = await db.insert(schema.contests).values(contest1);
    const insertedToken = await db.insert(schema.tokens).values(contestToken1);
    const newVotingPolicy: schema.dbNewVotingPolicyType = {
        id: 1,
        contestId: insertedContest.insertId,
        strategyType: 'arcade',
    }
    await db.insert(schema.votingPolicy).values(newVotingPolicy);
    const newArcadeVotingPolicy: schema.dbNewArcadeVotingStrategyType = {
        id: 1,
        votingPolicyId: 1,
        votingPower: '10',
        tokenLink: insertedToken.insertId,
    }
    await db.insert(schema.arcadeVotingStrategy).values(newArcadeVotingPolicy);
    const submission1: schema.dbNewSubmissionType = {
        id: 1,
        contestId: 1,
        author: nickAddress,
        created: new Date().toISOString(),
        type: 'text',
        url: 'dummyurl',
        version: 'uplink-v1'
    }
    const submission2: schema.dbNewSubmissionType = {
        id: 2,
        contestId: 1,
        author: nickAddress,
        created: new Date().toISOString(),
        type: 'text',
        url: 'dummyurl2',
        version: 'uplink-v1'
    }

    await db.insert(schema.submissions).values(submission1);
    await db.insert(schema.submissions).values(submission2);

}
/// seed db with test contest ///




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

const castVotes = async (contestId: string, castVotePayload: any, authorized: boolean) => {
    const mutation = gql` mutation ($contestId: ID!, $castVotePayload: [CastVotePayload!]!) {
        castVotes(contestId: $contestId, castVotePayload: $castVotePayload) {
          success
          userVotingParams {
            totalVotingPower
            votesSpent
            votesRemaining
            userVotes {
              submissionId
            }
          }
        }
      }`;

    return authorized
        ?
        authenticatedGraphqlClient.request(mutation, { contestId, castVotePayload })
        :
        request(endpoint, mutation, { contestId, castVotePayload });
}


const removeSingleVote = async (contestId: string, submissionId: string, authorized: boolean) => {
    const mutation = gql`mutation RemoveSingleVote($contestId: ID!, $submissionId: ID!) {
        removeSingleVote(contestId: $contestId, submissionId: $submissionId) {
          success
          userVotingParams {
            totalVotingPower
            userVotes {
              submissionId
              votes
            }
            votesRemaining
            votesSpent
          }
        }
      }`;

    return authorized
        ?
        authenticatedGraphqlClient.request(mutation, { contestId, submissionId })
        :
        request(endpoint, mutation, { contestId, submissionId });
}


const removeAllVotes = async (contestId: string, authorized: boolean) => {
    const mutation = gql`mutation RemoveAllVotes($contestId: ID!) {
        removeAllVotes(contestId: $contestId) {
          success
          userVotingParams {
            totalVotingPower
            userVotes {
              submissionId
              votes
            }
            votesRemaining
            votesSpent
          }
        }
      }`;

    return authorized
        ?
        authenticatedGraphqlClient.request(mutation, { contestId })
        :
        request(endpoint, mutation, { contestId });
}


describe('e2e vote', () => {

    beforeAll(async () => {
        await seedContests();
    });

    test('get user voting params', async () => {
        const userVotingParams = await getUserVotingParams(nickAddress, '1');
        expect(userVotingParams).toEqual({
            getUserVotingParams: {
                totalVotingPower: '10',
                votesSpent: '0',
                votesRemaining: '10',
                userVotes: []
            }
        })
    });


    test('cast unauthorized vote', async () => {
        const castVotePayload = [{
            submissionId: '1',
            quantity: '1'
        }];

        try {
            await castVotes('1', castVotePayload, false);
        } catch (error) {
            expect(error.response.errors[0].message).toEqual('Unauthorized');
        }
    });


    test('successfully cast votes', async () => {
        const castVotePayload = [{
            submissionId: '1',
            quantity: '8'
        },
        {
            submissionId: '2',
            quantity: '2'
        }
        ];

        const castVotesResponse = await castVotes('1', castVotePayload, true);
        expect(castVotesResponse).toEqual({
            castVotes: {
                success: true,
                userVotingParams: {
                    totalVotingPower: '10',
                    votesSpent: '10',
                    votesRemaining: '0',
                    userVotes: [{ submissionId: '1' }, { submissionId: '2' }]
                }
            }
        })
    });

    test('cast vote with insufficient voting power', async () => {
        const castVotePayload = [{
            submissionId: '1',
            quantity: '8'
        },
        {
            submissionId: '2',
            quantity: '2'
        }
        ];
        try {
            await castVotes('1', castVotePayload, true);
        } catch (error) {
            expect(error.response.errors[0].message).toEqual('Insufficient voting power');
        }
    });

    test('cast vote with invalid submission id', async () => {
        const castVotePayload = [{
            submissionId: '3',
            quantity: '1'
        }];
        try {
            await castVotes('1', castVotePayload, true);
        } catch (error) {
            expect(error.response.errors[0].message).toEqual('Invalid submissionId');
        }
    });

    test('cast vote with invalid contest id', async () => {
        const castVotePayload = [{
            submissionId: '1',
            quantity: '1'
        }];
        try {
            await castVotes('2', castVotePayload, true);
        } catch (error) {
            expect(error.response.errors[0].message).toEqual('Contest does not exist');
        }
    });


    test('remove single vote unauthorized', async () => {
        try {
            await removeSingleVote('1', '1', false);
        } catch (error) {
            expect(error.response.errors[0].message).toEqual('Unauthorized');
        }
    });

    test('remove single vote', async () => {
        const removeSingleVoteResponse = await removeSingleVote('1', '1', true);
        expect(removeSingleVoteResponse).toEqual({
            removeSingleVote: {
                success: true,
                userVotingParams: {
                    totalVotingPower: '10',
                    userVotes: [{ submissionId: '2', votes: '2' }],
                    votesRemaining: '8',
                    votesSpent: '2'
                }
            }
        })
    });

    test('remove all votes unauthorized', async () => {
        try {
            await removeAllVotes('1', false);
        } catch (error) {
            expect(error.response.errors[0].message).toEqual('Unauthorized');
        }
    });

    
    test('remove all votes', async () => {
        const removeAllVotesResponse = await removeAllVotes('1', true);
        expect(removeAllVotesResponse).toEqual({
            removeAllVotes: {
                success: true,
                userVotingParams: {
                    totalVotingPower: '10',
                    userVotes: [],
                    votesRemaining: '10',
                    votesSpent: '0'
                }
            }
        })
    });

    test('throw self voting error', async () => {

        await db.update(schema.contests).set({ selfVote: false }).where(sqlOps.eq(schema.contests.id, 1));

        const castVotePayload = [{
            submissionId: '1',
            quantity: '8'
        },
        {
            submissionId: '2',
            quantity: '2'
        }
        ];

        try {
            await castVotes('1', castVotePayload, true);
        } catch (error) {
            expect(error.response.errors[0].message).toEqual('Self voting is disabled');
        }
    });
    

});
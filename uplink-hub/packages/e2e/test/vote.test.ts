import { describe, expect, test, jest, afterEach, afterAll, beforeAll, beforeEach } from '@jest/globals';
import { request, GraphQLClient, gql } from 'graphql-request';
import { IToken, schema } from "lib";
import { dbNewContestType } from 'lib/dist/drizzle/schema';
import { db, authenticatedGraphqlClient, sqlOps, resetDatabase } from './config';
import { randomUUID } from 'crypto';


const nickAddress = '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C'
const endpoint = 'http://localhost:8080/api/graphql'



/// seed db with test contest ///
const seedContests = async ({ window, selfVote, votingPolicy, submissions }: {
    window: 'pending' | 'submitting' | 'voting' | 'end',
    selfVote: boolean,
    votingPolicy: {
        strategyType: 'arcade' | 'weighted',
        votingPower?: string,
        token: IToken
    }[],
    submissions: {
        author: string,
    }[] | []
}) => {

    const deadlines = {
        pending: {
            startTime: new Date(Date.now() + 1 * 864e5).toISOString(),
            voteTime: new Date(Date.now() + 2 * 864e5).toISOString(),
            endTime: new Date(Date.now() + 3 * 864e5).toISOString(),
            snapshot: new Date(Date.now() + 1 * 864e5).toISOString(),
        },
        submitting: {
            startTime: new Date(Date.now() - 1 * 864e5).toISOString(),
            voteTime: new Date(Date.now() + 1 * 864e5).toISOString(),
            endTime: new Date(Date.now() + 2 * 864e5).toISOString(),
            snapshot: new Date(Date.now() - 1 * 864e5).toISOString(),
        },
        voting: {
            startTime: new Date(Date.now() - 2 * 864e5).toISOString(),
            voteTime: new Date(Date.now() - 1 * 864e5).toISOString(),
            endTime: new Date(Date.now() + 1 * 864e5).toISOString(),
            snapshot: new Date(Date.now() - 2 * 864e5).toISOString(),
        },
        end: {
            startTime: new Date(Date.now() - 3 * 864e5).toISOString(),
            voteTime: new Date(Date.now() - 2 * 864e5).toISOString(),
            endTime: new Date(Date.now() - 1 * 864e5).toISOString(),
            snapshot: new Date(Date.now() - 3 * 864e5).toISOString(),
        }
    }

    const contest: dbNewContestType = {
        spaceId: 1,
        type: 'standard',
        created: new Date(Date.now() - 2 * 864e5).toISOString(),
        category: 'art',
        ...deadlines[window],
        promptUrl: 'https://calabara.com',
        anonSubs: false,
        visibleVotes: false,
        selfVote: selfVote,
        subLimit: 3,
    }


    const insertedContest = await db.insert(schema.contests).values(contest);

    for (const policy of votingPolicy) {
        const newToken: schema.dbNewTokenType = {
            tokenHash: randomUUID().slice(0, 6),
            type: policy.token.type,
            symbol: policy.token.symbol,
            decimals: policy.token.decimals,
            ...(policy.token.type !== 'ETH' ? { address: policy.token.address } : {}),
            ...(policy.token.type === 'ERC1155' ? { tokenId: policy.token.tokenId } : {}),
        }

        const insertedToken = await db.insert(schema.tokens).values(newToken);
        const newVotingPolicy: schema.dbNewVotingPolicyType = {
            contestId: insertedContest.insertId,
            strategyType: policy.strategyType,
        }
        const insertedVotingPolicy = await db.insert(schema.votingPolicy).values(newVotingPolicy);
        if (policy.strategyType === 'arcade') {
            const newArcadeVotingPolicy: schema.dbNewArcadeVotingStrategyType = {
                votingPolicyId: insertedVotingPolicy.insertId,
                votingPower: policy.votingPower,
                tokenLink: insertedToken.insertId,
            }
            await db.insert(schema.arcadeVotingStrategy).values(newArcadeVotingPolicy);
        }
        else if (policy.strategyType === 'weighted') {
            const newWeightedVotingPolicy: schema.dbNewWeightedVotingStrategyType = {
                votingPolicyId: insertedVotingPolicy.insertId,
                tokenLink: insertedToken.insertId,
            }
            await db.insert(schema.weightedVotingStrategy).values(newWeightedVotingPolicy);
        }
    }

    let submissionIds = [];
    for (const submission of submissions) {
        const newSubmission: schema.dbNewSubmissionType = {
            contestId: insertedContest.insertId,
            author: submission.author,
            created: new Date().toISOString(),
            type: 'text',
            url: 'dummyurl',
            version: 'uplink-v1'
        }
        const insertedSubmission = await db.insert(schema.submissions).values(newSubmission);
        submissionIds.push(insertedSubmission.insertId);
    }



    return {
        contestId: insertedContest.insertId,
        submissionIds: submissionIds
    }

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



    beforeEach(async () => {
        await resetDatabase();
    });

    test('cast unauthorized vote', async () => {
        const castVotePayload = [{
            submissionId: '1',
            votes: '1'
        }];

        const result = castVotes('1', castVotePayload, false);
        await expect(result).rejects.toMatchObject({
            response: {
                errors: [{
                    extensions: {
                        code: 'UNAUTHORIZED'
                    }
                }]
            }
        });
    });

    test('get user voting params', async () => {

        const { contestId } = await seedContests({
            window: 'voting',
            selfVote: true,
            votingPolicy: [{
                strategyType: 'arcade',
                votingPower: '10',
                token: {
                    type: 'ETH',
                    decimals: 18,
                    symbol: 'ETH',
                }
            }],
            submissions: []
        })

        const userVotingParams = await getUserVotingParams(nickAddress, contestId);
        expect(userVotingParams).toEqual({
            getUserVotingParams: {
                totalVotingPower: '10',
                votesSpent: '0',
                votesRemaining: '10',
                userVotes: []
            }
        })
    });


    test('successfully cast votes', async () => {

        const { contestId, submissionIds } = await seedContests({
            window: 'voting',
            selfVote: true,
            votingPolicy: [{
                strategyType: 'arcade',
                votingPower: '10',
                token: {
                    type: 'ETH',
                    decimals: 18,
                    symbol: 'ETH',
                }
            }],
            submissions: [{ author: nickAddress }, { author: 'vitalik.eth' }]
        })


        const castVotePayload = [{
            submissionId: submissionIds[0],
            votes: '8'
        },
        {
            submissionId: submissionIds[1],
            votes: '2'
        }
        ];

        const castVotesResponse = await castVotes(contestId, castVotePayload, true);
        expect(castVotesResponse).toEqual({
            castVotes: {
                success: true,
                userVotingParams: {
                    totalVotingPower: '10',
                    votesSpent: '10',
                    votesRemaining: '0',
                    userVotes: [{ submissionId: submissionIds[0] }, { submissionId: submissionIds[1] }]
                }
            }
        })
    });


    test('cast vote with insufficient voting power', async () => {
        const { contestId, submissionIds } = await seedContests({
            window: 'voting',
            selfVote: true,
            votingPolicy: [{
                strategyType: 'arcade',
                votingPower: '10',
                token: {
                    type: 'ETH',
                    decimals: 18,
                    symbol: 'ETH',
                }
            }],
            submissions: [{ author: nickAddress }, { author: 'vitalik.eth' }]
        })

        const castVotePayload = [{
            submissionId: submissionIds[0],
            votes: '8'
        },
        {
            submissionId: submissionIds[1],
            votes: '100'
        }
        ];
        const result = castVotes(contestId, castVotePayload, true);
        await expect(result).rejects.toMatchObject({
            response: {
                errors: [{
                    extensions: {
                        code: 'INSUFFICIENT_VOTING_POWER'
                    }
                }]
            }
        });
    });

    test('cast vote with invalid submission id', async () => {
        const { contestId, submissionIds } = await seedContests({
            window: 'voting',
            selfVote: true,
            votingPolicy: [{
                strategyType: 'arcade',
                votingPower: '10',
                token: {
                    type: 'ETH',
                    decimals: 18,
                    symbol: 'ETH',
                }
            }],
            submissions: [{ author: nickAddress }, { author: 'vitalik.eth' }]
        })

        const invalidSubmissionId = submissionIds[0] + '10000';
        const castVotePayload = [{
            submissionId: invalidSubmissionId,
            votes: '1'
        }];
        const result = castVotes(contestId, castVotePayload, true);
        await expect(result).rejects.toMatchObject({
            response: {
                errors: [{
                    extensions: {
                        code: 'INVALID_SUBMISSION_ID'
                    }
                }]
            }
        });
    });

    test('cast vote with invalid contest id', async () => {

        const { contestId, submissionIds } = await seedContests({
            window: 'voting',
            selfVote: true,
            votingPolicy: [{
                strategyType: 'arcade',
                votingPower: '10',
                token: {
                    type: 'ETH',
                    decimals: 18,
                    symbol: 'ETH',
                }
            }],
            submissions: [{ author: nickAddress }, { author: 'vitalik.eth' }]
        })

        const castVotePayload = [{
            submissionId: submissionIds[0],
            votes: '1'
        }];
        const result = castVotes(contestId + 100000, castVotePayload, true);
        await expect(result).rejects.toMatchObject({
            response: {
                errors: [{
                    extensions: {
                        code: 'CONTEST_DOES_NOT_EXIST'
                    }
                }]
            }
        });
    });


    test('remove single vote unauthorized', async () => {
        const result = removeSingleVote('1', '1', false);
        await expect(result).rejects.toMatchObject({
            response: {
                errors: [{
                    extensions: {
                        code: 'UNAUTHORIZED'
                    }
                }]
            }
        });
    });

    test('remove single vote', async () => {
        const { contestId, submissionIds } = await seedContests({
            window: 'voting',
            selfVote: true,
            votingPolicy: [{
                strategyType: 'arcade',
                votingPower: '10',
                token: {
                    type: 'ETH',
                    decimals: 18,
                    symbol: 'ETH',
                }
            }],
            submissions: [{ author: nickAddress }, { author: 'vitalik.eth' }]
        })

        await db.insert(schema.votes).values({
            contestId: contestId,
            submissionId: submissionIds[0],
            voter: nickAddress,
            created: new Date().toISOString(),
            amount: '8'
        });

        await db.insert(schema.votes).values({
            contestId: contestId,
            submissionId: submissionIds[1],
            voter: nickAddress,
            created: new Date().toISOString(),
            amount: '2'
        });


        const removeSingleVoteResponse = await removeSingleVote(contestId, submissionIds[0], true);
        expect(removeSingleVoteResponse).toEqual({
            removeSingleVote: {
                success: true,
                userVotingParams: {
                    totalVotingPower: '10',
                    userVotes: [{ submissionId: submissionIds[1], votes: '2' }],
                    votesRemaining: '8',
                    votesSpent: '2'
                }
            }
        })
    });

    test('remove all votes unauthorized', async () => {
        const result = removeAllVotes('1', false);
        await expect(result).rejects.toMatchObject({
            response: {
                errors: [{
                    extensions: {
                        code: 'UNAUTHORIZED'
                    }
                }]
            }
        });
    });


    test('remove all votes', async () => {
        const { contestId, submissionIds } = await seedContests({
            window: 'voting',
            selfVote: true,
            votingPolicy: [{
                strategyType: 'arcade',
                votingPower: '10',
                token: {
                    type: 'ETH',
                    decimals: 18,
                    symbol: 'ETH',
                }
            }],
            submissions: [{ author: nickAddress }, { author: 'vitalik.eth' }]
        })

        await db.insert(schema.votes).values({
            contestId: contestId,
            submissionId: submissionIds[0],
            voter: nickAddress,
            created: new Date().toISOString(),
            amount: '8'
        });

        await db.insert(schema.votes).values({
            contestId: contestId,
            submissionId: submissionIds[1],
            voter: nickAddress,
            created: new Date().toISOString(),
            amount: '2'
        });

        const removeAllVotesResponse = await removeAllVotes(contestId, true);
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

        const { contestId, submissionIds } = await seedContests({
            window: 'voting',
            selfVote: false,
            votingPolicy: [{
                strategyType: 'arcade',
                votingPower: '10',
                token: {
                    type: 'ETH',
                    decimals: 18,
                    symbol: 'ETH',
                }
            }],
            submissions: [{ author: nickAddress }, { author: 'vitalik.eth' }]
        })

        const castVotePayload = [{
            submissionId: submissionIds[0],
            votes: '8'
        },
        {
            submissionId: submissionIds[1],
            votes: '2'
        }
        ];

        const result = castVotes(contestId, castVotePayload, true);
        await expect(result).rejects.toMatchObject({
            response: {
                errors: [{
                    extensions: {
                        code: 'SELF_VOTING_DISABLED'
                    }
                }]
            }
        });
    });

});
import { describe, expect, test, jest, afterEach, afterAll, beforeAll, beforeEach } from '@jest/globals';
import { request, GraphQLClient, gql } from 'graphql-request';
import { IToken, schema } from "lib";
import { dbNewContestType } from 'lib/dist/drizzle/schema';
import { db, authenticatedGraphqlClient, sqlOps, resetDatabase } from './config';
import { randomUUID } from 'crypto';

const nickAddress = '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C'
const endpoint = 'http://localhost:8080/api/graphql'

/*
const seedContests = async({ contestType, window }: {
    contestType: 'standard' || 'twitter',
    window: 'pending' || 'submitting' || 'voting' || 'end'
})

*/

/// seed db with test contest ///
const seedContests = async ({ contestType, window, subLimit, submitterRestrictions }: {
    contestType: 'standard' | 'twitter',
    window: 'pending' | 'submitting' | 'voting' | 'end',
    subLimit: number,
    submitterRestrictions: {
        token: IToken,
        threshold: string
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
        spaceId: 2,
        type: contestType,
        created: new Date(Date.now() - 2 * 864e5).toISOString(),
        category: 'art',
        ...deadlines[window],
        promptUrl: 'https://calabara.com',
        anonSubs: false,
        visibleVotes: false,
        selfVote: true,
        subLimit: subLimit,
    }

    const insertedContest = await db.insert(schema.contests).values(contest);


    for (const tokenRestriction of submitterRestrictions) {
        const newToken: schema.dbNewTokenType = {
            tokenHash: randomUUID().slice(0, 6),
            type: tokenRestriction.token.type,
            symbol: tokenRestriction.token.symbol,
            decimals: tokenRestriction.token.decimals,
            ...(tokenRestriction.token.type !== 'ETH' ? { address: tokenRestriction.token.address } : {}),
            ...(tokenRestriction.token.type === 'ERC1155' ? { tokenId: tokenRestriction.token.tokenId } : {}),
        }
        const insertedToken = await db.insert(schema.tokens).values(newToken);
        const newSubmitterRestriction: schema.dbNewSubmitterRestrictionType = {
            contestId: insertedContest.insertId,
            restrictionType: 'token',
        }
        const insertedRestriction = await db.insert(schema.submitterRestrictions).values(newSubmitterRestriction);

        const newTokenSubmitterRestriction: schema.dbNewTokenRestrictionType = {
            restrictionId: insertedRestriction.insertId,
            tokenLink: insertedToken.insertId,
            threshold: tokenRestriction.threshold
        }

        await db.insert(schema.tokenRestrictions).values(newTokenSubmitterRestriction);
    }

    return {
        contestId: insertedContest.insertId,
    }

}
/// seed db with test contest ///




const getUserSubmissionParams = async (walletAddress: string, contestId: string) => {
    const query = gql` query GetUserSubmissionParams($walletAddress: String!, $contestId: ID!) {
        getUserSubmissionParams(walletAddress: $walletAddress, contestId: $contestId) {
          maxSubPower
          remainingSubPower
          userSubmissions {
            id
            type
          }
        }
      }`;
    return request(endpoint, query, { walletAddress, contestId });
};

const createSubmission = async (contestId: string, submission: any, authorized: boolean) => {
    const mutation = gql`mutation CreateSubmission($contestId: ID!, $submission: SubmissionPayload!) {
        createSubmission(contestId: $contestId, submission: $submission) {
          errors
          success
          userSubmissionParams {
            maxSubPower
            remainingSubPower
            userSubmissions {
                type
            }
          }
        }
      }`;

    return authorized
        ?
        authenticatedGraphqlClient.request(mutation, { contestId, submission })
        :
        request(endpoint, mutation, { contestId, submission });
}


describe('e2e submit', () => {

    beforeEach(async () => {
        await resetDatabase();
    });



    test('get user submission params', async () => {
        const { contestId } = await seedContests({ contestType: 'standard', window: 'submitting', subLimit: 1, submitterRestrictions: [] });
        const result: any = await getUserSubmissionParams(nickAddress, contestId);
        expect(result).toEqual({
            getUserSubmissionParams: {
                maxSubPower: 1,
                remainingSubPower: 1,
                userSubmissions: []
            }

        });
    });


    test('create text submission', async () => {
        const { contestId } = await seedContests({ contestType: 'standard', window: 'submitting', subLimit: 1, submitterRestrictions: [] });

        const submission = {
            title: 'test submission',
            body: {
                time: 1682628241526,
                blocks: [
                    {
                        id: "qZxrSG7bxL",
                        type: "paragraph",
                        data: {
                            text: "test"
                        }
                    }
                ],
                version: "2.26.5"
            },
        }

        const result = await createSubmission(contestId, submission, true);
        expect(result).toEqual({
            createSubmission: {
                errors: null,
                success: true,
                userSubmissionParams: {
                    maxSubPower: 1,
                    remainingSubPower: 0,
                    userSubmissions: [
                        {
                            type: 'text'
                        }
                    ]
                }
            }
        });
    });

    test('create image submission', async () => {
        const { contestId } = await seedContests({ contestType: 'standard', window: 'submitting', subLimit: 1, submitterRestrictions: [] });

        const submission = {
            title: 'test submission',
            previewAsset: 'https://calabara.mypinata.cloud/ipfs/QmNsiBiUh1x2mB9V6fdQN8KNEmLZWjK3WWCWMhAfmCENkP',
            body: {
                time: 1682628241526,
                blocks: [
                    {
                        id: "qZxrSG7bxL",
                        type: "paragraph",
                        data: {
                            text: "test"
                        }
                    }
                ],
                version: "2.26.5"
            },
        }

        const result = await createSubmission(contestId, submission, true);
        expect(result).toEqual({
            createSubmission: {
                errors: null,
                success: true,
                userSubmissionParams: {
                    maxSubPower: 1,
                    remainingSubPower: 0,
                    userSubmissions: [
                        {
                            type: 'image'
                        }
                    ]
                }
            }
        });
    });

    test('create video submission', async () => {
        const { contestId } = await seedContests({ contestType: 'standard', window: 'submitting', subLimit: 1, submitterRestrictions: [] });
        const submission = {
            title: 'test submission',
            previewAsset: 'https://calabara.mypinata.cloud/ipfs/QmNsiBiUh1x2mB9V6fdQN8KNEmLZWjK3WWCWMhAfmCENkP',
            videoAsset: 'https://calabara.mypinata.cloud/ipfs/QmNsiBiUh1x2mB9V6fdQN8KNEmLZWjK3WWCWMhAfmCENkP',
            body: {
                time: 1682628241526,
                blocks: [
                    {
                        id: "qZxrSG7bxL",
                        type: "paragraph",
                        data: {
                            text: "test"
                        }
                    }
                ],
                version: "2.26.5"
            },
        }

        const result = await createSubmission(contestId, submission, true);
        expect(result).toEqual({
            createSubmission: {
                errors: null,
                success: true,
                userSubmissionParams: {
                    maxSubPower: 1,
                    remainingSubPower: 0,
                    userSubmissions: [
                        {
                            type: 'video'
                        }
                    ]
                }
            }
        });
    });


    test('pass single ETH token check', async () => {
        const { contestId } = await seedContests({
            contestType: 'standard',
            window: 'submitting',
            subLimit: 1,
            submitterRestrictions: [{
                token: { type: 'ETH', decimals: 18, symbol: 'ETH' },
                threshold: '0.001'
            }]
        });

        const submission = {
            title: 'test submission',
            previewAsset: 'https://calabara.mypinata.cloud/ipfs/QmNsiBiUh1x2mB9V6fdQN8KNEmLZWjK3WWCWMhAfmCENkP'
        }
        const result = await createSubmission(contestId, submission, true);
        expect(result).toEqual({
            createSubmission: {
                errors: null,
                success: true,
                userSubmissionParams: {
                    maxSubPower: 1,
                    remainingSubPower: 0,
                    userSubmissions: [
                        {
                            type: 'image'
                        }
                    ]
                }
            }
        });
    });



    test('fail single ETH token check', async () => {
        const { contestId } = await seedContests({
            contestType: 'standard',
            window: 'submitting',
            subLimit: 1,
            submitterRestrictions: [{
                token: { type: 'ETH', decimals: 18, symbol: 'ETH' },
                threshold: '100'
            }]
        });

        const submission = {
            title: 'test submission',
            previewAsset: 'https://calabara.mypinata.cloud/ipfs/QmNsiBiUh1x2mB9V6fdQN8KNEmLZWjK3WWCWMhAfmCENkP'
        }
        const result = createSubmission(contestId, submission, true)

        await expect(result).rejects.toMatchObject({
            response: {
                errors: [{
                    extensions: {
                        code: 'INELIGIBLE_TO_SUBMIT'
                    }
                }]
            }
        });
    });


    test('exceed sub limit', async () => {
        const { contestId } = await seedContests({
            contestType: 'standard',
            window: 'submitting',
            subLimit: 1,
            submitterRestrictions: [{
                token: { type: 'ETH', decimals: 18, symbol: 'ETH' },
                threshold: '0.001'
            }]
        });

        await db.insert(schema.submissions).values({
            contestId: contestId,
            author: nickAddress,
            created: new Date().toISOString(),
            type: 'image',
            url: 'https://calabara.mypinata.cloud/ipfs/QmNsiBiUh1x2mB9V6fdQN8KNEmLZWjK3WWCWMhAfmCENkP',
            version: 'uplink-v1'
        })

        const submission = {
            title: 'test submission',
            previewAsset: 'https://calabara.mypinata.cloud/ipfs/QmNsiBiUh1x2mB9V6fdQN8KNEmLZWjK3WWCWMhAfmCENkP',
        }

        const result = createSubmission(contestId, submission, true);
        await expect(result).rejects.toMatchObject({
            response: {
                errors: [{
                    extensions: {
                        code: 'ENTRY_LIMIT_REACHED'
                    }
                }]
            }
        });
    });


    test('invalid submission payload', async () => {
        const { contestId } = await seedContests({
            contestType: 'standard',
            window: 'submitting',
            subLimit: 1,
            submitterRestrictions: [{
                token: { type: 'ETH', decimals: 18, symbol: 'ETH' },
                threshold: '0.001'
            }]
        });
        const submission = {
            title: 'test submission',
        }

        const result = await createSubmission(contestId, submission, true);

        expect(result).toEqual({
            createSubmission: {
                errors: "Submission content is required",
                success: false,
                userSubmissionParams: {
                    maxSubPower: 1,
                    remainingSubPower: 1,
                    userSubmissions: []
                }
            }
        });
    })

});
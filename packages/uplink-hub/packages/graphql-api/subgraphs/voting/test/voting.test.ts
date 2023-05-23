import { describe, expect, test, jest, afterEach, afterAll } from '@jest/globals';
import * as votingUtils from '../src/utils/voting';
import { redisClient } from '../src/utils/cache';
import { GraphQLError } from 'graphql';
import { Decimal } from 'lib';

describe('voting utils test suite', () => {
    afterAll(async () => {
        await redisClient.quit();
    });
    describe('deadlineAdjustedVotingPower', () => {
        test('return 0 with now < voteTime', () => {
            const startTime = new Date(new Date().getTime() + 1000).toISOString();
            const voteTime = new Date(new Date().getTime() + 2000).toISOString();
            const endTime = new Date(new Date().getTime() + 3000).toISOString();
            const snapshot = new Date(new Date().getTime() + 1000).toISOString();
            const deadlines = {
                startTime,
                voteTime,
                endTime,
                snapshot
            };

            const theoreticalVotingPower = new Decimal('100');
            const result = votingUtils.deadlineAdjustedVotingPower(theoreticalVotingPower, deadlines);
            expect(result).toEqual(new Decimal('0'));

        });


        test('return 0 with now > endTime', () => {

            const startTime = new Date(new Date().getTime() - 3000).toISOString();
            const voteTime = new Date(new Date().getTime() - 2000).toISOString();
            const endTime = new Date(new Date().getTime() - 1000).toISOString();
            const snapshot = new Date(new Date().getTime() - 3000).toISOString();
            const deadlines = {
                startTime,
                voteTime,
                endTime,
                snapshot
            };
            const theoreticalVotingPower = new Decimal('100');
            const result = votingUtils.deadlineAdjustedVotingPower(theoreticalVotingPower, deadlines);
            expect(result).toEqual(new Decimal('0'));

        });

        test('return total VP with voteTime < now < endTime', () => {
            const startTime = new Date(new Date().getTime() - 1000).toISOString();
            const voteTime = new Date(new Date().getTime()).toISOString();
            const endTime = new Date(new Date().getTime() + 1000).toISOString();
            const snapshot = new Date(new Date().getTime() - 1000).toISOString();
            const deadlines = {
                startTime,
                voteTime,
                endTime,
                snapshot
            };
            const theoreticalVotingPower = new Decimal('100');
            const result = votingUtils.deadlineAdjustedVotingPower(theoreticalVotingPower, deadlines);
            expect(result).toEqual(new Decimal('100'));

        });

    });


    describe('get total voting power', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        })


        test('single arcade voting strategy cache miss', async () => {
            // setup spys
            jest.spyOn(votingUtils, 'getCacheTotalVotingPower').mockResolvedValue(null);
            jest.spyOn(votingUtils, 'setCacheTotalVotingPower').mockResolvedValue(false);

            jest.spyOn(votingUtils, 'fetchDeadlines').mockResolvedValue({
                startTime: new Date(new Date().getTime() - 1000).toISOString(),
                voteTime: new Date(new Date().getTime()).toISOString(),
                endTime: new Date(new Date().getTime() + 1000).toISOString(),
                snapshot: new Date(new Date().getTime() - 1000).toISOString()
            });

            jest.spyOn(votingUtils, 'fetchArcadeVotingPolicy').mockResolvedValue([{
                "id": "0",
                "contestId": "0",
                "strategyType": "arcade",
                "arcadeVotingPolicy": {
                    "votingPower": "100",
                    "token": {
                        "tokenHash": "da72ab96",
                        "type": "ETH",
                        "symbol": "ETH",
                        "decimals": 18,
                    }
                }
            }]);
            jest.spyOn(votingUtils, 'fetchWeightedVotingPolicy').mockResolvedValue([]);
            jest.spyOn(votingUtils, 'computeArcadeVotingPowerUserValues').mockResolvedValue([new Decimal('100')]);
            jest.spyOn(votingUtils, 'computeWeightedVotingPowerUserValues').mockResolvedValue([]);

            const user = { address: 'nickdodson.eth' };
            const contestId = 0;

            const totalVP = await votingUtils.calculateTotalVotingPower(user, contestId);

            expect(totalVP).toEqual(new Decimal('100'));

        });


        test('single arcade voting strategy cache hit', async () => {
            // setup spys
            jest.spyOn(votingUtils, 'getCacheTotalVotingPower').mockResolvedValue(new Decimal('30') as any);
            jest.spyOn(votingUtils, 'setCacheTotalVotingPower').mockResolvedValue(false);

            jest.spyOn(votingUtils, 'fetchDeadlines').mockResolvedValue({
                startTime: new Date(new Date().getTime() - 1000).toISOString(),
                voteTime: new Date(new Date().getTime()).toISOString(),
                endTime: new Date(new Date().getTime() + 1000).toISOString(),
                snapshot: new Date(new Date().getTime() - 1000).toISOString()
            });

            jest.spyOn(votingUtils, 'fetchArcadeVotingPolicy').mockResolvedValue([{
                "id": "0",
                "contestId": "0",
                "strategyType": "arcade",
                "arcadeVotingPolicy": {
                    "votingPower": "100",
                    "token": {
                        "tokenHash": "da72ab96",
                        "type": "ETH",
                        "symbol": "ETH",
                        "decimals": 18,
                    }
                }
            }]);
            jest.spyOn(votingUtils, 'fetchWeightedVotingPolicy').mockResolvedValue([]);
            jest.spyOn(votingUtils, 'computeArcadeVotingPowerUserValues').mockResolvedValue([new Decimal('100')]);
            jest.spyOn(votingUtils, 'computeWeightedVotingPowerUserValues').mockResolvedValue([]);

            const user = { address: 'nickdodson.eth' };
            const contestId = 0;

            const totalVP = await votingUtils.calculateTotalVotingPower(user, contestId);

            expect(totalVP).toEqual(new Decimal('30'));

        });

        /*
        test('single weighted voting strategy cache miss', async () => {
            // setup spys
            jest.spyOn(votingUtils, 'getCacheTotalVotingPower').mockResolvedValue(null);
            jest.spyOn(votingUtils, 'setCacheTotalVotingPower').mockResolvedValue(false);
            jest.spyOn(votingUtils, 'fetchDeadlines').mockResolvedValue({
                startTime: new Date(new Date().getTime() - 1000).toISOString(),
                voteTime: new Date(new Date().getTime()).toISOString(),
                endTime: new Date(new Date().getTime() + 1000).toISOString(),
                snapshot: new Date(new Date().getTime() - 1000).toISOString()
            });

            jest.spyOn(votingUtils, 'fetchArcadeVotingPolicy').mockResolvedValue([]);
            jest.spyOn(votingUtils, 'fetchWeightedVotingPolicy').mockResolvedValue([{
                "id": "0",
                "contestId": "0",
                "strategyType": "weighted",
                "arcadeVotingPolicy": {
                    "token": {
                        "tokenHash": "da72ab96",
                        "type": "ETH",
                        "symbol": "ETH",
                        "decimals": 18,
                    }
                }
            }]);
            jest.spyOn(votingUtils, 'computeWeightedVotingPowerUserValues').mockResolvedValue([new Decimal('100')]);
            jest.spyOn(votingUtils, 'computeArcadeVotingPowerUserValues').mockResolvedValue([]);

            const user = { address: 'nickdodson.eth' };
            const contestId = 0;

            const totalVP = await votingUtils.calculateTotalVotingPower(user, contestId);

            expect(totalVP).toEqual(new Decimal('100'));

        });
            */

    });

    describe('cast votes', () => {

        test('throw insufficient voting power error', async () => {
            jest.spyOn(votingUtils, 'fetchUserVotes').mockResolvedValue([
                { submissionId: 0, votes: 3 },
                { submissionId: 1, votes: 2 },
                { submissionId: 2, votes: 1 }
            ]);
            jest.spyOn(votingUtils, 'calculateTotalVotingPower').mockResolvedValue(new Decimal('100'));
            jest.spyOn(votingUtils, 'calculateUserVotingParams').mockResolvedValue({
                totalVotingPower: new Decimal('100'),
                votesSpent: new Decimal('0'),
                votesRemaining: new Decimal('100'),
                userVotes: [],
            });
            const user = { address: 'nickdodson.eth' };
            const contestId = 0;
            const payload = [
                { submissionId: 1, votes: new Decimal('10') },
                { submissionId: 2, votes: new Decimal('30') },
                { submissionId: 3, votes: new Decimal('65') }
            ]

            const result = votingUtils.castVotes(user, contestId, payload);
            await expect(result).rejects.toEqual(new GraphQLError('Insufficient voting power', {
                extensions: {
                    code: 'INSUFFICIENT_VOTING_POWER'
                }
            }))

        });


        test('throw invalid submission id error', async () => {
            jest.spyOn(votingUtils, 'fetchUserVotes').mockResolvedValue([
                { submissionId: 0, votes: 3 },
                { submissionId: 1, votes: 2 },
                { submissionId: 2, votes: 1 }
            ]);
            jest.spyOn(votingUtils, 'insertVotes').mockResolvedValue(true);
            jest.spyOn(votingUtils, 'getContestSubmissions').mockResolvedValue([
                { id: 1 }, { id: 2 }, { id: 3 }
            ])
            jest.spyOn(votingUtils, 'calculateTotalVotingPower').mockResolvedValue(new Decimal('100'));
            jest.spyOn(votingUtils, 'calculateUserVotingParams').mockResolvedValue({
                totalVotingPower: new Decimal('100'),
                votesSpent: new Decimal('0'),
                votesRemaining: new Decimal('100'),
                userVotes: [],
            });
            const user = { address: 'nickdodson.eth' };
            const contestId = 0;
            const payload = [
                { submissionId: 1, votes: new Decimal('10') },
                { submissionId: 2, votes: new Decimal('30') },
                { submissionId: 6, votes: new Decimal('60') }
            ]

            const result = votingUtils.castVotes(user, contestId, payload);
            await expect(result).rejects.toEqual(new GraphQLError('Invalid submissionId', {
                extensions: {
                    code: 'INVALID_SUBMISSION_ID'
                }
            }));

        });

        test('throw insert votes error', async () => {
            jest.spyOn(votingUtils, 'fetchUserVotes').mockResolvedValue([
                { submissionId: 0, votes: 3 },
                { submissionId: 1, votes: 2 },
                { submissionId: 2, votes: 1 }
            ]);
            jest.spyOn(votingUtils, 'insertVotes').mockImplementation((user: any, contestId: any, paylaod: any) => {
                throw new GraphQLError('Failed to create votes', {
                    extensions: {
                        code: 'FAILED_TO_CREATE_VOTES'
                    }
                });
            });
            jest.spyOn(votingUtils, 'getContestSubmissions').mockResolvedValue([
                { id: 1 }, { id: 2 }, { id: 3 }
            ])
            jest.spyOn(votingUtils, 'calculateTotalVotingPower').mockResolvedValue(new Decimal('100'));
            jest.spyOn(votingUtils, 'calculateUserVotingParams').mockResolvedValue({
                totalVotingPower: new Decimal('100'),
                votesSpent: new Decimal('0'),
                votesRemaining: new Decimal('100'),
                userVotes: [],
            });
            const user = { address: 'nickdodson.eth' };
            const contestId = 0;
            const payload = [
                { submissionId: 1, votes: new Decimal('10') },
                { submissionId: 2, votes: new Decimal('30') },
                { submissionId: 3, votes: new Decimal('60') }
            ]

            const result = votingUtils.castVotes(user, contestId, payload);
            await expect(result).rejects.toEqual(new GraphQLError('Failed to create votes', {
                extensions: {
                    code: 'FAILED_TO_CREATE_VOTES'
                }
            }));

        });

        test('successfully traverse function', async () => {
            jest.spyOn(votingUtils, 'fetchUserVotes').mockResolvedValue([
                { submissionId: 0, votes: 3 },
                { submissionId: 1, votes: 2 },
                { submissionId: 2, votes: 1 }
            ]);
            jest.spyOn(votingUtils, 'insertVotes').mockResolvedValue(true);
            jest.spyOn(votingUtils, 'getContestSubmissions').mockResolvedValue([
                { id: 1 }, { id: 2 }, { id: 3 }
            ])
            jest.spyOn(votingUtils, 'calculateTotalVotingPower').mockResolvedValue(new Decimal('100'));
            jest.spyOn(votingUtils, 'calculateUserVotingParams').mockResolvedValue({
                totalVotingPower: new Decimal('100'),
                votesSpent: new Decimal('100'),
                votesRemaining: new Decimal('0'),
                userVotes: [
                    { submissionId: 1, votes: 10 },
                    { submissionId: 2, votes: 30 },
                    { submissionId: 3, votes: 60 }
                ],
            });
            const user = { address: 'nickdodson.eth' };
            const contestId = 0;
            const payload = [
                { submissionId: 1, votes: new Decimal('10') },
                { submissionId: 2, votes: new Decimal('30') },
                { submissionId: 3, votes: new Decimal('60') }
            ]

            const result = await votingUtils.castVotes(user, contestId, payload);
            expect(result).toEqual({
                totalVotingPower: new Decimal('100'),
                votesSpent: new Decimal('100'),
                votesRemaining: new Decimal('0'),
                userVotes: [
                    { submissionId: 1, votes: 10 },
                    { submissionId: 2, votes: 30 },
                    { submissionId: 3, votes: 60 }
                ],
            });

        });
    });
});




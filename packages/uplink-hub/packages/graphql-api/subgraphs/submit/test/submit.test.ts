import { describe, expect, test, jest, afterEach, afterAll } from '@jest/globals';
import * as submitUtils from '../src/utils/submit';
import { redisClient } from '../src/utils/cache';
import { GraphQLError } from 'graphql';
import { Decimal } from 'lib';

describe('submit utils test suite', () => {
    afterAll(async () => {
        await redisClient.quit();
    });
    describe('deadlineAdjustedSubPower', () => {
        test('return 0 with now < startTime', () => {
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

            const maxSubPower = 100;
            const result = submitUtils.deadlineAdjustedSubmittingPower(maxSubPower, deadlines);
            expect(result).toEqual(0);

        });

        test('return 0 with now > voteTime', () => {
            const startTime = new Date(new Date().getTime() - 3000).toISOString();
            const voteTime = new Date(new Date().getTime() - 2000).toISOString();
            const endTime = new Date(new Date().getTime() + 3000).toISOString();
            const snapshot = new Date(new Date().getTime() - 3000).toISOString();
            const deadlines = {
                startTime,
                voteTime,
                endTime,
                snapshot
            };

            const maxSubPower = 100;
            const result = submitUtils.deadlineAdjustedSubmittingPower(maxSubPower, deadlines);
            expect(result).toEqual(0);

        });

        test('succeed with valid submit window', () => {
            const startTime = new Date(new Date().getTime() - 3000).toISOString();
            const voteTime = new Date(new Date().getTime() + 2000).toISOString();
            const endTime = new Date(new Date().getTime() + 3000).toISOString();
            const snapshot = new Date(new Date().getTime() - 3000).toISOString();
            const deadlines = {
                startTime,
                voteTime,
                endTime,
                snapshot
            };

            const maxSubPower = 100;
            const result = submitUtils.deadlineAdjustedSubmittingPower(maxSubPower, deadlines);
            expect(result).toEqual(100);

        });
    });


    describe('computeMaxSubmissionPower', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        })

        test('cache hit no restrictions', async () => {
            jest.spyOn(submitUtils, 'getCacheTotalSubPower').mockResolvedValue(3);
            jest.spyOn(submitUtils, 'fetchContestParameters').mockResolvedValue({
                subLimit: 3,
                deadlines: {
                    startTime: new Date(new Date().getTime() - 3000).toISOString(),
                    voteTime: new Date(new Date().getTime() + 2000).toISOString(),
                    endTime: new Date(new Date().getTime() + 3000).toISOString(),
                    snapshot: new Date(new Date().getTime() - 3000).toISOString(),
                }
            });

            const user = { address: 'nickdodson.eth' };
            const contestId = 1;
            const result = await submitUtils.computeMaxSubmissionPower(user, contestId);
            expect(result).toEqual(3);
        });


        test('cache hit unlimited subLimit', async () => {
            jest.spyOn(submitUtils, 'getCacheTotalSubPower').mockResolvedValue(10);
            jest.spyOn(submitUtils, 'fetchContestParameters').mockResolvedValue({
                subLimit: 0,
                deadlines: {
                    startTime: new Date(new Date().getTime() - 3000).toISOString(),
                    voteTime: new Date(new Date().getTime() + 2000).toISOString(),
                    endTime: new Date(new Date().getTime() + 3000).toISOString(),
                    snapshot: new Date(new Date().getTime() - 3000).toISOString(),
                }
            });

            const user = { address: 'nickdodson.eth' };
            const contestId = 1;
            const result = await submitUtils.computeMaxSubmissionPower(user, contestId);
            expect(result).toEqual(10);
        });


        test('cache hit with restrictions', async () => {
            jest.spyOn(submitUtils, 'getCacheTotalSubPower').mockResolvedValue(3);
            jest.spyOn(submitUtils, 'fetchContestParameters').mockResolvedValue({
                subLimit: 0,
                deadlines: {
                    startTime: new Date(new Date().getTime() - 3000).toISOString(),
                    voteTime: new Date(new Date().getTime() + 2000).toISOString(),
                    endTime: new Date(new Date().getTime() + 3000).toISOString(),
                    snapshot: new Date(new Date().getTime() - 3000).toISOString(),
                }
            });
            jest.spyOn(submitUtils, 'fetchSubmitterRestrictions').mockResolvedValue([{
                restrictionType: 'token',
                tokenRestriction: {
                    threshold: new Decimal(10),
                    token: {
                        type: "ETH",
                        decimals: 18,
                        symbol: "ETH",
                    }
                }
            }]);
            const user = { address: 'nickdodson.eth' };
            const contestId = 1;
            const result = await submitUtils.computeMaxSubmissionPower(user, contestId);
            expect(result).toEqual(3);
        });


        test('cache miss, fail wallet check', async () => {
            jest.spyOn(submitUtils, 'getCacheTotalSubPower').mockResolvedValue(null);
            jest.spyOn(submitUtils, 'setCacheTotalSubPower').mockResolvedValue(true);
            jest.spyOn(submitUtils, 'fetchContestParameters').mockResolvedValue({
                subLimit: 0,
                deadlines: {
                    startTime: new Date(new Date().getTime() - 3000).toISOString(),
                    voteTime: new Date(new Date().getTime() + 2000).toISOString(),
                    endTime: new Date(new Date().getTime() + 3000).toISOString(),
                    snapshot: new Date(new Date().getTime() - 3000).toISOString(),
                }
            });
            jest.spyOn(submitUtils, 'fetchSubmitterRestrictions').mockResolvedValue([{
                restrictionType: 'token',
                tokenRestriction: {
                    threshold: new Decimal(10),
                    token: {
                        type: "ETH",
                        decimals: 18,
                        symbol: "ETH",
                    }
                }
            }]);
            const user = { address: 'nickdodson.eth' };
            const contestId = 1;
            const result = await submitUtils.computeMaxSubmissionPower(user, contestId);
            expect(result).toEqual(0);
        });

        test('cache miss, pass wallet check', async () => {
            jest.spyOn(submitUtils, 'getCacheTotalSubPower').mockResolvedValue(null);
            jest.spyOn(submitUtils, 'setCacheTotalSubPower').mockResolvedValue(true);
            jest.spyOn(submitUtils, 'fetchContestParameters').mockResolvedValue({
                subLimit: 3,
                deadlines: {
                    startTime: new Date(new Date().getTime() - 3000).toISOString(),
                    voteTime: new Date(new Date().getTime() + 2000).toISOString(),
                    endTime: new Date(new Date().getTime() + 3000).toISOString(),
                    snapshot: new Date(new Date().getTime() - 3000).toISOString(),
                }
            });
            jest.spyOn(submitUtils, 'fetchSubmitterRestrictions').mockResolvedValue([{
                restrictionType: 'token',
                tokenRestriction: {
                    threshold: new Decimal('0.00001'),
                    token: {
                        type: "ETH",
                        decimals: 18,
                        symbol: "ETH",
                    }
                }
            }]);
            const user = { address: 'nickdodson.eth' };
            const contestId = 1;
            const result = await submitUtils.computeMaxSubmissionPower(user, contestId);
            expect(result).toEqual(3);
            expect(result).toEqual(3);
        });

    });

    describe('computeSubmissionParams', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        })

        test('positive maxSubPower, user has not submitted', async () => {
            jest.spyOn(submitUtils, 'computeMaxSubmissionPower').mockResolvedValue(3);
            jest.spyOn(submitUtils, 'fetchUserSubmissions').mockResolvedValue([]);
            const user = { address: 'nickdodson.eth' };
            const contestId = 1;
            const result = await submitUtils.computeSubmissionParams(user, contestId);
            expect(result).toEqual({
                remainingSubPower: 3,
                maxSubPower: 3,
                userSubmissions: []
            });
        })

        test('zero maxSubPower, user has not submitted', async () => {
            jest.spyOn(submitUtils, 'computeMaxSubmissionPower').mockResolvedValue(0);
            jest.spyOn(submitUtils, 'fetchUserSubmissions').mockResolvedValue([]);
            const user = { address: 'nickdodson.eth' };
            const contestId = 1;
            const result = await submitUtils.computeSubmissionParams(user, contestId);
            expect(result).toEqual({
                remainingSubPower: 0,
                maxSubPower: 0,
                userSubmissions: []
            });
        })

        test('positive maxSubPower, user has submitted', async () => {
            jest.spyOn(submitUtils, 'computeMaxSubmissionPower').mockResolvedValue(3);
            jest.spyOn(submitUtils, 'fetchUserSubmissions').mockResolvedValue([{ id: 1 }, { id: 2 }]);
            const user = { address: 'nickdodson.eth' };
            const contestId = 1;
            const result = await submitUtils.computeSubmissionParams(user, contestId);
            expect(result).toEqual({
                remainingSubPower: 1,
                maxSubPower: 3,
                userSubmissions: [{ id: 1 }, { id: 2 }]
            });
        })

    })
});




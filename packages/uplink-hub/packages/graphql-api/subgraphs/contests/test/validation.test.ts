import { describe, expect, test } from "@jest/globals";
import { ContestBuilderProps, VotingPolicy, validateDeadlines, validatePrompt, validateSubmitterRestrictions, validateSubmitterRewards, validateVoterRewards, validateVotingPolicy } from "../src/utils/validateContestParams";
import { IERCToken, INativeToken, IToken, SubmitterRestriction, SubmitterRewards, VoterRewards } from "lib";


export const sampleERC1155Token: IERCToken = {
    type: "ERC1155",
    address: "0x7c2748C7Ec984b559EADc39C7a4944398E34911a",
    symbol: "TNS",
    decimals: 0,
    tokenId: 2,
}

export const sampleERC20Token: IERCToken = {
    type: "ERC20",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    symbol: "USDC",
    decimals: 6,
}

export const sampleERC721Token: IERCToken = {
    type: "ERC721",
    address: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
    symbol: "NOUN",
    decimals: 0,
}

export const sampleETHToken: INativeToken = {
    type: "ETH",
    symbol: "ETH",
    decimals: 18,
}

describe('Contest Param Validation', () => {

    describe(' Validate Deadlines', () => {

        test('should return error if startTime is after voteTime', async () => {
            const deadlines = {
                snapshot: '2020-01-01T00:00:00.000Z',
                startTime: '2020-01-02T00:00:00.000Z',
                voteTime: '2020-01-01T00:00:00.000Z',
                endTime: '2020-01-03T00:00:00.000Z',
            }
            const { error, deadlines: deadlineResponse } = validateDeadlines(deadlines);
            expect(error).toEqual('Vote date must be after start date');
            expect(deadlineResponse).toEqual({
                snapshot: deadlines.snapshot,
                startTime: deadlines.startTime,
                voteTime: deadlines.voteTime,
                endTime: deadlines.endTime,
            });
        })


        test('should return error if voteTime is after endTime', async () => {
            const deadlines = {
                snapshot: '2020-01-01T00:00:00.000Z',
                startTime: '2020-01-02T00:00:00.000Z',
                voteTime: '2020-01-04T00:00:00.000Z',
                endTime: '2020-01-03T00:00:00.000Z',
            }
            const { error, deadlines: deadlineResponse } = validateDeadlines(deadlines);
            expect(error).toEqual('End date must be after vote date');
            expect(deadlineResponse).toEqual({
                snapshot: deadlines.snapshot,
                startTime: deadlines.startTime,
                voteTime: deadlines.voteTime,
                endTime: deadlines.endTime,
            });
        })

        test('should return multiple errors #1', async () => {
            const deadlines = {
                snapshot: '2020-01-01T00:00:00.000Z',
                startTime: '2021-01-02T00:00:00.000Z',
                voteTime: '2021-01-03T00:00:00.000Z',
                endTime: '2021-01-01T00:00:00.000Z',
            }
            const { error, deadlines: deadlineResponse } = validateDeadlines(deadlines);
            expect(error).toEqual('End date must be after vote date, End date must be after start date');
            expect(deadlineResponse).toEqual({
                snapshot: deadlines.snapshot,
                startTime: deadlines.startTime,
                voteTime: deadlines.voteTime,
                endTime: deadlines.endTime,
            });

        });

        test('should return multiple errors #2', async () => {
            const deadlines = {
                snapshot: '2021-01-04T00:00:00.000Z',
                startTime: '2021-01-03T00:00:00.000Z',
                voteTime: '2021-01-02T00:00:00.000Z',
                endTime: '2021-01-01T00:00:00.000Z',
            }
            const { error, deadlines: deadlineResponse } = validateDeadlines(deadlines);
            expect(error).toEqual('Snapshot date must be before start date, Vote date must be after start date, End date must be after vote date, End date must be after start date');
            expect(deadlineResponse).toEqual({
                snapshot: deadlines.snapshot,
                startTime: deadlines.startTime,
                voteTime: deadlines.voteTime,
                endTime: deadlines.endTime,
            });

        });


    });

    describe('Validate Prompt', () => {
        test('return error if prompt title is empty string and body blocks are empty', async () => {
            const prompt = {
                title: '',
                body: {
                    time: 1682628241526,
                    blocks: [],
                    version: "2.26.5"
                },
            }
            const { error, prompt: promptResponse } = validatePrompt(prompt);
            expect(error).toEqual('Prompt title is required, Prompt body blocks cannot be empty');
            expect(promptResponse).toEqual({
                title: prompt.title,
                body: prompt.body,
            });
        })

        test('succeed if body and title are valid', async () => {
            const prompt = {
                title: 'test',
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
                }
            }

            const { error, prompt: promptResponse } = validatePrompt(prompt);
            expect(error).toBeUndefined();
            expect(promptResponse).toEqual({
                title: prompt.title,
                body: prompt.body
            });

        });

        test('succeed if body and title and coverUrl are valid', async () => {
            const prompt = {
                title: '    test   ',
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
                    version: "2.26.5",

                },
                coverUrl: 'https://calabara.mypinata.cloud/ipfs/QmUxRzCcizzuNdyPRxMdn4LFQQQ5ce9cRqubnUCaR4G7Bz'
            }

            const { error, prompt: promptResponse } = validatePrompt(prompt);
            expect(error).toBeUndefined();
            expect(promptResponse).toEqual({
                title: 'test',
                body: prompt.body,
                coverUrl: prompt.coverUrl
            });
        });

    });


    describe('Validate Submitter Rewards', () => {

        test('return error if payouts are defined without a token', async () => {
            const submitterRewards = {
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '100' }
                    }
                ]
            }
            const { error, submitterRewards: submitterRewardsResponse } = await validateSubmitterRewards(submitterRewards);
            expect(error).toEqual('At least one token must be defined');
            expect(submitterRewardsResponse).toEqual({
                payouts: submitterRewards.payouts
            });
        })

        test('return error if tokens are defined without a payout', async () => {
            const submitterRewards = {
                ETH: sampleETHToken,
            }

            const { error, submitterRewards: submitterRewardsResponse } = await validateSubmitterRewards(submitterRewards);
            expect(error).toEqual('At least one payout must be defined');
        });

        test('return error if tokens are defined with an empty array payout', async () => {
            const submitterRewards = {
                ETH: sampleETHToken,
                payouts: []
            }

            const { error, submitterRewards: submitterRewardsResponse } = await validateSubmitterRewards(submitterRewards);
            expect(error).toEqual('At least one payout must be defined');
        });


        test('return error if token is invalid', async () => {
            const submitterRewards = {
                ERC20: { ...sampleERC20Token, address: '0x123' },
                payouts: [
                    {
                        rank: 1,
                        ERC20: { amount: '100' }
                    }
                ]
            }

            const { error, submitterRewards: submitterRewardsResponse } = await validateSubmitterRewards(submitterRewards);
            expect(error).toEqual('Invalid ERC20 token');
        });

        test('return error if token is not ERC / Native', async () => {
            const submitterRewards = {
                INVALID: { ...sampleERC20Token, address: '0x123' },
                payouts: [
                    {
                        rank: 1,
                        ERC20: { amount: '100' }
                    }
                ]
            }

            const { error, submitterRewards: submitterRewardsResponse } = await validateSubmitterRewards(submitterRewards);
            expect(error).toEqual('Invalid INVALID token');
        });

        test('return error if duplicate ranks are found', async () => {
            const submitterRewards = {
                ETH: sampleETHToken,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '100' }
                    },
                    {
                        rank: 1,
                        ETH: { amount: '100' }
                    },
                    {
                        rank: 2,
                        ETH: { amount: '100' }
                    },
                    {
                        rank: 2,
                        ETH: { amount: '100' }
                    }
                ]
            }

            const { error, submitterRewards: submitterRewardsResponse } = await validateSubmitterRewards(submitterRewards);
            expect(error).toEqual('Duplicate rank 1 found at index 1, Duplicate rank 2 found at index 3');
        });

        test('return multiple errors', async () => {
            const submitterRewards = {
                ERC20: { ...sampleERC20Token, address: '0x123' },
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '100' }
                    },
                    {
                        rank: 1,
                        ETH: { amount: '100' }
                    },
                    {
                        rank: 2,
                        ETH: { amount: '100' }
                    },
                    {
                        rank: 2,
                        ETH: { amount: '100' }
                    }
                ]
            }

            const { error, submitterRewards: submitterRewardsResponse } = await validateSubmitterRewards(submitterRewards);
            expect(error).toEqual('Invalid ERC20 token, Duplicate rank 1 found at index 1, Duplicate rank 2 found at index 3');
        });

        test('return error if fungible payout amount is negative or 0', async () => {
            const submitterRewards = {
                ETH: sampleETHToken,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '-100' }
                    },
                    {
                        rank: 2,
                        ETH: { amount: '0' }
                    }
                ]
            };

            const { error, submitterRewards: submitterRewardsResponse } = await validateSubmitterRewards(submitterRewards);
            expect(error).toEqual('Invalid ETH amount for rank 1 at index 0, Invalid ETH amount for rank 2 at index 1');
        });

        test('return error if ERC721 tokenId is null', async () => {
            const submitterRewards = {
                ERC721: sampleERC721Token,
                payouts: [
                    {
                        rank: 1,
                        ERC721: { tokenId: null }
                    }
                ]
            };

            const { error, submitterRewards: submitterRewardsResponse } = await validateSubmitterRewards(submitterRewards);
            expect(error).toEqual('Invalid ERC721 tokenId for rank 1 at index 0');
        });

        test('succeed with valid params and fungible erc1155 token', async () => {
            const submitterRewards = {
                ETH: sampleETHToken,
                ERC1155: sampleERC1155Token,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '100.5' },
                        ERC1155: { amount: '100' }
                    },
                    {
                        rank: 2,
                        ETH: { amount: '200.25' }
                    }
                ]
            };

            const { error, submitterRewards: submitterRewardsResponse } = await validateSubmitterRewards(submitterRewards);
            expect(error).toBeUndefined();
            expect(submitterRewardsResponse).toEqual({
                ETH: sampleETHToken,
                ERC1155: sampleERC1155Token,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '100.5' },
                        ERC1155: { amount: '100' }
                    },
                    {
                        rank: 2,
                        ETH: { amount: '200.25' }

                    }
                ]
            });
        });
    });


    describe('Validate Voter Rewards', () => {

        test('return error if payouts are defined without a token', async () => {
            const voterRewards = {
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '100' }
                    }
                ]
            }
            const { error, voterRewards: voterRewardsResponse } = await validateVoterRewards(voterRewards);
            expect(error).toEqual('At least one token must be defined');
            expect(voterRewardsResponse).toEqual({
                payouts: voterRewards.payouts
            });
        })

        test('return error if tokens are defined without a payout', async () => {
            const voterRewards = {
                ETH: sampleETHToken,
            }

            const { error, voterRewards: voterRewardsResponse } = await validateVoterRewards(voterRewards);
            expect(error).toEqual('At least one payout must be defined');
        });

        test('return error if tokens are defined with an empty array payout', async () => {
            const voterRewards = {
                ETH: sampleETHToken,
                payouts: []
            }

            const { error, voterRewards: voterRewardsResponse } = await validateVoterRewards(voterRewards);
            expect(error).toEqual('At least one payout must be defined');
        });


        test('return error if token is invalid', async () => {
            const voterRewards = {
                ERC20: { ...sampleERC20Token, address: '0x123' },
                payouts: [
                    {
                        rank: 1,
                        ERC20: { amount: '100' }
                    }
                ]
            }

            const { error, voterRewards: voterRewardsResponse } = await validateVoterRewards(voterRewards);
            expect(error).toEqual('Invalid ERC20 token');
        });

        test('return error if token is not ERC / Native', async () => {
            const voterRewards = {
                INVALID: { ...sampleERC20Token, address: '0x123' },
                payouts: [
                    {
                        rank: 1,
                        ERC20: { amount: '100' }
                    }
                ]
            }

            const { error, voterRewards: voterRewardsResponse } = await validateVoterRewards(voterRewards);
            expect(error).toEqual('Invalid INVALID token');
        });

        test('return error if duplicate ranks are found', async () => {
            const voterRewards = {
                ETH: sampleETHToken,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '100' }
                    },
                    {
                        rank: 1,
                        ETH: { amount: '100' }
                    },
                    {
                        rank: 2,
                        ETH: { amount: '100' }
                    },
                    {
                        rank: 2,
                        ETH: { amount: '100' }
                    }
                ]
            }

            const { error, voterRewards: voterRewardsResponse } = await validateVoterRewards(voterRewards);
            expect(error).toEqual('Duplicate rank 1 found at index 1, Duplicate rank 2 found at index 3');
        });

        test('return multiple errors', async () => {
            const voterRewards = {
                ERC20: { ...sampleERC20Token, address: '0x123' },
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '100' }
                    },
                    {
                        rank: 1,
                        ETH: { amount: '100' }
                    },
                    {
                        rank: 2,
                        ETH: { amount: '100' }
                    },
                    {
                        rank: 2,
                        ETH: { amount: '100' }
                    }
                ]
            }

            const { error, voterRewards: voterRewardsResponse } = await validateVoterRewards(voterRewards);
            expect(error).toEqual('Invalid ERC20 token, Duplicate rank 1 found at index 1, Duplicate rank 2 found at index 3');
        });

        test('return error if multiple tokens are defined for a single payout', async () => {
            const voterRewards = {
                ETH: sampleETHToken,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '100' },
                        ERC20: { amount: '100' }
                    }
                ]
            }

            const { error, voterRewards: voterRewardsResponse } = await validateVoterRewards(voterRewards);
            expect(error).toEqual('Only one token can be defined for payout at index 0');
        });


        test('succeed if params are valid', async () => {
            const voterRewards = {
                ETH: sampleETHToken,
                payouts: [
                    {
                        rank: 1,
                        ETH: { amount: '100' }
                    },
                    {
                        rank: 2,
                        ETH: { amount: '100' }
                    }
                ]
            }

            const { error, voterRewards: voterRewardsResponse } = await validateVoterRewards(voterRewards);
            expect(error).toBeUndefined();
            expect(voterRewardsResponse).toEqual({
                ETH: sampleETHToken,
                payouts: voterRewards.payouts
            });
        });

    });

    describe('Validate Submitter Restrictions', () => {

        test("should succeed if submitter restrictions is empty array", async () => {
            const submitterRestrictions = []
            const { error, submitterRestrictions: submitterRestrictionsResponse } = await validateSubmitterRestrictions(submitterRestrictions);
            expect(error).toBeUndefined();
            expect(submitterRestrictionsResponse).toEqual([]);
        })

        test("should return error if restriction token is invalid", async () => {
            const submitterRestrictions = [
                {
                    token: sampleETHToken,
                    threshold: '100'
                },
                {
                    token: { ...sampleERC20Token, address: '0x123' },
                    threshold: '100'
                }
            ]
            const { error, submitterRestrictions: submitterRestrictionsResponse } = await validateSubmitterRestrictions(submitterRestrictions);
            expect(error).toEqual("Invalid ERC20 token");
        })

        test("should return error if threshold is 0", async () => {
            const submitterRestrictions = [
                {
                    token: sampleETHToken,
                    threshold: '0'
                },
            ]
            const { error, submitterRestrictions: submitterRestrictionsResponse } = await validateSubmitterRestrictions(submitterRestrictions);
            expect(error).toEqual(`Invalid threshold amount at index 0`);
        });


        test("should return error if threshold is negative", async () => {
            const submitterRestrictions = [
                {
                    token: sampleETHToken,
                    threshold: '-10'
                },
            ]
            const { error, submitterRestrictions: submitterRestrictionsResponse } = await validateSubmitterRestrictions(submitterRestrictions);
            expect(error).toEqual(`Invalid threshold amount at index 0`);
        });
        test("should succeed if threshold is decimal", async () => {
            const submitterRestrictions = [
                {
                    token: sampleETHToken,
                    threshold: '10.5'
                },
            ]
            const { error, submitterRestrictions: submitterRestrictionsResponse } = await validateSubmitterRestrictions(submitterRestrictions);
            expect(error).toBeUndefined();
            expect(submitterRestrictionsResponse).toEqual(submitterRestrictions);
        });

    })

    describe('Validate Voting Policy', () => {

        test("should return error if voting policy token is invalid", async () => {

            const votingPolicy: ContestBuilderProps['votingPolicy'] = [{
                token: { ...sampleERC20Token, address: '0x123' },
                strategy: {
                    type: 'arcade',
                    votingPower: '100'
                }
            }]

            const { error, votingPolicy: votingPolicyResponse } = await validateVotingPolicy(votingPolicy);
            expect(error).toEqual("Invalid ERC20 token");
        })


        test("should return error if arcade strategy parameter is negative", async () => {
            const votingPolicy: ContestBuilderProps['votingPolicy'] = [{
                token: sampleERC20Token,
                strategy: {
                    type: 'arcade',
                    votingPower: '-100'
                }
            }]

            const { error, votingPolicy: votingPolicyResponse } = await validateVotingPolicy(votingPolicy);
            expect(error).toEqual(`Invalid strategy at index 0`)
        })


        test("should succeed with valid arcade strategy", async () => {
            const votingPolicy: ContestBuilderProps['votingPolicy'] = [{
                token: sampleERC20Token,
                strategy: {
                    type: 'arcade',
                    votingPower: '100'
                }
            }]

            const { error, votingPolicy: votingPolicyResponse } = await validateVotingPolicy(votingPolicy);
            expect(error).toBeUndefined();
            expect(votingPolicyResponse).toEqual(votingPolicy);
        })

        test("should succeed with valid weighted strategy", async () => {
            const votingPolicy: ContestBuilderProps['votingPolicy'] = [{
                token: sampleERC20Token,
                strategy: {
                    type: 'weighted',
                }
            }]

            const { error, votingPolicy: votingPolicyResponse } = await validateVotingPolicy(votingPolicy);
            expect(error).toBeUndefined();
            expect(votingPolicyResponse).toEqual(votingPolicy);

        })

    });
});


import { describe, expect, test } from "@jest/globals";
import { validateDeadlines, validatePrompt, validateSubmitterRestrictions, validateSubmitterRewards, validateVoterRewards, validateVotingPolicy } from "../src/resolvers/mutations";
import { IERCToken, INativeToken, IToken, SubmitterRestriction, SubmitterRewards, VoterRewards } from "lib";
import { VotingPolicy } from "lib";

export const sampleERC1155Token: IERCToken = {
    type: "ERC1155",
    address: "0xab0ab2fc1c498942B24278Bbd86bD171a3406A5E",
    symbol: "MmSzr",
    decimals: 0,
    tokenId: 1,
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



describe('validate deadlines', () => {

    const success = {
        startTime: {},
        voteTime: {},
        endTime: {}
    }

    test('should return error if dates are null', async () => {
        const deadlines = null
        const result = validateDeadlines(deadlines);
        expect(result).toStrictEqual({
            startTime: { error: 'startTime must be defined' },
            voteTime: { error: 'voteTime must be defined' },
            endTime: { error: 'endTime must be defined' }
        });
    })

    test('should return error if dates are not valid ISO strings', async () => {
        const deadlines = {
            startTime: 'not a valid ISO string',
            voteTime: 'not a valid ISO string',
            endTime: 'not a valid ISO string',
        }
        const result = validateDeadlines(deadlines);
        expect(result).toStrictEqual({
            startTime: { error: 'startTime must be a valid ISO date' },
            voteTime: { error: 'voteTime must be a valid ISO date' },
            endTime: { error: 'endTime must be a valid ISO date' }
        });
    })

    test('should return error if dates have overlap #1', async () => {
        const deadlines = {
            startTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
            voteTime: new Date().toISOString(),
            endTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        }
        const result = validateDeadlines(deadlines);
        expect(result).toStrictEqual({
            startTime: {},
            voteTime: { error: "Vote date must be after start date" },
            endTime: {}
        });
    })

    test('should return error if dates have overlap #2', async () => {
        const deadlines = {
            startTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
            voteTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date().toISOString(),
        }
        const result = validateDeadlines(deadlines);
        expect(result).toStrictEqual({
            startTime: {},
            voteTime: {},
            endTime: { error: "End date must be after start date" }
        });
    })

    test('should succeed', () => {
        const deadlines = {
            startTime: new Date().toISOString(),
            voteTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        }
        const result = validateDeadlines(deadlines);
        expect(result).toStrictEqual(success);
    })

})


describe('validate prompt', () => {

    const success = {
        title: {},
        body: {},
        coverUrl: {},
    }

    test('should return error if prompt is null', async () => {
        const prompt = null
        const result = validatePrompt(prompt);
        expect(result).toStrictEqual({
            title: { error: 'Prompt title must be defined' },
            body: { error: 'Prompt body must be defined' },
            coverUrl: {}
        });
    })

    test('should return error if prompt is empty', async () => {
        const prompt = {
            title: '',
            body: '',
            coverUrl: '',
        }
        const result = validatePrompt(prompt);
        expect(result).toStrictEqual({
            title: { error: 'Prompt title must be defined' },
            body: { error: 'Prompt body must be defined' },
            coverUrl: {}
        });
    })

    test('should return error if coverUrl is not valid IPFS', async () => {
        const prompt = {
            title: 'test',
            body: 'test',
            coverUrl: 'test',
        }
        const result = validatePrompt(prompt);
        expect(result).toStrictEqual({
            title: {},
            body: {},
            coverUrl: { error: "Prompt cover image must be a valid IPFS hash" }
        });
    })

    test('should succeed', () => {
        const prompt = {
            title: 'title',
            body: 'body',
            coverUrl: 'https://calabara.mypinata.cloud/ipfs/QmUxRzCcizzuNdyPRxMdn4LFQQQ5ce9cRqubnUCaR4G7Bz',
        }
        const result = validatePrompt(prompt);
        expect(result).toStrictEqual(success);
    })
})


describe('validate submitter rewards', () => {

    const success = {
        tokens: {},
        payouts: {},
    }

    test('should succeed if submitter rewards is null', async () => {
        const submitterRewards = null
        const result = await validateSubmitterRewards(submitterRewards);
        expect(result).toStrictEqual({
            tokens: {},
            payouts: {},
        });
    })

    test('should succeed if submitter rewards is empty object', async () => {
        const submitterRewards = {}
        const result = await validateSubmitterRewards(submitterRewards);
        expect(result).toStrictEqual({
            tokens: {},
            payouts: {},
        });
    })

    test('should return error if invalid tokens are passed ', async () => {
        const submitterRewards: SubmitterRewards = {
            ERC20: {
                type: "ERC20",
                address: "0x0000000",
                decimals: 18,
                symbol: "TEST",
            },
            payouts:
                [{
                    rank: 1,
                    ERC20: {
                        amount: 100,
                    }
                }]
        }
        const result = await validateSubmitterRewards(submitterRewards);
        expect(result).toStrictEqual({
            tokens: { error: "Invalid ERC20 token" },
            payouts: {},
        });
    })

    test('should return error if payouts are defined without tokens ', async () => {
        const submitterRewards: SubmitterRewards = {
            payouts:
                [{
                    rank: 1,
                    ERC20: {
                        amount: 100,
                    }
                }]
        }
        const result = await validateSubmitterRewards(submitterRewards);
        expect(result).toStrictEqual({
            tokens: { error: "At least one token must be defined" },
            payouts: {},
        });
    })

    test('should return error if tokens are defined without payouts ', async () => {
        const submitterRewards: SubmitterRewards = {
            ERC20: {
                type: "ERC20",
                address: "0x0000000",
                decimals: 18,
                symbol: "TEST",
            },
            payouts: []
        }
        const result = await validateSubmitterRewards(submitterRewards);
        expect(result).toStrictEqual({
            tokens: {},
            payouts: { error: "At least one payout must be defined" }

        });
    })


});

describe('validate voter rewards', () => {

    const success = {
        tokens: {},
        payouts: {},
    }

    test('should succeed if Voter rewards is null', async () => {
        const voterRewards = null
        const result = await validateVoterRewards(voterRewards);
        expect(result).toStrictEqual({
            tokens: {},
            payouts: {},
        });
    })

    test('should succeed if Voter rewards is empty object', async () => {
        const voterRewards = {}
        const result = await validateVoterRewards(voterRewards);
        expect(result).toStrictEqual({
            tokens: {},
            payouts: {},
        });
    })

    test('should return error if invalid tokens are passed ', async () => {
        const voterRewards: VoterRewards = {
            ERC20: {
                type: "ERC20",
                address: "0x0000000",
                decimals: 18,
                symbol: "TEST",
            },
            payouts:
                [{
                    rank: 1,
                    ERC20: {
                        amount: 100,
                    }
                }]
        }
        const result = await validateVoterRewards(voterRewards);
        expect(result).toStrictEqual({
            tokens: { error: "Invalid ERC20 token" },
            payouts: {},
        });
    })

    test('should return error if payouts are defined without tokens ', async () => {
        const voterRewards: VoterRewards = {
            payouts:
                [{
                    rank: 1,
                    ERC20: {
                        amount: 100,
                    }
                }]
        }
        const result = await validateVoterRewards(voterRewards);
        expect(result).toStrictEqual({
            tokens: { error: "At least one token must be defined" },
            payouts: {},
        });
    })

    test('should return error if tokens are defined without payouts ', async () => {
        const voterRewards: VoterRewards = {
            ERC20: {
                type: "ERC20",
                address: "0x0000000",
                decimals: 18,
                symbol: "TEST",
            },
            payouts: []
        }
        const result = await validateVoterRewards(voterRewards);
        expect(result).toStrictEqual({
            tokens: {},
            payouts: { error: "At least one payout must be defined" }
        });
    })

    test('should succeed with valid data ', async () => {
        const voterRewards: VoterRewards = {
            ERC20: sampleERC20Token,
            payouts:
                [{
                    rank: 1,
                    ERC20: {
                        amount: 100,
                    }
                }]
        }
        const result = await validateVoterRewards(voterRewards);
        expect(result).toStrictEqual({
            tokens: {},
            payouts: {}
        });
    })


});


describe('validate submitter restrictions', () => {
    const success = {
        tokens: {},
        thresholds: {}
    }

    test("should succeed if submitter restrictions is empty array", async () => {
        const submitterRestrictions = []
        const result = await validateSubmitterRestrictions(submitterRestrictions);
        expect(result).toStrictEqual(success);
    })

    test("should return error if restriction token is invalid", async () => {
        const submitterRestrictions: SubmitterRestriction[] = [
            {
                token: sampleETHToken,
                threshold: 100
            },
            {
                token: {
                    type: "ERC20",
                    address: "0x0000000",
                    decimals: 18,
                    symbol: "TEST",
                },
                threshold: 100
            }
        ]
        const result = await validateSubmitterRestrictions(submitterRestrictions);
        expect(result).toStrictEqual({
            tokens: { error: "Invalid ERC20 token" },
            thresholds: {}
        });
    })

    test("should return error if threshold is 0", async () => {
        const submitterRestrictions: SubmitterRestriction[] = [
            {
                token: sampleETHToken,
                threshold: 0
            },
        ]
        const result = await validateSubmitterRestrictions(submitterRestrictions);
        expect(result).toStrictEqual({
            tokens: {},
            thresholds: { error: "Threshold must be a positive, non-zero number" }
        });
    })

    test("should return error if threshold is negative", async () => {
        const submitterRestrictions: SubmitterRestriction[] = [
            {
                token: sampleETHToken,
                threshold: -10
            },
        ]
        const result = await validateSubmitterRestrictions(submitterRestrictions);
        expect(result).toStrictEqual({
            tokens: {},
            thresholds: { error: "Threshold must be a positive, non-zero number" }
        });
    })

    test("should succeed if threshold is decimal", async () => {
        const submitterRestrictions: SubmitterRestriction[] = [
            {
                token: sampleETHToken,
                threshold: 10.5534
            },
        ]
        const result = await validateSubmitterRestrictions(submitterRestrictions);
        expect(result).toStrictEqual(success);
    })

})


describe('validate voting policy', () => {

    const success = {
        tokens: {},
        strategies: {}
    }

    test("should return error if voting policy token is invalid", async () => {
        const votingPolicy: VotingPolicy[] = [{
            token: {
                type: "ERC20",
                address: "0x0000000",
                decimals: 18,
                symbol: "TEST",
            },
            strategy: {
                type: "arcade",
                votingPower: 100
            }
        }]
        const result = await validateVotingPolicy(votingPolicy);
        expect(result).toStrictEqual({
            tokens: { error: "Invalid ERC20 token" },
            strategies: {}
        });
    })

    test("should return error if neither strategy parameters are passed", async () => {
        const votingPolicy: VotingPolicy[] = [{
            token: sampleERC20Token,
            strategy: {
                type: "arcade",
            }
        }]
        const result = await validateVotingPolicy(votingPolicy);
        expect(result).toStrictEqual({
            tokens: {},
            strategies: { error: "Invalid strategy at index 0" }
        });
    })

    test("should return error if both strategy parameters are passed", async () => {
        const votingPolicy: VotingPolicy[] = [{
            token: sampleERC20Token,
            strategy: {
                type: "arcade",
                votingPower: 100,
                multiplier: 1
            }
        }]
        const result = await validateVotingPolicy(votingPolicy);
        expect(result).toStrictEqual({
            tokens: {},
            strategies: { error: "Invalid strategy at index 0" }
        });
    })

    test("should return error if arcade strategy parameter is negative", async () => {
        const votingPolicy: VotingPolicy[] = [{
            token: sampleERC20Token,
            strategy: {
                type: "arcade",
                votingPower: -100,
            }
        }]
        const result = await validateVotingPolicy(votingPolicy);
        expect(result).toStrictEqual({
            tokens: {},
            strategies: { error: "Invalid strategy at index 0" }
        });
    })

    test("should return error if weighted strategy parameter is negative", async () => {
        const votingPolicy: VotingPolicy[] = [{
            token: sampleERC20Token,
            strategy: {
                type: "weighted",
                multiplier: -100,
            }
        }]
        const result = await validateVotingPolicy(votingPolicy);
        expect(result).toStrictEqual({
            tokens: {},
            strategies: { error: "Invalid strategy at index 0" }
        });
    })

    test("should return error if arcade parameter is passed to weighted strategy", async () => {
        const votingPolicy: VotingPolicy[] = [{
            token: sampleERC20Token,
            strategy: {
                type: "weighted",
                votingPower: 100,
            }
        }]
        const result = await validateVotingPolicy(votingPolicy);
        expect(result).toStrictEqual({
            tokens: {},
            strategies: { error: "Invalid strategy at index 0" }
        });
    })

    test("should return error if weighted parameter is passed to arcade strategy", async () => {
        const votingPolicy: VotingPolicy[] = [{
            token: sampleERC20Token,
            strategy: {
                type: "arcade",
                multiplier: 100,
            }
        }]
        const result = await validateVotingPolicy(votingPolicy);
        expect(result).toStrictEqual({
            tokens: {},
            strategies: { error: "Invalid strategy at index 0" }
        });
    })

    test("should succeed with valid arcade strategy", async () => {
        const votingPolicy: VotingPolicy[] = [{
            token: sampleERC20Token,
            strategy: {
                type: "arcade",
                votingPower: 100,
            }
        }]
        const result = await validateVotingPolicy(votingPolicy);
        expect(result).toStrictEqual({
            tokens: {},
            strategies: {}
        });
    })

    test("should succeed with valid weighted strategy", async () => {
        const votingPolicy: VotingPolicy[] = [{
            token: sampleERC20Token,
            strategy: {
                type: "weighted",
                multiplier: 1,
            }
        }]
        const result = await validateVotingPolicy(votingPolicy);
        expect(result).toStrictEqual({
            tokens: {},
            strategies: {}
        });
    })

})
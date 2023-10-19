import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { validateAdditionalParams, validateDeadlines, validateMetadata, validatePrompt, validateSubmitterRestrictions, validateSubmitterRewards, validateTweetThread, validateVoterRewards, validateVotingPolicy } from '../src/utils/validate';
import { ContestAdditionalParams, ContestDeadlines, ContestMetadata, ContestPromptData, ContestSubmitterRestrictions, ContestSubmitterRewards, ContestVoterRewards, ContestVotingPolicy } from '../src/types/writeContest';
import { IERCToken, INativeToken } from 'lib';
import { ZodError } from 'zod';
import { TwitterThread } from '../src/types/writeTweet';

// helper defs

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
    tokenId: null,
}

export const sampleERC721Token: IERCToken = {
    type: "ERC721",
    address: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
    symbol: "NOUN",
    decimals: 0,
    tokenId: null,
}

export const sampleETHToken: INativeToken = {
    type: "ETH",
    symbol: "ETH",
    decimals: 18,
}


// metadata unit tests

describe("metadata validation tests", () => {


    test('validate metadata success', async () => {
        const metadata: ContestMetadata = {
            type: "standard",
            category: "art"
        }

        const result = validateMetadata(metadata);
        assert.deepEqual(result, metadata)

    });

    test('validate metadata invalid category', async () => {
        const metadata = {
            type: "standard",
            category: "not valid"
        }

        assert.throws(() => validateMetadata(metadata as any), (err: any) => {
            assert.deepEqual(err.format().category._errors,
                ["Invalid enum value. Expected 'art' | 'music' | 'writing' | 'video' | 'photography' | 'design' | 'memes' | 'other', received 'not valid'"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    });


    test('validate metadata invalid type', async () => {
        const metadata = {
            type: "not valid",
            category: "art"
        }

        assert.throws(() => validateMetadata(metadata as any), (err: any) => {
            assert.deepEqual(err.format().type._errors,
                ["Invalid enum value. Expected 'standard' | 'twitter', received 'not valid'"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    });
})


// deadlines unit tests

describe("deadlines validation tests", () => {


    test('pass with valid deadlines', async () => {
        const now = new Date().toISOString()
        const deadlines: ContestDeadlines = {
            startTime: now,
            snapshot: now,
            voteTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // + 2 days for voteTime
            endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // + 4 days for endTime
        }

        const result = validateDeadlines(deadlines)
        assert.deepEqual(result, deadlines)
    })

    test('fail with snapshot after start time', async () => {
        const deadlines: ContestDeadlines = {
            startTime: new Date().toISOString(),
            snapshot: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // + 1 day for snapshot
            voteTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // + 2 days for voteTime
            endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // + 4 days for endTime
        }

        assert.throws(() => validateDeadlines(deadlines), (err: any) => {
            assert.deepEqual(err.format()._errors,
                ["snapshot cannot be in the future", "snapshot must be at or before start time"]
            )

            assert(err instanceof ZodError);
            return true;
        })
    })

    test('fail with vote time before start time', async () => {
        const deadlines: ContestDeadlines = {
            startTime: new Date().toISOString(),
            snapshot: new Date().toISOString(),
            voteTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // - 1 day for voteTime
            endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // + 4 days for endTime
        }
        assert.throws(() => validateDeadlines(deadlines), (err: any) => {
            assert.deepEqual(err.format()._errors,
                ["start time must be before vote time"]
            )

            assert(err instanceof ZodError);
            return true;
        })
    })

    test('fail with end time before start time', async () => {
        const deadlines: ContestDeadlines = {
            startTime: new Date().toISOString(),
            snapshot: new Date().toISOString(),
            voteTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // + 2 days for voteTime
            endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // - 1 day for endTime
        }

        assert.throws(() => validateDeadlines(deadlines), (err: any) => {
            assert.deepEqual(err.format()._errors,
                ["vote time must be before end time"]
            )

            assert(err instanceof ZodError);
            return true;
        })
    })
})

// prompt unit tests

describe("prompt validation tests", () => {


    test('pass prompt validation', async () => {
        const promptData: ContestPromptData = {
            title: "test",
            body: {
                time: 1691467634285,
                blocks: [
                    {
                        id: "mwpICMESDW",
                        type: "paragraph",
                        data: {
                            text: "test",
                        },
                    },
                ],
                version: "2.26.5",
            },
            coverUrl: "https://xyz.xyz"
        }

        const result = validatePrompt(promptData);
        assert.deepEqual(result, promptData)
    })

    test('pass prompt validation with null coverUrl', async () => {
        const promptData: ContestPromptData = {
            title: "test",
            body: {
                time: 1691467634285,
                blocks: [
                    {
                        id: "mwpICMESDW",
                        type: "paragraph",
                        data: {
                            text: "test",
                        },
                    },
                ],
                version: "2.26.5",
            },
            coverUrl: null
        }

        const result = validatePrompt(promptData);
        assert.deepEqual(result, promptData)
    })

    test('fail prompt validation with invalid body', async () => {
        const promptData = {
            title: "test",
            body: {
                time: 1691467634285,
                version: "2.26.5",
            },
            coverUrl: null
        }

        assert.throws(() => validatePrompt(promptData as any), (err: any) => {
            assert.deepEqual(err.format()._errors,
                ["Prompt body is required"]
            )

            assert(err instanceof ZodError);
            return true;
        })
    })

    test('fail prompt validation with empty title', async () => {
        const promptData: ContestPromptData = {
            title: "",
            body: {
                time: 1691467634285,
                blocks: [
                    {
                        id: "mwpICMESDW",
                        type: "paragraph",
                        data: {
                            text: "test",
                        },
                    },
                ],
                version: "2.26.5",
            },
            coverUrl: null
        }

        assert.throws(() => validatePrompt(promptData), (err: any) => {
            assert.deepEqual(err.format().title._errors,
                ["Title must be at least 1 character long"]
            )

            assert(err instanceof ZodError);
            return true;
        })
    })

    test('fail prompt validation with title too long', async () => {
        const promptData: ContestPromptData = {
            title: "69".repeat(51),
            body: {
                time: 1691467634285,
                blocks: [
                    {
                        id: "mwpICMESDW",
                        type: "paragraph",
                        data: {
                            text: "test",
                        },
                    },
                ],
                version: "2.26.5",
            },
            coverUrl: null
        }

        assert.throws(() => validatePrompt(promptData), (err: any) => {
            assert.deepEqual(err.format().title._errors,
                ["Title must be less than 100 characters long"]
            )

            assert(err instanceof ZodError);
            return true;
        })
    })

    test('fail prompt validation with empty body blocks', async () => {
        const promptData: ContestPromptData = {
            title: "valid",
            body: {
                time: 1691467634285,
                blocks: [],
                version: "2.26.5",
            },
            coverUrl: null
        }

        assert.throws(() => validatePrompt(promptData), (err: any) => {
            assert.deepEqual(err.format()._errors,
                ["Prompt body is required"]
            )

            assert(err instanceof ZodError);
            return true;
        })
    })
});

// submitter rewards validation
describe("submitter rewards validation tests", () => {

    test('pass submitter rewards validation', async () => {
        const rewards: ContestSubmitterRewards = {
            "ETH": sampleETHToken,
            "ERC20": sampleERC20Token,
            "ERC721": sampleERC721Token,
            "ERC1155": sampleERC1155Token,
            "payouts": [
                {
                    "rank": 1,
                    "ETH": {
                        "amount": "1"
                    },
                    "ERC20": {
                        "amount": "20"
                    },
                },
                {
                    "rank": 2,
                    "ETH": {
                        "amount": "1"
                    },
                    "ERC721": {
                        "tokenId": 20
                    },
                    "ERC1155": {
                        "amount": "4"
                    }
                }
            ]
        }

        const result = await validateSubmitterRewards(rewards);
        assert.deepEqual(result, rewards)
    })

    test('pass submitter rewards validation with empty object', async () => {
        const rewards: ContestSubmitterRewards = {}

        const result = await validateSubmitterRewards(rewards);
        assert.deepEqual(result, {})
    })


    test('fail submitter rewards validation with invalid ERC token', async () => {
        const rewards: ContestSubmitterRewards = {
            "ETH": sampleETHToken,
            "ERC20": {
                type: "ERC20",
                address: "0x" + "dead".repeat(10),
                symbol: "invalid",
                decimals: 18,
                tokenId: null
            },
            "ERC721": sampleERC721Token,
            "ERC1155": sampleERC1155Token,
            "payouts": [
                {
                    "rank": 1,
                    "ETH": {
                        "amount": "1"
                    },
                    "ERC20": {
                        "amount": "20"
                    },
                },
                {
                    "rank": 2,
                    "ETH": {
                        "amount": "1"
                    },
                    "ERC721": {
                        "tokenId": 20
                    },
                    "ERC1155": {
                        "amount": "4"
                    }
                }
            ]
        }

        await assert.rejects(async () => await validateSubmitterRewards(rewards), (err: any) => {
            assert.deepEqual(err.format().ERC20._errors,
                ["Invalid token data"]
            )

            assert(err instanceof ZodError);
            return true;
        })

    })

    test('fail submitter rewards validation with invalid payouts', async () => {
        const rewards = {
            "ETH": sampleETHToken,
            "ERC20": sampleERC20Token,
            "ERC721": sampleERC721Token,
            "ERC1155": sampleERC1155Token,
            "payouts": [
                {
                    "rank": 1,
                    "ETH": {
                        "amount": "1"
                    },
                    "ERC20": {
                        "amount": "-20"
                    },
                },
                {
                    "rank": 2,
                    "ETH": {
                        "amount": "1"
                    },
                    "ERC721": {
                        "tokenId": null
                    },
                    "ERC1155": {
                        "amount": "4"
                    }
                }
            ]
        }

        await assert.rejects(async () => await validateSubmitterRewards(rewards as any), (err: any) => {
            assert.deepEqual(err.format().payouts[0].ERC20.amount._errors,
                ["Invalid argument"]
            )
            assert.deepEqual(err.format().payouts[1].ERC721.tokenId._errors,
                ["Expected number, received null"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })


    test('fail submitter rewards validation with invalid payout ranks', async () => {
        const rewards = {
            "ETH": sampleETHToken,
            "ERC20": sampleERC20Token,
            "ERC721": sampleERC721Token,
            "ERC1155": sampleERC1155Token,
            "payouts": [
                {
                    "rank": 1,
                    "ETH": {
                        "amount": "1"
                    },
                    "ERC20": {
                        "amount": "20"
                    },
                },
                {
                    "rank": 1,
                    "ETH": {
                        "amount": "1"
                    },
                    "ERC721": {
                        "tokenId": 200
                    },
                    "ERC1155": {
                        "amount": "4"
                    }
                }
            ]
        }

        await assert.rejects(async () => await validateSubmitterRewards(rewards as any), (err: any) => {
            assert.deepEqual(err.format()._errors,
                ["Duplicate ranks are not allowed"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })

    test('fail submitter rewards validation with invalid token definitions', async () => {
        const rewards = {
            "ETH": sampleETHToken,
            "payouts": [
                {
                    "rank": 1,
                    "ETH": {
                        "amount": "1"
                    },
                    "ERC20": {
                        "amount": "20"
                    },
                },
            ]
        }

        await assert.rejects(async () => await validateSubmitterRewards(rewards as any), (err: any) => {
            assert.deepEqual(err.format()._errors,
                ["Missing token definition(s) for payout token(s)"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })

})

// voter rewards validation

describe("voter rewards validation tests", () => {

    test('pass voter rewards validation', async () => {
        const rewards: ContestVoterRewards = {
            "ETH": sampleETHToken,
            "ERC20": sampleERC20Token,
            "payouts": [
                {
                    "rank": 1,
                    "ETH": {
                        "amount": "1"
                    },
                },
                {
                    "rank": 2,
                    "ETH": {
                        "amount": "1"
                    },
                }
            ]
        }

        const result = await validateVoterRewards(rewards);
        assert.deepEqual(result, rewards)
    })

    test('fail voter rewards validation for multi token payouts', async () => {
        const rewards: ContestVoterRewards = {
            "ETH": sampleETHToken,
            "ERC20": sampleERC20Token,
            "payouts": [
                {
                    "rank": 1,
                    "ETH": {
                        "amount": "1"
                    },
                    "ERC20": {
                        "amount": "20"
                    },
                },
                {
                    "rank": 2,
                    "ETH": {
                        "amount": "1"
                    },
                }
            ]
        }
        await assert.rejects(async () => await validateVoterRewards(rewards as any), (err: any) => {
            assert.deepEqual(err.format()._errors,
                ["Only one token type per rank is allowed"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })

    test('fail voter rewards validation for duplicate ranks', async () => {
        const rewards: ContestVoterRewards = {
            "ETH": sampleETHToken,
            "ERC20": sampleERC20Token,
            "payouts": [
                {
                    "rank": 1,
                    "ETH": {
                        "amount": "1"
                    },
                },
                {
                    "rank": 1,
                    "ETH": {
                        "amount": "1"
                    },
                }
            ]
        }
        await assert.rejects(async () => await validateVoterRewards(rewards as any), (err: any) => {
            assert.deepEqual(err.format()._errors,
                ["Duplicate ranks are not allowed"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })
})
// submitter restrictions validation

describe("submitter restrictions validation tests", () => {

    test('pass submitter restrictions validation', async () => {
        const restrictions: ContestSubmitterRestrictions = [
            {
                token: sampleETHToken,
                threshold: "1"
            },
            {
                token: sampleERC20Token,
                threshold: "20"
            },
            {
                token: sampleERC721Token,
                threshold: "1"
            },
            {
                token: sampleERC1155Token,
                threshold: "4"
            },
        ]

        const result = await validateSubmitterRestrictions(restrictions);
        assert.deepEqual(result, restrictions)
    })

    test('pass submitter restrictions validation with 0 rules', async () => {
        const restrictions: ContestSubmitterRestrictions = []

        const result = await validateSubmitterRestrictions(restrictions);
        assert.deepEqual(result, [])
    })

    test('fail submitter restrictions validation with invalid token', async () => {
        const restrictions: ContestSubmitterRestrictions = [
            {
                token: {
                    type: "ERC20",
                    address: "0x" + "dead".repeat(10),
                    symbol: "invalid",
                    decimals: 18,
                    tokenId: null
                },
                threshold: "1"
            },
        ]

        await assert.rejects(async () => await validateSubmitterRestrictions(restrictions as any), (err: any) => {
            assert.deepEqual(err.format()[0].token._errors,
                ["Invalid token data"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })

    test('fail submitter restrictions validation with invalid threshold', async () => {
        const restrictions: ContestSubmitterRestrictions = [
            {
                token: sampleETHToken,
                threshold: "-0.001"
            },
        ]

        await assert.rejects(async () => await validateSubmitterRestrictions(restrictions as any), (err: any) => {
            assert.deepEqual(err.format()[0].threshold._errors,
                ["Invalid argument"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })
})

// voting policy validation

describe("voting policy validation tests", () => {

    test("fail with empty voting policy", async () => {
        const votingPolicy = []
        await assert.rejects(async () => await validateVotingPolicy(votingPolicy as any), (err: any) => {
            assert.deepEqual(err.format()._errors,
                ["At least one voting policy is required"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })

    test("fail with invalid token", async () => {
        const votingPolicy: ContestVotingPolicy = [
            {
                token: {
                    type: "ERC20",
                    address: "0x" + "dead".repeat(10),
                    symbol: "invalid",
                    decimals: 18,
                    tokenId: null
                },
                strategy: {
                    type: "weighted"
                }
            }
        ]
        await assert.rejects(async () => await validateVotingPolicy(votingPolicy), (err: any) => {
            assert.deepEqual(err.format()[0].token._errors,
                ["Invalid token data"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })

    test("fail with invalid token", async () => {
        const votingPolicy: ContestVotingPolicy = [
            {
                token: {
                    type: "ERC20",
                    address: "0x" + "dead".repeat(10),
                    symbol: "invalid",
                    decimals: 18,
                    tokenId: null
                },
                strategy: {
                    type: "weighted"
                }
            }
        ]
        await assert.rejects(async () => await validateVotingPolicy(votingPolicy), (err: any) => {
            assert.deepEqual(err.format()[0].token._errors,
                ["Invalid token data"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })

    test("fail with invalid voting power", async () => {
        const votingPolicy: ContestVotingPolicy = [
            {
                token: sampleETHToken,
                strategy: {
                    type: "arcade",
                    votingPower: "-1"
                }
            }
        ]
        await assert.rejects(async () => await validateVotingPolicy(votingPolicy), (err: any) => {
            assert.deepEqual(err.format()[0].strategy.votingPower._errors,
                ["Invalid argument"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })
})

describe("additional params validation tests", () => {
    test("pass with valid params", async () => {
        const params: ContestAdditionalParams = {
            anonSubs: true,
            visibleVotes: false,
            selfVote: false,
            subLimit: 0
        }

        const result = validateAdditionalParams(params);
        assert.deepEqual(result, params)
    })

    test("fail with invalid sub limit", async () => {
        const params: ContestAdditionalParams = {
            anonSubs: true,
            visibleVotes: false,
            selfVote: false,
            subLimit: -1
        }

        assert.throws(() => validateAdditionalParams(params), (err: any) => {
            assert.deepEqual(err.format().subLimit._errors,
                ["Number must be greater than or equal to 0"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })

    test("fail with sub limit too large", async () => {
        const params: ContestAdditionalParams = {
            anonSubs: true,
            visibleVotes: false,
            selfVote: false,
            subLimit: 6
        }

        assert.throws(() => validateAdditionalParams(params), (err: any) => {
            assert.deepEqual(err.format().subLimit._errors,
                ["Number must be less than or equal to 3"]
            )
            assert(err instanceof ZodError);
            return true;
        })
    })
})

// tweet thread

describe("tweet thread validation tests", () => {

    test("fail with empty thread", async () => {
        const thread = []

        assert.throws(() => validateTweetThread(thread as any), (err: any) => {
            assert.deepEqual(err.format()._errors,
                ["Array must contain at least 1 element(s)"]
            )
            assert(err instanceof ZodError);
            return true
        })
    })


    test("fail with empty thread item", async () => {
        const thread: TwitterThread = [{}]

        assert.throws(() => validateTweetThread(thread), (err: any) => {
            assert.deepEqual(err.format()[0]._errors,
                ["Tweet must have text, video, or image"]
            )
            assert(err instanceof ZodError);
            return true
        })
    })

    test("fail without thumbnail", async () => {
        const thread: TwitterThread = [{
            text: "test",
            videoAsset: "https://xyz.com",
            assetType: "video",
            assetSize: 1000
        }]

        assert.throws(() => validateTweetThread(thread), (err: any) => {
            assert.deepEqual(err.format()[0]._errors,
                ["Tweet with video must have preview thumbnail"]
            )
            assert(err instanceof ZodError);
            return true
        })
    })

    test("fail with text too long", async () => {
        const thread: TwitterThread = [{
            text: "69".repeat(141),
            previewAsset: "https://xyz.com",
            videoAsset: "https://xyz.com",
            assetType: "video",
            assetSize: 1000
        }]

        assert.throws(() => validateTweetThread(thread), (err: any) => {
            assert.deepEqual(err.format()[0].text._errors,
                ["String must contain at most 280 character(s)"]
            )
            assert(err instanceof ZodError);
            return true
        })
    })

    test("pass validation", async () => {
        const thread: TwitterThread = [{
            text: "69".repeat(69),
            previewAsset: "https://xyz.com",
            videoAsset: "https://xyz.com",
            assetType: "video",
            assetSize: 1000
        }]

        const result = validateTweetThread(thread);
        assert.deepEqual(result, thread)
    })

    test("pass validation with multi item thread", async () => {
        const thread: TwitterThread = [{
            text: "69".repeat(69),
            previewAsset: "https://xyz.com",
            videoAsset: "https://xyz.com",
            assetType: "video",
            assetSize: 1000
        },
        { text: "tweet 2" },
        { text: "tweet 3" }
        ]

        const result = validateTweetThread(thread);
        assert.deepEqual(result, thread)
    })

});
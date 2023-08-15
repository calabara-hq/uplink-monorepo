import test from 'node:test'
import assert from 'node:assert/strict'
import { validateContestParams, ContestBuilderProps } from "../src/utils/validateContestParams";
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

test('pass with full params', async () => {
    const contestData: ContestBuilderProps = {
        "metadata": {
            "type": "standard",
            "category": "music"
        },
        "deadlines": {
            "snapshot": "2023-08-08T04:07:45.168Z",
            "startTime": "2023-08-08T04:07:45.168Z",
            "voteTime": "2023-08-10T04:07:02.906Z",
            "endTime": "2023-08-12T04:07:02.906Z"
        },
        "prompt": {
            "title": "test",
            "body": {
                "time": 1691467634285,
                "blocks": [
                    {
                        "id": "mwpICMESDW",
                        "type": "paragraph",
                        "data": {
                            "text": "test"
                        }
                    }
                ],
                "version": "2.26.5"
            }
        },
        "submitterRewards": {
            "ETH": {
                "type": "ETH",
                "symbol": "ETH",
                "decimals": 18
            },
            "payouts": [
                {
                    "rank": 1,
                    "ETH": {
                        "amount": "1"
                    }
                }
            ]
        },
        "voterRewards": {
            "ETH": {
                "type": "ETH",
                "symbol": "ETH",
                "decimals": 18
            },
            "payouts": [
                {
                    "rank": 1,
                    "ETH": {
                        "amount": "1"
                    }
                }
            ]
        },
        "submitterRestrictions": [
            {
                "token": {
                    "type": "ETH",
                    "symbol": "ETH",
                    "decimals": 18
                },
                "threshold": "1"
            }
        ],
        "votingPolicy": [
            {
                "token": {
                    "type": "ETH",
                    "symbol": "ETH",
                    "decimals": 18
                },
                "strategy": {
                    "type": "weighted"
                }
            }
        ],
        "additionalParams": {
            "anonSubs": true,
            "visibleVotes": false,
            "selfVote": false,
            "subLimit": 0
        },
        "tweetThread": []
    }

    const result = await validateContestParams(contestData);
    assert.equal(result.success, true)


});


test('pass with empty rewards / restrictions', async () => {
    const contestData: ContestBuilderProps = {
        "metadata": {
            "type": "standard",
            "category": "music"
        },
        "deadlines": {
            "snapshot": "2023-08-08T04:07:45.168Z",
            "startTime": "2023-08-08T04:07:45.168Z",
            "voteTime": "2023-08-10T04:07:02.906Z",
            "endTime": "2023-08-12T04:07:02.906Z"
        },
        "prompt": {
            "title": "test",
            "body": {
                "time": 1691467634285,
                "blocks": [
                    {
                        "id": "mwpICMESDW",
                        "type": "paragraph",
                        "data": {
                            "text": "test"
                        }
                    }
                ],
                "version": "2.26.5"
            }
        },
        "submitterRewards": {},
        "voterRewards": {},
        "submitterRestrictions": [],
        "votingPolicy": [
            {
                "token": {
                    "type": "ETH",
                    "symbol": "ETH",
                    "decimals": 18
                },
                "strategy": {
                    "type": "weighted"
                }
            }
        ],
        "additionalParams": {
            "anonSubs": true,
            "visibleVotes": false,
            "selfVote": false,
            "subLimit": 0
        },
        "tweetThread": []
    }

    const result = await validateContestParams(contestData);
    assert.equal(result.success, true)

});

test('pass with ERC params', async () => {
    const contestData: ContestBuilderProps = {
        "metadata": {
            "type": "standard",
            "category": "music"
        },
        "deadlines": {
            "snapshot": "2023-08-08T04:07:45.168Z",
            "startTime": "2023-08-08T04:07:45.168Z",
            "voteTime": "2023-08-10T04:07:02.906Z",
            "endTime": "2023-08-12T04:07:02.906Z"
        },
        "prompt": {
            "title": "test",
            "body": {
                "time": 1691467634285,
                "blocks": [
                    {
                        "id": "mwpICMESDW",
                        "type": "paragraph",
                        "data": {
                            "text": "test"
                        }
                    }
                ],
                "version": "2.26.5"
            }
        },
        "submitterRewards": {
            ETH: sampleETHToken,
            ERC20: sampleERC20Token,
            ERC721: sampleERC721Token,
            ERC1155: sampleERC1155Token,
            payouts: [
                {
                    rank: 1,
                    ETH: {
                        amount: "1"
                    },
                    ERC20: {
                        amount: "1"
                    },
                    ERC721: {
                        tokenId: 1
                    },
                    ERC1155: {
                        amount: "1",
                    },
                },
                {
                    rank: 2,
                    ETH: {
                        amount: "2"
                    },
                    ERC20: {
                        amount: "2"
                    },
                    ERC721: {
                        tokenId: 4
                    },
                    ERC1155: {
                        amount: "2",
                    },
                }
            ]

        },
        "voterRewards": {
            ETH: sampleETHToken,
            ERC20: sampleERC20Token,

            payouts: [
                {
                    rank: 1,
                    ETH: {
                        amount: "1"
                    },
                },
                {
                    rank: 2,
                    ERC20: {
                        amount: "2"
                    },
                }
            ]
        },
        "submitterRestrictions": [
            {
                token: sampleETHToken,
                threshold: "1"
            },
            {
                token: sampleERC20Token,
                threshold: "2"
            },
            {
                token: sampleERC721Token,
                threshold: "3"
            },
            {
                token: sampleERC1155Token,
                threshold: "4"
            }
        ],
        "votingPolicy": [
            {
                token: sampleETHToken,
                strategy: {
                    type: "weighted"
                },
            },
            {
                token: sampleERC20Token,
                strategy: {
                    type: "arcade",
                    votingPower: "20"
                },
            },
        ],
        "additionalParams": {
            "anonSubs": true,
            "visibleVotes": false,
            "selfVote": false,
            "subLimit": 0
        },
        "tweetThread": []
    }

    const result = await validateContestParams(contestData);
    assert.equal(result.success, false)
});




test('fail with empty voting policy', async () => {
    const contestData: ContestBuilderProps = {
        "metadata": {
            "type": "standard",
            "category": "music"
        },
        "deadlines": {
            "snapshot": "2023-08-08T04:07:45.168Z",
            "startTime": "2023-08-08T04:07:45.168Z",
            "voteTime": "2023-08-10T04:07:02.906Z",
            "endTime": "2023-08-12T04:07:02.906Z"
        },
        "prompt": {
            "title": "test",
            "body": {
                "time": 1691467634285,
                "blocks": [
                    {
                        "id": "mwpICMESDW",
                        "type": "paragraph",
                        "data": {
                            "text": "test"
                        }
                    }
                ],
                "version": "2.26.5"
            }
        },
        "submitterRewards": {},
        "voterRewards": {},
        "submitterRestrictions": [],
        "votingPolicy": [],
        "additionalParams": {
            "anonSubs": true,
            "visibleVotes": false,
            "selfVote": false,
            "subLimit": 0
        },
        "tweetThread": []
    }

    const result = await validateContestParams(contestData);
    assert.equal(result.success, false)
    assert.deepEqual(result.errors, {
        votingPolicy: "At least one voting policy must be defined"
    })
});


test('fail with empty tweet thread', async () => {
    const contestData: ContestBuilderProps = {
        "metadata": {
            "type": "twitter",
            "category": "music"
        },
        "deadlines": {
            "snapshot": "2023-08-08T04:07:45.168Z",
            "startTime": "2023-08-08T04:07:45.168Z",
            "voteTime": "2023-08-10T04:07:02.906Z",
            "endTime": "2023-08-12T04:07:02.906Z"
        },
        "prompt": {
            "title": "test",
            "body": {
                "time": 1691467634285,
                "blocks": [
                    {
                        "id": "mwpICMESDW",
                        "type": "paragraph",
                        "data": {
                            "text": "test"
                        }
                    }
                ],
                "version": "2.26.5"
            }
        },
        "submitterRewards": {},
        "voterRewards": {},
        "submitterRestrictions": [],
        "votingPolicy": [
            {
                "token": {
                    "type": "ETH",
                    "symbol": "ETH",
                    "decimals": 18
                },
                "strategy": {
                    "type": "weighted"
                }
            }
        ],
        "additionalParams": {
            "anonSubs": true,
            "visibleVotes": false,
            "selfVote": false,
            "subLimit": 0
        },
        "tweetThread": []
    }

    const result = await validateContestParams(contestData);
    assert.equal(result.success, false)
    assert.deepEqual(result.errors, { twitter: 'Tweet thread cannot be empty' })
});

test('fail with invalid ERC params', async () => {
    const contestData: ContestBuilderProps = {
        "metadata": {
            "type": "standard",
            "category": "music"
        },
        "deadlines": {
            "snapshot": "2023-08-08T04:07:45.168Z",
            "startTime": "2023-08-08T04:07:45.168Z",
            "voteTime": "2023-08-10T04:07:02.906Z",
            "endTime": "2023-08-12T04:07:02.906Z"
        },
        "prompt": {
            "title": "test",
            "body": {
                "time": 1691467634285,
                "blocks": [
                    {
                        "id": "mwpICMESDW",
                        "type": "paragraph",
                        "data": {
                            "text": "test"
                        }
                    }
                ],
                "version": "2.26.5"
            }
        },
        "submitterRewards": {
            ETH: sampleETHToken,
            ERC20: sampleERC20Token,
            ERC721: sampleERC721Token,
            payouts: [
                {
                    rank: 1,
                    ETH: {
                        amount: "1"
                    },
                    ERC20: {
                        amount: "1"
                    },
                    ERC721: {
                        tokenId: 1
                    },
                    ERC1155: {
                        amount: "1",
                    },
                },
                {
                    rank: 2,
                    ETH: {
                        amount: "2"
                    },
                    ERC20: {
                        amount: "2"
                    },
                    ERC721: {
                        tokenId: 4
                    },
                    ERC1155: {
                        amount: "2",
                    },
                }
            ]

        },
        "voterRewards": {
            ETH: sampleETHToken,

            payouts: [
                {
                    rank: 1,
                    ETH: {
                        amount: "1"
                    },
                },
                {
                    rank: 2,
                    ERC20: {
                        amount: "2"
                    },
                }
            ]
        },
        "submitterRestrictions": [
            {
                token: sampleETHToken,
                threshold: "1"
            },
            {
                token: sampleERC20Token,
                threshold: "2"
            },
            {
                token: sampleERC721Token,
                threshold: "3"
            },
            {
                token: sampleERC1155Token,
                threshold: "3"
            },
        ],
        "votingPolicy": [
            {
                token: sampleETHToken,
                strategy: {
                    type: "weighted"
                },
            },
            {
                token: sampleERC20Token,
                strategy: {
                    type: "arcade",
                    votingPower: "20"
                },
            },
        ],
        "additionalParams": {
            "anonSubs": true,
            "visibleVotes": false,
            "selfVote": false,
            "subLimit": 0
        },
        "tweetThread": []
    }

    const result = await validateContestParams(contestData);
    console.log(result)
    assert.equal(result.success, false)
});



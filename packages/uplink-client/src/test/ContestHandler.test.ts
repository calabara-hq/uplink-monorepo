import { arraysSubtract, cleanSubmitterRewards, reducer, rewardsObjectToArray, SubmitterRewards } from "@/app/contestbuilder/contestHandler";
import { IToken } from "@/types/token";
import { describe, expect, test } from "@jest/globals";
import { sampleERC1155Token, sampleERC20Token, sampleERC721Token, sampleETHToken } from "./sampleTokens";

const initialState = {
    // ... other properties
    rewardOptions: [],
    submitterRewards: {
        payouts: [],
    },
};



describe("Submitter Rewards", () => {

    test("addSubReward ERC721", () => {
        const initialState = {
            submitterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [{ rank: 1 }],
            },
        };
        const action = { type: "addSubmitterReward", payload: { token: sampleERC721Token } };
        const expectedState = {
            submitterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: sampleERC721Token,
                payouts: [{ rank: 1, ERC721: { tokenId: null } }],
            },
        };
        let result = reducer(initialState, action);
        expect(reducer(initialState, action)).toEqual(expectedState);
    });

    test("addSubReward ERC20", () => {
        const initialState = {
            submitterRewards: {
                ETH: sampleETHToken,
                ERC721: sampleERC721Token,
                ERC1155: sampleERC1155Token,
                payouts: [{ rank: 1 }],
            },
        };
        const action = { type: "addSubmitterReward", payload: { token: sampleERC20Token } };
        const expectedState = {
            submitterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: sampleERC721Token,
                ERC1155: sampleERC1155Token,
                payouts: [{ rank: 1, ERC20: { amount: "0" } }],
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });

    test("swapSubmitterReward ERC20", () => {
        const initialState = {
            submitterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: sampleERC721Token,
                ERC1155: sampleERC1155Token,
                payouts: [{ rank: 1, ERC20: { amount: "100" } }],
            },
        };

        const newERC20Token = {
            type: "ERC20",
            address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            symbol: "USDT",
            decimals: 18,
        }
        const action = { type: "addSubmitterReward", payload: { token: newERC20Token } };
        const expectedState = {
            submitterRewards: {
                ETH: sampleETHToken,
                ERC20: newERC20Token,
                ERC721: sampleERC721Token,
                ERC1155: sampleERC1155Token,
                payouts: [{ rank: 1, ERC20: { amount: "100" } }],
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });

    test("swapSubmitterReward ERC721", () => {
        const initialState = {
            submitterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: sampleERC721Token,
                ERC1155: sampleERC1155Token,
                payouts: [{ rank: 1, ERC721: { tokenId: 1 } }],
            },
        };

        const newERC721Token = {
            type: "ERC721",
            address: "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d",
            symbol: "CHAD",
            decimals: 0,
        }
        const action = { type: "addSubmitterReward", payload: { token: newERC721Token } };
        const expectedState = {
            submitterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: newERC721Token,
                ERC1155: sampleERC1155Token,
                payouts: [{ rank: 1, ERC721: { tokenId: 1 } }],
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });


    test("removeSubmitterReward", () => {
        const initialState = {
            submitterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: sampleERC721Token,
                ERC1155: sampleERC1155Token,
                payouts: [{ rank: 1, ERC20: { amount: "100" }, ERC721: { tokenId: "1" } }],
            },
        };

        const action = { type: "removeSubmitterReward", payload: { token: sampleERC20Token } };
        const expectedState = {
            submitterRewards: {
                ETH: sampleETHToken,
                ERC721: sampleERC721Token,
                ERC1155: sampleERC1155Token,
                payouts: [{ rank: 1, ERC721: { tokenId: "1" } }],
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);

    });



    test("addSubRank", () => {
        const action = { type: "addSubRank" };
        const newState = reducer(initialState, action);
        expect(newState.submitterRewards.payouts).toHaveLength(1);
        expect(newState.submitterRewards.payouts[0].rank).toBe(1);
    });

    test("removeSubRank", () => {
        const initialRemoveState = {
            // ... other properties
            rewardOptions: [],
            submitterRewards: {
                payouts: [
                    {
                        rank: 1,
                    },
                ],
            },
        };

        const action = { type: "removeSubRank", payload: 0 };
        const newState = reducer(initialRemoveState, action);
        expect(newState.submitterRewards.payouts).toHaveLength(0);
    });

    test("updateSubRank", () => {
        const initialState = {
            submitterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: sampleERC721Token,
                ERC1155: sampleERC1155Token,
                payouts: [{ rank: 1, ERC20: { amount: "100" } }],
            },
        };

        const action = { type: "updateSubRank", payload: { index: 0, rank: 2 } };
        const expectedState = {
            submitterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: sampleERC721Token,
                ERC1155: sampleERC1155Token,
                payouts: [{ rank: 2, ERC20: { amount: "100" } }],
            },
        };

        expect(reducer(initialState, action)).toEqual(expectedState);
    });

    test("updateSubRewardAmount ERC20", () => {
        const initialState = {
            submitterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: sampleERC721Token,
                ERC1155: sampleERC1155Token,
                payouts: [{ rank: 1, ERC20: { amount: "100" } }],
            },
        };
        const action = { type: "updateSubRewardAmount", payload: { index: 0, tokenType: "ERC20", amount: "200" } };
        const expectedState = {
            submitterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: sampleERC721Token,
                ERC1155: sampleERC1155Token,
                payouts: [{ rank: 1, ERC20: { amount: "200" } }],
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });
    test("updateERC721TokenId", () => {
        const initialState = {
            submitterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: sampleERC721Token,
                ERC1155: sampleERC1155Token,
                payouts: [{ rank: 1, ERC721: { tokenId: 1 } }],
            },
        };
        const action = { type: "updateERC721TokenId", payload: { index: 0, tokenId: 2 } };
        const expectedState = {
            submitterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                ERC721: sampleERC721Token,
                ERC1155: sampleERC1155Token,
                payouts: [{ rank: 1, ERC721: { tokenId: 2 } }],
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });

})

describe("Voter Rewards", () => {
    test("addVoterReward", () => {
        const initialState = {
            voterRewards: {
                ERC20: sampleERC20Token,
                payouts: [{ rank: 1, ERC20: { amount: "100" } }],
            },
        };
        const action = { type: "addVoterReward", payload: { token: sampleETHToken } };
        const expectedState = {
            voterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [{ rank: 1, ERC20: { amount: "100" }, ETH: { amount: "0" } }],
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });

    test("addVoterReward", () => {
        const initialState = {
            voterRewards: {
                ERC20: sampleERC20Token,
                payouts: [{ rank: 1, ERC20: { amount: "100" } }],
            },
        };
        const newERC20Token = {
            type: "ERC20",
            address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            symbol: "USDT",
            decimals: 18,
        }
        const action = { type: "addVoterReward", payload: { token: newERC20Token } };
        const expectedState = {
            voterRewards: {
                ERC20: newERC20Token,
                payouts: [{ rank: 1, ERC20: { amount: "100" } }],
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });
});



/*
test("should remove an ERC20 token from submitter rewards", () => {
    const initialState = {
        submitterRewards: {
            ETH: sampleETHToken,
            ERC20: sampleERC20Token,
            ERC721: sampleERC721Token,
            ERC1155: sampleERC1155Token,
            payouts: [{ rank: 1, ERC20: { amount: "0" } }],
        },
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [],
        errors: {},
    };
    const action = { type: "removeERC20Token", payload: { index: 0 } };
    const expectedState = {
        submitterRewards: {
            ETH: sampleETHToken,
            ERC721: sampleERC721Token,
            ERC1155: sampleERC1155Token,
            payouts: [{ rank: 1 }],
        },
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [],
        errors: {},
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
});

test("should remove an ERC721 token from submitter rewards", () => {
    const initialState = {
        submitterRewards: {
            ETH: sampleETHToken,
            ERC20: sampleERC20Token,
            ERC721: sampleERC721Token,
            ERC1155: sampleERC1155Token,
            payouts: [{ rank: 1, ERC721: { tokenId: 1 } }],
        },
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [],
        errors: {},
    };
    const action = { type: "removeERC721Token", payload: { index: 0 } };
    const expectedState = {
        submitterRewards: {
            ETH: sampleETHToken,
            ERC20: sampleERC20Token,
            ERC1155: sampleERC1155Token,
            payouts: [{ rank: 1 }],
        },
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [],
        errors: {},
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
});

test("should update the amount of an existing ERC1155 token in submitter rewards", () => {
    const initialState = {
        submitterRewards: {
            ETH: sampleETHToken,
            ERC20: sampleERC20Token,
            ERC721: sampleERC721Token,
            ERC1155: sampleERC1155Token,
            payouts: [{ rank: 1, ERC1155: { amount: "10" } }],
        },
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [],
        errors: {},
    };
    const action = { type: "updateERC1155Amount", payload: { index: 0, amount: "20" } };
    const expectedState = {
        submitterRewards: {
            ETH: sampleETHToken,
            ERC20: sampleERC20Token,
            ERC721: sampleERC721Token,
            ERC1155: sampleERC1155Token,
            payouts: [{ rank: 1, ERC1155: { amount: "20" } }],
        },
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [],
        errors: {},
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
});

test("should update the rank of an existing payout in submitter rewards", () => {
    const initialState = {
        submitterRewards: {
            ETH: sampleETHToken,
            ERC20: sampleERC20Token,
            ERC721: sampleERC721Token,
            ERC1155: sampleERC1155Token,
            payouts: [
                { rank: 1, ETH: { amount: "100" } },
                { rank: 2, ERC20: { amount: "50" } },
                { rank: 3, ERC721: { tokenId: 1 } },
            ],
        },
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [],
        errors: {},
    };
    const action = { type: "updatePayoutRank", payload: { oldRank: 2, newRank: 1 } };
    const expectedState = {
        submitterRewards: {
            ETH: sampleETHToken,
            ERC20: sampleERC20Token,
            ERC721: sampleERC721Token,
            ERC1155: sampleERC1155Token,
            payouts: [
                { rank: 1, ETH: { amount: "100" }, ERC20: { amount: "50" } },
                { rank: 2, ERC721: { tokenId: 1 } },
            ],
        },
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [],
        errors: {},
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
});


test("should remove a payout from submitter rewards", () => {
    const initialState = {
        submitterRewards: {
            ETH: sampleETHToken,
            ERC20: sampleERC20Token,
            ERC721: sampleERC721Token,
            ERC1155: sampleERC1155Token,
            payouts: [
                { rank: 1, ETH: { amount: "100" } },
                { rank: 2, ERC20: { amount: "50" } },
                { rank: 3, ERC721: { tokenId: 1 } },
            ],
        },
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [],
        errors: {},
    };
    const action = { type: "removePayout", payload: { rank: 2 } };
    const expectedState = {
        submitterRewards: {
            ETH: sampleETHToken,
            ERC20: sampleERC20Token,
            ERC721: sampleERC721Token,
            ERC1155: sampleERC1155Token,
            payouts: [
                { rank: 1, ETH: { amount: "100" } },
                { rank: 2, ERC721: { tokenId: 1 } },
            ],
        },
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [],
        errors: {},
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
});

test("should update the amount of an existing token in voter rewards", () => {
    const initialState = {
        submitterRewards: null,
        voterRewards: {
            ETH: sampleETHToken,
            ERC20: sampleERC20Token,
            ERC721: sampleERC721Token,
            ERC1155: sampleERC1155Token,
        },
        submitterRestrictions: [],
        votingPolicy: [],
        errors: {},
    };
    const action = { type: "updateVoterTokenAmount", payload: { index: 0, amount: "200" } };
    const expectedState = {
        submitterRewards: null,
        voterRewards: {
            ETH: sampleETHToken,
            ERC20: sampleERC20Token,
            ERC721: sampleERC721Token,
            ERC1155: sampleERC1155Token,
        },
        submitterRestrictions: [],
        votingPolicy: [],
        errors: {},
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
});

test("should add a new submitter restriction", () => {
    const initialState = {
        submitterRewards: null,
        voterRewards: null,
        submitterRestrictions: [{ type: "country", value: "US" }],
        votingPolicy: [],
        errors: {},
    };
    const action = { type: "addSubmitterRestriction", payload: { type: "age", value: "18" } };
    const expectedState = {
        submitterRewards: null,
        voterRewards: null,
        submitterRestrictions: [
            { type: "country", value: "US" },
            { type: "age", value: "18" },
        ],
        votingPolicy: [],
        errors: {},
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
});

test("should remove a submitter restriction", () => {
    const initialState = {
        submitterRewards: null,
        voterRewards: null,
        submitterRestrictions: [
            { type: "country", value: "US" },
            { type: "age", value: "18" },
        ],
        votingPolicy: [],
        errors: {},
    };
    const action = { type: "removeSubmitterRestriction", payload: { index: 0 } };
    const expectedState = {
        submitterRewards: null,
        voterRewards: null,
        submitterRestrictions: [{ type: "age", value: "18" }],
        votingPolicy: [],
        errors: {},
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
});

test("should add a new voting policy", () => {
    const initialState = {
        submitterRewards: null,
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [{ type: "approval" }],
        errors: {},
    };
    const action = { type: "addVotingPolicy", payload: { type: "threshold", value: "50" } };
    const expectedState = {
        submitterRewards: null,
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [
            { type: "approval" },
            { type: "threshold", value: "50" },
        ],
        errors: {},
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
});

test("should remove a voting policy", () => {
    const initialState = {
        submitterRewards: null,
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [
            { type: "approval" },
            { type: "threshold", value: "50" },
        ],
        errors: {},
    };
    const action = { type: "removeVotingPolicy", payload: { index: 0 } };
    const expectedState = {
        submitterRewards: null,
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [{ type: "threshold", value: "50" }],
        errors: {},
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
});

test("should set errors", () => {
    const initialState = {
        submitterRewards: null,
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [],
        errors: {},
    };
    const action = { type: "setErrors", payload: { submitterRewards: "Invalid rewards" } };
    const expectedState = {
        submitterRewards: null,
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [],
        errors: { submitterRewards: "Invalid rewards" },
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
});

test("should clear errors", () => {
    const initialState = {
        submitterRewards: null,
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [],
        errors: { submitterRewards: "Invalid rewards" },
    };
    const action = { type: "clearErrors" };
    const expectedState = {
        submitterRewards: null,
        voterRewards: null,
        submitterRestrictions: [],
        votingPolicy: [],
        errors: {},
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
});
*/






describe("Helper functions", () => {


    test("cleanSubRewards", () => {
        const dirtyRewards: SubmitterRewards = {
            // ... other properties
            ETH: sampleETHToken,

            ERC20: sampleERC20Token,
            payouts: [
                {
                    rank: 1,
                    ETH: { amount: '1' },
                    ERC20: { amount: '0' }
                },
            ],
        };

        const cleanRewards = {
            // ... other properties
            ETH: sampleETHToken,
            ERC20: sampleERC20Token,
            payouts: [
                {
                    rank: 1,
                    ETH: { amount: '1' },
                },
            ],
        };

        const newState = cleanSubmitterRewards(dirtyRewards);
        expect(newState).toEqual(cleanRewards);
    })


    test("rewardsObjectToArray", () => {
        const rewards: SubmitterRewards = {
            ETH: sampleETHToken,
            ERC20: sampleERC20Token,
            payouts: [
                {
                    rank: 1,
                    ETH: { amount: '1' },
                    ERC20: { amount: '0' }
                },
            ],
        };

        const result = rewardsObjectToArray(rewards)
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual(sampleETHToken);
        expect(result[1]).toEqual(sampleERC20Token);
    });

    test("rewardsObjectToArray strict types", () => {
        const rewards: SubmitterRewards = {
            ETH: sampleETHToken,
            ERC20: sampleERC20Token,
            ERC721: sampleERC721Token,
            payouts: [
                {
                    rank: 1,
                    ETH: { amount: '1' },
                    ERC20: { amount: '0' }
                },
            ],
        };

        const result = rewardsObjectToArray(rewards, ["ETH", "ERC20"])
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual(sampleETHToken);
        expect(result[1]).toEqual(sampleERC20Token);
    });


    test("arraysSubtract #1", () => {
        const arr1: IToken[] = [
            sampleETHToken,
            sampleERC20Token,
            sampleERC721Token
        ]

        const arr2: IToken[] = [
            sampleETHToken,
            sampleERC20Token,
        ]

        const result = arraysSubtract(arr1, arr2);
        expect(result).toEqual(
            [sampleERC721Token]
        );

    });

    test("arraysSubtract #2", () => {
        const arr1: IToken[] = [
            sampleETHToken,
            sampleERC20Token,

        ]

        const arr2: IToken[] = [
            sampleETHToken,
            sampleERC20Token,
            sampleERC721Token
        ]

        const result = arraysSubtract(arr1, arr2);
        expect(result).toHaveLength(0);

    });

    test("arraysSubtract #3", () => {
        const arr1: IToken[] = [
            sampleETHToken,
            sampleERC20Token,
            sampleERC721Token
        ]

        const arr2: IToken[] = [
            sampleETHToken,
        ]

        const result = arraysSubtract(arr1, arr2, ["ETH", "ERC20"]);
        expect(result).toEqual(
            [sampleERC20Token,]
        );

    });
});
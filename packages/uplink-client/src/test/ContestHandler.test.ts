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
                payouts: [{ rank: 1, ERC20: { amount: "" } }],
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
                payouts: [{ rank: 1, ERC20: { amount: "100" }, ERC721: { tokenId: "1" } }],
            },
        };

        const action = { type: "removeSubmitterReward", payload: { token: sampleERC20Token } };
        const expectedState = {
            submitterRewards: {
                ETH: sampleETHToken,
                ERC721: sampleERC721Token,
                payouts: [{ rank: 1, ERC721: { tokenId: "1" } }],
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);

    });

    test("removeSubmitterReward should unset fields on single initial token", () => {
        const initialState = {
            submitterRewards: {
                ERC20: sampleERC20Token,
                payouts: [{ rank: 1, ERC20: { amount: "100" } }],
            },
        };

        const action = { type: "removeSubmitterReward", payload: { token: sampleERC20Token } };
        const expectedState = {
            submitterRewards: {},
        };
        //console.log(JSON.stringify(reducer(initialState, action), null, 2));
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
    test("addVoterReward ETH", () => {
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

    test("addVoterReward ERC20", () => {
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

    test("removeVoterReward", () => {
        const initialState = {
            voterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [{ rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } }],
            },
        };

        const action = { type: "removeVoterReward", payload: { token: sampleERC20Token } };
        const expectedState = {
            voterRewards: {
                ETH: sampleETHToken,
                payouts: [{ rank: 1, ETH: { amount: "10" } }],
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);

    });

    test("addVoterRank", () => {
        const initialState = {
            voterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [{ rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } }],
            },
        };

        const action = { type: "addVoterRank" };
        const expectedState = {
            voterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [
                    { rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } },
                    { rank: 2, ERC20: { amount: "0" }, ETH: { amount: "0" } },
                ],
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });

    test("removeVoterRank", () => {
        const initialState = {
            voterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [
                    { rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } },
                    { rank: 2, ERC20: { amount: "0" }, ETH: { amount: "0" } },
                ],
            },
        };
        const action = { type: "removeVoterRank", payload: 0 };
        const expectedState = {
            voterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [{ rank: 2, ERC20: { amount: "0" }, ETH: { amount: "0" } }],
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });

    test("updateVoterRank", () => {
        const initialState = {
            voterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [{ rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } }],
            },
        };
        const action = { type: "updateVoterRank", payload: { index: 0, rank: 2 } };
        const expectedState = {
            voterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [{ rank: 2, ERC20: { amount: "100" }, ETH: { amount: "10" } }],
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });

    test("updateVoterRewardAmount", () => {
        const initialState = {
            voterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [{ rank: 1, ERC20: { amount: "100" }, ETH: { amount: "10" } }],
            },
        };
        const action = { type: "updateVoterRewardAmount", payload: { index: 0, tokenType: "ERC20", amount: "200" } };
        const expectedState = {
            voterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [{ rank: 1, ERC20: { amount: "200" }, ETH: { amount: "10" } }],
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });

    test("updateVoterRewardType change type", () => {
        const initialState = {
            voterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [{ rank: 1, ERC20: { amount: "10" } }],
            },
        };
        const action = { type: "updateVoterRewardType", payload: { index: 0, oldTokenType: "ERC20", newTokenType: "ETH" } };
        const expectedState = {
            voterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [{ rank: 1, ETH: { amount: "10" } }],
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });

    test("updateVoterRewardType same type", () => {
        const initialState = {
            voterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [{ rank: 1, ERC20: { amount: "10" } }],
            },
        };
        const action = { type: "updateVoterRewardType", payload: { index: 0, oldTokenType: "ERC20", newTokenType: "ERC20" } };
        const expectedState = {
            voterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [{ rank: 1, ERC20: { amount: "10" } }],
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });

    test("updateVoterRewardType no initial payouts", () => {
        const initialState = {
            voterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [{ rank: 1 }],
            },
        };
        const action = { type: "updateVoterRewardType", payload: { index: 0, oldTokenType: "ETH", newTokenType: "ERC20" } };
        const expectedState = {
            voterRewards: {
                ETH: sampleETHToken,
                ERC20: sampleERC20Token,
                payouts: [{ rank: 1, ERC20: { amount: "0" } }],
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });

});

describe("Submitter Restrictions", () => {
    test("addSubmitterRestriction", () => {
        const initialState = {
            submitterRestrictions: [],
        };
        const action = { type: "addSubmitterRestriction", payload: { token: sampleETHToken, threshold: "1" } };
        const expectedState = {
            submitterRestrictions: [{
                token: sampleETHToken,
                threshold: "1",
            }],
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });

    test("removeSubmitterRestriction", () => {
        const initialState = {
            submitterRestrictions: [{ ...sampleETHToken }],
        };
        const action = { type: "removeSubmitterRestriction", payload: 0 };
        const expectedState = {
            submitterRestrictions: [],
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    })

    test("updateSubmitterRestriction", () => {
        const initialState = {
            submitterRestrictions: [{ token: sampleETHToken, threshold: "1" }],
        };
        const action = { type: "updateSubmitterRestriction", payload: { index: 0, restriction: { token: sampleETHToken, threshold: "5" } } };
        const expectedState = {
            submitterRestrictions: [{ token: sampleETHToken, threshold: "5" }],
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    })

});

describe("Voting Policy", () => {

    test("addVotingPolicy", () => {
        const initialState = {
            votingPolicy: [],
        };
        const action = {
            type: "addVotingPolicy", payload: {
                policy: {
                    token: sampleETHToken,
                    strategy: {
                        type: "arcade",
                        votingPower: "100",
                    }
                }
            }
        };
        const expectedState = {
            votingPolicy: [{
                token: sampleETHToken,
                strategy: {
                    type: "arcade",
                    votingPower: "100",
                }
            }],
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });

    test("removeVotingPolicy", () => {
        const initialState = {
            votingPolicy: [{
                token: sampleETHToken,
                strategy: {
                    type: "arcade",
                    votingPower: "100",
                }
            }],
        };
        const action = { type: "removeVotingPolicy", payload: 0 };
        const expectedState = {
            votingPolicy: [],
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    })


    test("updateVotingPolicy", () => {
        const initialState = {
            votingPolicy: [{
                token: sampleETHToken,
                strategy: {
                    type: "arcade",
                    votingPower: "100",
                }
            }],
        };
        const action = {
            type: "updateVotingPolicy", payload: {
                index: 0,
                policy: {
                    token: sampleERC20Token,
                    strategy: {
                        type: "weighted",
                        votingPower: "600",
                    }
                }
            }
        };
        const expectedState = {
            votingPolicy: [{
                token: sampleERC20Token,
                strategy: {
                    type: "weighted",
                    votingPower: "600",
                }
            }],
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });


});



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
import { arraysSubtract, cleanSubmitterRewards, reducer, rewardsObjectToArray, SubmitterRewards } from "@/app/contestbuilder/contestHandler";
import { IToken } from "@/types/token";
import { describe, expect, test } from "@jest/globals";

const initialState = {
    // ... other properties
    rewardOptions: [],
    submitterRewards: {
        payouts: [],
    },
};

const sampleToken: IToken = {
    type: "ERC20",
    symbol: "ST",
    decimals: 18,
    address: "0x1234567890123456789012345678901234567890",
};

describe("Contest Builder Reducer", () => {
    /*
    test("addRewardOption", () => {
        const action = {
            type: "addRewardOption",
            payload: { ...sampleToken, selected: false },
        };
        const newState = reducer(initialState, action);
        expect(newState.rewardOptions).toHaveLength(1);
        expect(newState.rewardOptions[0]).toEqual({ ...sampleToken, selected: false });
    });
    */


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

    test("cleanSubRewards", () => {
        const dirtyRewards: SubmitterRewards = {
            // ... other properties
            ETH: {
                type: "ETH",
                symbol: "ETH",
                decimals: 18,
            },

            ERC20: {
                type: "ERC20",
                address: "0x0",
                symbol: "USDC",
                decimals: 18,
            },
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
            ETH: {
                type: "ETH",
                symbol: "ETH",
                decimals: 18,
            },
            ERC20: {
                type: "ERC20",
                address: "0x0",
                symbol: "USDC",
                decimals: 18,
            },
            payouts: [
                {
                    rank: 1,
                    ETH: { amount: '1' },
                },
            ],
        };

        const action = { type: "cleanSubRewards" };
        const newState = cleanSubmitterRewards(dirtyRewards);
        expect(newState).toEqual(cleanRewards);
    })


    test("rewardsObjectToArray", () => {
        const rewards: SubmitterRewards = {
            ETH: {
                type: "ETH",
                symbol: "ETH",
                decimals: 18,
            },
            ERC20: {
                type: "ERC20",
                address: "0x0",
                symbol: "USDC",
                decimals: 18,
            },
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
        expect(result[0]).toEqual({
            type: "ETH",
            symbol: "ETH",
            decimals: 18,
        });
        expect(result[1]).toEqual({
            type: "ERC20",
            address: "0x0",
            symbol: "USDC",
            decimals: 18,
        });
    });

    test("rewardsObjectToArray strict types", () => {
        const rewards: SubmitterRewards = {
            ETH: {
                type: "ETH",
                symbol: "ETH",
                decimals: 18,
            },
            ERC20: {
                type: "ERC20",
                address: "0x0",
                symbol: "USDC",
                decimals: 18,
            },
            ERC721: {
                type: "ERC721",
                address: "0x0",
                symbol: "NOUN",
                decimals: 0,
            },
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
        expect(result[0]).toEqual({
            type: "ETH",
            symbol: "ETH",
            decimals: 18,
        });
        expect(result[1]).toEqual({
            type: "ERC20",
            address: "0x0",
            symbol: "USDC",
            decimals: 18,
        });
    });


    test("arraysSubtract #1", () => {
        const arr1: IToken[] = [
            {
                "type": "ETH",
                "symbol": "ETH",
                "decimals": 18
            },
            {
                "type": "ERC20",
                "address": "0x0",
                "symbol": "USDC",
                "decimals": 18
            },
            {
                "type": "ERC721",
                "address": "0x0",
                "symbol": "NOUN",
                "decimals": 0
            }
        ]

        const arr2: IToken[] = [
            {
                "type": "ETH",
                "symbol": "ETH",
                "decimals": 18
            },
            {
                "type": "ERC20",
                "address": "0x0",
                "symbol": "USDC",
                "decimals": 18
            },
        ]

        const result = arraysSubtract(arr1, arr2);
        expect(result).toEqual(
            [{
                "type": "ERC721",
                "address": "0x0",
                "symbol": "NOUN",
                "decimals": 0
            }]
        );

    });

    test("arraysSubtract #2", () => {
        const arr1: IToken[] = [
            {
                "type": "ETH",
                "symbol": "ETH",
                "decimals": 18
            },
            {
                "type": "ERC20",
                "address": "0x0",
                "symbol": "USDC",
                "decimals": 18
            },

        ]

        const arr2: IToken[] = [
            {
                "type": "ETH",
                "symbol": "ETH",
                "decimals": 18
            },
            {
                "type": "ERC20",
                "address": "0x0",
                "symbol": "USDC",
                "decimals": 18
            },
            {
                "type": "ERC721",
                "address": "0x0",
                "symbol": "NOUN",
                "decimals": 0
            }
        ]

        const result = arraysSubtract(arr1, arr2);
        expect(result).toHaveLength(0);

    });

    test("arraysSubtract #3", () => {
        const arr1: IToken[] = [
            {
                "type": "ETH",
                "symbol": "ETH",
                "decimals": 18
            },
            {
                "type": "ERC20",
                "address": "0x0",
                "symbol": "USDC",
                "decimals": 18
            },
            {
                "type": "ERC721",
                "address": "0x0",
                "symbol": "NOUN",
                "decimals": 0
            }
        ]

        const arr2: IToken[] = [
            {
                "type": "ETH",
                "symbol": "ETH",
                "decimals": 18
            },
        ]

        const result = arraysSubtract(arr1, arr2, ["ETH", "ERC20"]);
        expect(result).toEqual(
            [{
                "type": "ERC20",
                "address": "0x0",
                "symbol": "USDC",
                "decimals": 18
            },]
        );

    });
});
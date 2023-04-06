import { cleanSubmitterRewards, reducer, SubmitterRewards } from "@/app/contestbuilder/contestHandler";
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
    test("addRewardOption", () => {
        const action = {
            type: "addRewardOption",
            payload: { ...sampleToken, selected: false },
        };
        const newState = reducer(initialState, action);
        expect(newState.rewardOptions).toHaveLength(1);
        expect(newState.rewardOptions[0]).toEqual({ ...sampleToken, selected: false });
    });

    test("swapRewardOption", () => {
        const initialSwappedState = {
            // ... other properties
            rewardOptions: [{ ...sampleToken, selected: false }],
            submitterRewards: { payouts: [] },
        };

        const swappedToken: IToken = {
            ...sampleToken,
            symbol: "SWT",
        };

        const action = {
            type: "swapRewardOption",
            payload: swappedToken,
        };
        const newState = reducer(initialSwappedState, action);
        expect(newState.rewardOptions).toHaveLength(1);
        expect(newState.rewardOptions[0]).toEqual(swappedToken);
    });

    test("toggleRewardOption", () => {
        const initialToggledState = {
            // ... other properties
            rewardOptions: [{ ...sampleToken }],
            submitterRewards: { payouts: [] },
        };


        const action = {
            type: "toggleRewardOption",
            payload: { token: sampleToken, selected: true },
        };

        const newState = reducer(initialToggledState, action);
        expect(newState.rewardOptions).toHaveLength(1);
        //expect(newState.rewardOptions[0].selected).toBe(true);
        expect(newState.submitterRewards.ERC20).toEqual(sampleToken);
    });

    test("toggleRewardOption", () => {
        const initialToggledState = {
            // ... other properties
            rewardOptions: [{ ...sampleToken }],
            submitterRewards: { payouts: [] },
        };


        const action = {
            type: "toggleRewardOption",
            payload: { token: sampleToken, selected: false },
        };

        const newState = reducer(initialToggledState, action);
        expect(newState.rewardOptions).toHaveLength(1);
        //expect(newState.rewardOptions[0].selected).toBe(false);
        expect(newState.submitterRewards.ERC20).toBeUndefined();
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

    test("cleanSubRewards", () => {
        const dirtyRewards: SubmitterRewards = {
            // ... other properties
            ETH: {
                type: "ETH",
                symbol: "ETH",
                decimals: 18,
            },
            //ERC1155: undefined,

            ERC20: {
                type: "ERC20",
                address: "0x0",
                symbol: "USDC",
                decimals: 18,
            },

            //ERC721: undefined,
            payouts: [
                {
                    rank: 1,
                    ETH: { amount: 1 },
                    ERC20: { amount: 0 }
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
                    ETH: { amount: 1 },
                },
            ],
        };

        const action = { type: "cleanSubRewards" };
        const newState = cleanSubmitterRewards(dirtyRewards);
        console.log(JSON.stringify(newState, null, 2))
        expect(newState).toEqual(cleanRewards);
    })

    // ... other test cases for other actions
});

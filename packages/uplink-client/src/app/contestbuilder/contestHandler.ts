import { IToken, IERCToken, INativeToken } from "@/types/token";

export interface SubmitterRewards {
    ETH?: IToken;
    ERC20?: IToken;
    ERC721?: IToken;
    ERC1155?: IToken;
    payouts: [
        {
            rank: number;
            ETH?: {
                amount: string;
            };
            ERC20?: {
                amount: string;
            };
            ERC721?: {
                tokenId: number | null;
            }
            ERC1155?: {
                amount: string;
            };
        }
    ]
}

export interface VoterRewards {
    ETH?: IToken;
    ERC20?: IToken;
    payouts: [
        {
            rank: number;
            ETH?: {
                amount: string;
            };
            ERC20?: {
                amount: string;
            };
        }
    ]
};

export type SubmitterRestriction = IToken & {
    threshold: string;
}

export interface ContestBuilderProps {
    type: string | null;
    startTime: string;
    voteTime: string;
    endTime: string;
    contestPromptTitle: string;
    contestPromptBody: string;
    media_blob: string | null;
    media_url: string | null;
    spaceTokens: IToken[];
    submitterRewards: SubmitterRewards;
    voterRewards: VoterRewards;
    submitterRestrictions: SubmitterRestriction[] | [];
    errors: ContestBuilderErrors;
}

export type ContestBuilderErrors = {
    type: string | null;
    startTime: string | null;
    voteTime: string | null;
    endTime: string | null;
    contestPromptTitle: string | null;
    contestPromptBody: string | null;
    media_url: string | null;

}

export const reducer = (state: any, action: any) => {
    switch (action.type) {

        case "setType":
            return {
                ...state,
                type: action.payload,
                errors: { ...state.errors, type: null },
            };
        case "setStartTime":
            return {
                ...state,
                startTime: action.payload,
                errors: { ...state.errors, startTime: null },
            };
        case "setVoteTime":
            return {
                ...state,
                voteTime: action.payload,
                errors: { ...state.errors, voteTime: null },
            };
        case "setEndTime":
            return {
                ...state,
                endTime: action.payload,
                errors: { ...state.errors, endTime: null },
            };
        case "setContestPromptTitle":
            return {
                ...state,
                contestPromptTitle: action.payload,
                errors: { ...state.errors, contestPromptTitle: null },
            };
        case "setContestPromptBody":
            return {
                ...state,
                contestPromptBody: action.payload,
                errors: { ...state.errors, contestPromptBody: null },
            };
        case "setMediaBlob":
            return {
                ...state,
                media_blob: action.payload,
                errors: { ...state.errors, media_blob: null },
            };
        case "setMediaUrl":
            return {
                ...state,
                media_url: action.payload,
                errors: { ...state.errors, media_url: null },
            };

        case "addRewardOption":
            return {
                ...state,
                rewardOptions: [...state.rewardOptions, action.payload],
            };

        /*
    case "swapRewardOption": {
        // swap the reward with same type as payload
        return {
            ...state,
            rewardOptions: state.rewardOptions.map((reward: IToken) => {
                if (reward.type === action.payload.type) {
                    return action.payload;
                }
                return reward;
            }),
        };
    }
    */

        case "addSubmitterReward": {
            const { [action.payload.token.type]: _, ...updatedSubmitterRewards } = state.submitterRewards;
            console.log(action.payload.token)
            return {
                ...state,
                submitterRewards: {
                    // keep the existing rewards - the one we plucked
                    ...updatedSubmitterRewards,
                    // add the new reward if selected
                    [action.payload.token.type]: action.payload.token,


                    // add the type to each payout
                    payouts: state.submitterRewards.payouts.map((payout: any) => {
                        return {
                            ...payout,
                            [action.payload.token.type]: (action.payload.token.type === 'ERC721' ? { tokenId: null } : { amount: "0" }),
                        };
                    }),
                }
            }
        };

        case "swapSubmitterReward": {
            // swap the reward with same type as payload
            return {
                ...state,
                submitterRewards: {
                    ...state.submitterRewards,
                    [action.payload.token.type]: action.payload.token,
                }
            };
        }

        case "removeSubmitterReward": {
            const { [action.payload.token.type]: _, ...updatedSubmitterRewards } = state.submitterRewards;

            const updatedPayouts = [];
            for (let i = 0; i < state.submitterRewards.payouts.length; i++) {
                const payout = state.submitterRewards.payouts[i];
                const { [action.payload.token.type]: _, ...updatedPayout } = payout;
                if (Object.keys(updatedPayout).length > 0) {
                    updatedPayouts.push(updatedPayout);
                }
            }

            return {
                ...state,
                submitterRewards: {
                    ...updatedSubmitterRewards,
                    payouts: updatedPayouts
                }
            };
        }

        case "addVoterReward": {
            const { [action.payload.token.type]: _, ...updatedVoterRewards } = state.voterRewards;
            console.log(action.payload.token)
            return {
                ...state,
                voterRewards: {
                    // keep the existing rewards - the one we plucked
                    ...updatedVoterRewards,
                    [action.payload.token.type]: action.payload.token,


                    // add the type to each payout
                    payouts: state.voterRewards.payouts.map((payout: any) => {
                        return {
                            ...payout,
                            [action.payload.token.type]: { amount: "0" },
                        };
                    }),
                }
            }
        };

        case "swapVoterReward": {
            // swap the reward with same type as payload
            return {
                ...state,
                voterRewards: {
                    ...state.voterRewards,
                    [action.payload.token.type]: action.payload.token,
                }
            };
        }

        case "toggleRewardOption": {
            // pluck the selected reward from the state
            const { [action.payload.token.type]: _, ...updatedSubmitterRewards } = state.submitterRewards;

            return {
                ...state,
                submitterRewards: {
                    // keep the existing rewards - the one we plucked
                    ...updatedSubmitterRewards,
                    // add the new reward if selected
                    ...(action.payload.selected ? { [action.payload.token.type]: action.payload.token } : {}),

                    // add the type to each payout
                    payouts: state.submitterRewards.payouts.map((payout: any) => {
                        return {
                            ...payout,
                            [action.payload.token.type]: action.payload.selected ? (action.payload.token.type === 'ERC721' ? { tokenId: null } : { amount: "0" }) : undefined,
                        };
                    }),

                }
            };
        }

        case "addSubRank": {
            return {
                ...state,
                submitterRewards: {
                    ...state.submitterRewards,
                    payouts: [
                        ...state.submitterRewards.payouts,
                        {
                            rank: state.submitterRewards.payouts.length + 1,
                            ...(state.submitterRewards.ETH ? { ETH: { amount: "0" } } : {}),
                            ...(state.submitterRewards.ERC20 ? { ERC20: { amount: "0" } } : {}),
                            ...(state.submitterRewards.ERC721 ? { ERC721: { tokenId: null } } : {}),
                            ...(state.submitterRewards.ERC1155 ? { ERC1155: { amount: "0" } } : {}),

                        },
                    ],
                },
            };
        }

        case "removeSubRank": {
            return {
                ...state,
                submitterRewards: {
                    ...state.submitterRewards,
                    payouts: state.submitterRewards.payouts.filter((_: any, index: number) => index !== action.payload),
                },
            };
        }

        case "updateSubRank": {
            const updatedPayouts = [...state.submitterRewards.payouts];
            if (!isNaN(action.payload.rank)) {
                updatedPayouts[action.payload.index].rank = Number(action.payload.rank);
            } else {
                updatedPayouts[action.payload.index].rank = 0;
            }
            return { ...state, submitterRewards: { ...state.submitterRewards, payouts: updatedPayouts } };
        }

        case "updateSubRewardAmount": {
            const updatedPayouts = [...state.submitterRewards.payouts];
            if (!updatedPayouts[action.payload.index][action.payload.tokenType]) {
                updatedPayouts[action.payload.index][action.payload.tokenType] = { amount: "0" };
            }
            updatedPayouts[action.payload.index][action.payload.tokenType].amount = action.payload.amount;
            return { ...state, submitterRewards: { ...state.submitterRewards, payouts: updatedPayouts } };
        }

        case "updateERC721TokenId": {
            const updatedERC721Payouts = [...state.submitterRewards.payouts];
            if (!updatedERC721Payouts[action.payload.index].ERC721) {
                updatedERC721Payouts[action.payload.index].ERC721 = { tokenId: null };
            }
            updatedERC721Payouts[action.payload.index].ERC721.tokenId = action.payload.tokenId === null ? null : Number(action.payload.tokenId);
            return { ...state, submitterRewards: { ...state.submitterRewards, payouts: updatedERC721Payouts } };
        }

        case "toggleVoterRewards": {
            return {
                ...state,
                // if toggle is on, set the default voter rewards to the submitter rewards
                // if toggle is off, clear the voter rewards
                voterRewards: action.payload.selected ? {
                    ...(state.submitterRewards.ETH ? { ETH: state.submitterRewards.ETH } : {}),
                    ...(state.submitterRewards.ERC20 ? { ERC20: state.submitterRewards.ERC20 } : {}),
                    ...(state.submitterRewards.ERC1155 ? { ERC721: state.submitterRewards.ERC1155 } : {}),
                    payouts: [
                        {
                            rank: 1,
                            ...(state.submitterRewards.ETH ? { ETH: { amount: "0" } } : {}),
                            ...(state.submitterRewards.ERC20 ? { ERC20: { amount: "0" } } : {}),
                            ...(state.submitterRewards.ERC1155 ? { ERC1155: { amount: "0" } } : {}),
                        }
                    ]
                } : null,
            }
        }

        case "addVoterRank": {
            return {
                ...state,
                voterRewards: {
                    ...state.voterRewards,
                    payouts: [
                        ...state.voterRewards.payouts,
                        {
                            rank: state.voterRewards.payouts.length + 1,
                            ...(state.voterRewards.ETH ? { ETH: { amount: "0" } } : {}),
                            ...(state.voterRewards.ERC20 ? { ERC20: { amount: "0" } } : {}),

                        },
                    ],
                },
            };
        }

        case "removeVoterRank": {
            return {
                ...state,
                voterRewards: {
                    ...state.voterRewards,
                    payouts: state.voterRewards.payouts.filter((_: any, index: number) => index !== action.payload),
                },
            };
        }


        case "updateVoterRank": {
            const updatedPayouts = [...state.voterRewards.payouts];
            if (!isNaN(action.payload.rank)) {
                updatedPayouts[action.payload.index].rank = Number(action.payload.rank);
            } else {
                updatedPayouts[action.payload.index].rank = 0;
            }
            return { ...state, voterRewards: { ...state.voterRewards, payouts: updatedPayouts } };
        }


        case "updateVoterRewardAmount": {
            const updatedPayouts = [...state.voterRewards.payouts];
            if (!updatedPayouts[action.payload.index][action.payload.tokenType]) {
                updatedPayouts[action.payload.index][action.payload.tokenType] = { amount: "0" };
            }
            updatedPayouts[action.payload.index][action.payload.tokenType].amount = action.payload.amount;
            return { ...state, voterRewards: { ...state.voterRewards, payouts: updatedPayouts } };
        }

        case "updateVoterRewardType": {
            // take the selected token and set the amount for the new option to the amount of the old option and clear the old option
            // payload looks like this: {index: number, oldTokenType: "ETH | ERC20", newTokenType: "ETH | ERC20"}
            const updatedPayouts = [...state.voterRewards.payouts];
            const oldTokenType = action.payload.oldTokenType;
            const newTokenType = action.payload.newTokenType;
            const index = action.payload.index;
            if (oldTokenType === newTokenType) {
                return state;
            }
            if (updatedPayouts[index][oldTokenType]) {
                updatedPayouts[index][newTokenType] = { amount: updatedPayouts[index][oldTokenType].amount };
                // set the old token amount to 0
                updatedPayouts[index][oldTokenType].amount = "0";
            } else {
                updatedPayouts[index][newTokenType] = { amount: "0" };
            }
            return { ...state, voterRewards: { ...state.voterRewards, payouts: updatedPayouts } };
        }

        case "addSubmitterRestriction": {
            return {
                ...state,
                submitterRestrictions: [
                    ...state.submitterRestrictions,
                    action.payload.token,
                ],
            };
        }

        case "removeSubmitterRestriction": {
            return {
                ...state,
                submitterRestrictions: state.submitterRestrictions.filter((_: any, index: number) => index !== action.payload),
            };
        }


        case "updateSubRestrictionThreshold": {
            const updatedSubRestrictions = [...state.submitterRestrictions];
            if (!isNaN(action.payload.threshold)) {
                updatedSubRestrictions[action.payload.index].threshold = action.payload.threshold;
            } else {
                updatedSubRestrictions[action.payload.index].threshold = "";
            }
            return { ...state, submitterRestrictions: updatedSubRestrictions };
        }

        case "setErrors":
            return {
                ...state,
                errors: { ...state.errors, ...action.payload },
            }
        default:
            return state;
    }
}


export const cleanSubmitterRewards = (submitterRewards: SubmitterRewards) => {
    const cleanedSubmitterRewards = {
        ETH: submitterRewards.ETH,
        ERC20: submitterRewards.ERC20,
        ERC721: submitterRewards.ERC721,
        ERC1155: submitterRewards.ERC1155,
        payouts: submitterRewards.payouts.map((payout: any) => {
            const cleanedPayout: any = { rank: payout.rank };
            if (payout.ETH && payout.ETH.amount > 0) {
                cleanedPayout.ETH = payout.ETH;
            }
            if (payout.ERC20 && payout.ERC20.amount > 0) {
                cleanedPayout.ERC20 = payout.ERC20;
            }
            if (payout.ERC721 && payout.ERC721.tokenId > 0) {
                cleanedPayout.ERC721 = payout.ERC721;
            }
            if (payout.ERC1155 && payout.ERC1155.amount > 0) {
                cleanedPayout.ERC1155 = payout.ERC1155;
            }
            return cleanedPayout;
        }),
    };
    return cleanedSubmitterRewards as SubmitterRewards;

}


export const rewardsObjectToArray = (rewards: SubmitterRewards | VoterRewards, strictTypes?: string[]) => {
    return Object.values(rewards).filter(
        (value): value is IToken =>
            value !== null &&
            typeof value !== "undefined" &&
            value !== rewards.payouts &&
            (!strictTypes || strictTypes.includes(value.type))
    );
};

export const arraysSubtract = (arr1: IToken[], arr2: IToken[], strictTypes?: string[]) => {
    return arr1.filter((item) => {
        // Check if the item is not in arr2
        return !arr2.some((obj) => {
            // Check if the objects are equal based on symbol and type
            return obj.symbol === item.symbol && obj.type === item.type;
            //return JSON.stringify(obj) === JSON.stringify(item);
        }) && (!strictTypes || strictTypes.includes(item.type))

    });

}

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

export type VotingStrategyType = "arcade" | "weighted";

export type ArcadeStrategy = {
    type: "arcade";
    votingPower: string;
}

export type WeightedStrategy = {
    type: "weighted";
    multiplier: string;
}


export type VotingPolicyType = {
    token?: IToken;
    strategy?: ArcadeStrategy | WeightedStrategy;
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
    votingPolicy: VotingPolicyType[] | [];
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

        // submitter rewards

        case "addSubmitterReward": {
            const { [action.payload.token.type]: _, ...updatedSubmitterRewards } = state.submitterRewards;
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
                            // we also use this for swapping, so check if payout for type is already there otherwise set to 0 / null
                            [action.payload.token.type]:
                                action.payload.token.type === 'ERC721' ?
                                    { tokenId: payout[action.payload.token.type]?.tokenId || null }
                                    :
                                    { amount: payout[action.payload.token.type]?.amount || "0" }
                        };
                    }),
                }
            }
        };

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
            const payout = updatedPayouts[action.payload.index];
            const tokenType = action.payload.tokenType;
            if (!payout[tokenType]) {
                payout[tokenType] = { amount: "0" };
            }
            payout[tokenType].amount = action.payload.amount;
            return { ...state, submitterRewards: { ...state.submitterRewards, payouts: updatedPayouts } };
        }

        case "updateERC721TokenId": {
            const updatedPayouts = [...state.submitterRewards.payouts];
            const payout = updatedPayouts[action.payload.index];
            if (!payout.ERC721) {
                payout.ERC721 = { tokenId: null };
            }
            payout.ERC721.tokenId = action.payload.tokenId === null ? null : Number(action.payload.tokenId);
            return { ...state, submitterRewards: { ...state.submitterRewards, payouts: updatedPayouts } };
        }

        // voter rewards

        case "addVoterReward": {
            const { [action.payload.token.type]: _, ...updatedVoterRewards } = state.voterRewards;
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
                            // we also use this for swapping, so check if payout for type is already there otherwise set to 0
                            [action.payload.token.type]: { amount: payout[action.payload.token.type]?.amount || "0" },
                        };
                    }),
                }
            }
        };

        case "removeVoterReward": {
            const { [action.payload.token.type]: _, ...updatedVoterRewards } = state.voterRewards;

            const updatedPayouts = [];
            for (let i = 0; i < state.voterRewards.payouts.length; i++) {
                const payout = state.voterRewards.payouts[i];
                const { [action.payload.token.type]: _, ...updatedPayout } = payout;
                if (Object.keys(updatedPayout).length > 0) {
                    updatedPayouts.push(updatedPayout);
                }
            }

            return {
                ...state,
                voterRewards: {
                    ...updatedVoterRewards,
                    payouts: updatedPayouts
                }
            };
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
            const payout = updatedPayouts[action.payload.index];
            const tokenType = action.payload.tokenType;
            if (!payout[tokenType]) {
                payout[tokenType] = { amount: "0" };
            }
            payout[tokenType].amount = action.payload.amount;
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

        // submitter restrictions

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

        // voting policy

        case "addVotingPolicy": {
            return {
                ...state,
                votingPolicy: [
                    ...state.votingPolicy,
                    action.payload,
                ],
            };
        }

        case "removeVotingPolicy": {
            return {
                ...state,
                votingPolicy: state.votingPolicy.filter((_: any, index: number) => index !== action.payload),
            };
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


// helper functions

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

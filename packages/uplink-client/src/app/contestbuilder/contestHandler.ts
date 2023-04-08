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



export interface ContestBuilderProps {
    type: string | null;
    startTime: string;
    voteTime: string;
    endTime: string;
    contestPromptTitle: string;
    contestPromptBody: string;
    media_blob: string | null;
    media_url: string | null;
    rewardOptions: IToken[];//RewardOption[];
    submitterRewards: SubmitterRewards;
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
            console.log(action.payload);
            const updatedPayouts = [...state.submitterRewards.payouts];
            if (!updatedPayouts[action.payload.index][action.payload.tokenType]) {
                updatedPayouts[action.payload.index][action.payload.tokenType] = { amount: "0" };
            }
            updatedPayouts[action.payload.index][action.payload.tokenType].amount = action.payload.amount;
            return { ...state, submitterRewards: { ...state.submitterRewards, payouts: updatedPayouts } };
        }

        case "updateERC721TokenId": {
            console.log(action.payload)
            const updatedERC721Payouts = [...state.submitterRewards.payouts];
            if (!updatedERC721Payouts[action.payload.index].ERC721) {
                updatedERC721Payouts[action.payload.index].ERC721 = { tokenId: null };
            }
            updatedERC721Payouts[action.payload.index].ERC721.tokenId = action.payload.tokenId === null ? null : Number(action.payload.tokenId);
            return { ...state, submitterRewards: { ...state.submitterRewards, payouts: updatedERC721Payouts } };
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

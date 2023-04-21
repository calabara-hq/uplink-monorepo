import { IToken, IERCToken, INativeToken } from "@/types/token";


type FungiblePayout = {
    amount: string;
}

type NonFungiblePayout = {
    tokenId: number | null;
}

interface IPayout {
    rank: number;
    ETH?: FungiblePayout;
    ERC20?: FungiblePayout;
    ERC721?: NonFungiblePayout;
    ERC1155?: FungiblePayout;
}


export interface SubmitterRewards {
    ETH?: IToken;
    ERC20?: IToken;
    ERC721?: IToken;
    ERC1155?: IToken;
    payouts?: IPayout[];
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

export type SubmitterRestriction = {
    token?: IToken;
    threshold?: string;
}

export type VotingStrategyType = "arcade" | "weighted";


export type VotingPolicyType = {
    token?: IToken;
    strategy?: {
        type: VotingStrategyType;
        votingPower?: string;
        multiplier?: string;
    }
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


export type SubRewardPayoutError = {
    rank?: string;
    ETH?: string;
    ERC20?: string;
    ERC721?: string;
    ERC1155?: string;
}

export type SubRewardErrors = {
    //payouts: SubRewardPayoutError[];
    duplicateRanks: number[];
}

export type ContestBuilderErrors = {
    type?: string;
    startTime?: string;
    voteTime?: string;
    endTime?: string;
    contestPromptTitle: string | null;
    contestPromptBody: string | null;
    media_url: string | null;
    subRewards: SubRewardErrors;
}

export const reducer = (state: any, action: any) => {
    switch (action.type) {

        case "setType":
            return {
                ...state,
                type: action.payload,
                errors: { ...state.errors, type: undefined },
            };
        case "setStartTime":
            return {
                ...state,
                startTime: action.payload,
                errors: { ...state.errors, startTime: undefined },
            };
        case "setVoteTime":
            return {
                ...state,
                voteTime: action.payload,
                errors: { ...state.errors, voteTime: undefined },
            };
        case "setEndTime":
            return {
                ...state,
                endTime: action.payload,
                errors: { ...state.errors, endTime: undefined },
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
                    payouts: (state.submitterRewards?.payouts ?? [
                        {
                            rank: 1,
                            [action.payload.token.type]: action.payload.token.type === 'ERC721'
                                ? { tokenId: null }
                                : { amount: '' },
                        }
                    ]).map((payout: any) => {
                        return {
                            ...payout,
                            [action.payload.token.type]: {
                                ...payout[action.payload.token.type],
                                ...(action.payload.token.type === 'ERC721'
                                    ? { tokenId: payout[action.payload.token.type]?.tokenId ?? null }
                                    : { amount: payout[action.payload.token.type]?.amount ?? '' }
                                )
                            }
                        };
                    })
                }
            }
        };

        case "removeSubmitterReward": {
            const { [action.payload.token.type]: _, payouts, ...updatedSubmitterRewards } = state.submitterRewards;

            const hasOtherRewardTypes = Object.keys(updatedSubmitterRewards).length > 0;
            const updatedPayouts: Array<object> | undefined = hasOtherRewardTypes ? [] : undefined;

            if (hasOtherRewardTypes) {
                for (let i = 0; i < state.submitterRewards.payouts.length; i++) {
                    const payout = state.submitterRewards.payouts[i];
                    const { [action.payload.token.type]: _, ...updatedPayout } = payout;
                    if (Object.keys(updatedPayout).length > 0) {
                        if (updatedPayouts !== undefined) {
                            updatedPayouts.push(updatedPayout);
                        }
                    }
                }
            }

            return {
                ...state,
                submitterRewards: {
                    ...updatedSubmitterRewards,
                    ...(updatedPayouts !== undefined && { payouts: updatedPayouts })
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
                            ...(state.submitterRewards.ETH ? { ETH: { amount: "" } } : {}),
                            ...(state.submitterRewards.ERC20 ? { ERC20: { amount: "" } } : {}),
                            ...(state.submitterRewards.ERC721 ? { ERC721: { tokenId: null } } : {}),
                            ...(state.submitterRewards.ERC1155 ? { ERC1155: { amount: "" } } : {}),

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

            if (oldTokenType === newTokenType) return state;

            updatedPayouts[index][newTokenType] = { amount: updatedPayouts[index][oldTokenType]?.amount || "0" };
            delete updatedPayouts[index][oldTokenType];

            return { ...state, voterRewards: { ...state.voterRewards, payouts: updatedPayouts } };
        }

        // submitter restrictions

        case "addSubmitterRestriction": {
            return {
                ...state,
                submitterRestrictions: [
                    ...state.submitterRestrictions,
                    action.payload,
                ],
            };
        }

        case "removeSubmitterRestriction": {
            return {
                ...state,
                submitterRestrictions: state.submitterRestrictions.filter((_: any, index: number) => index !== action.payload),
            };
        }

        case "updateSubmitterRestriction": {
            const updatedSubRestrictions = [...state.submitterRestrictions];
            updatedSubRestrictions[action.payload.index] = action.payload.restriction;
            return { ...state, submitterRestrictions: updatedSubRestrictions };
        }

        // voting policy

        case "addVotingPolicy": {
            return {
                ...state,
                votingPolicy: [
                    ...state.votingPolicy,
                    action.payload.policy,
                ],
            };

        }

        case "removeVotingPolicy": {
            return {
                ...state,
                votingPolicy: state.votingPolicy.filter((_: any, index: number) => index !== action.payload),
            };
        }

        case "updateVotingPolicy": {
            const updatedVotingPolicy = [...state.votingPolicy];
            updatedVotingPolicy[action.payload.index] = action.payload.policy;
            return { ...state, votingPolicy: updatedVotingPolicy };
        }

        case "validateStep": {
            const stepIndex = action.payload;
            const newErrors = validateStep(state, stepIndex);
            return { ...state, errors: { ...state.errors, newErrors } };
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
        payouts: submitterRewards.payouts?.map((payout: any) => {
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
        }) ?? undefined,
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

export const validateStep = (state: ContestBuilderProps, step: number) => {
    const errors = {}
    switch (step) {
        case 0:
            return validateContestType(state);


        case 1:
            // contest deadlines are handled in component effects
            return validateContestDeadlines(state);
        case 2:
            break;

        case 3:
            return validateSubmitterRewards(state);
        /*
    case 4:
        return validateStep4(state);
    case 5:
        return validateStep5(state);
    case 6:
        return validateStep6(state);
    case 7:
        return validateStep7(state);
    */
        default:
            break;
    }
    return errors
}


const validateContestType = (state: ContestBuilderProps) => {
    return {
        ...(!state.type ? { type: "Please select a contest type" } : {}),
    }
}




const validateContestDeadlines = (state: ContestBuilderProps) => {
    const errors: ContestBuilderErrors = {};

    if (state.voteTime <= state.startTime) {
        errors.voteTime = "vote date must be after start date";
    }

    if (state.endTime <= state.voteTime) {
        errors.endTime = "end date must be after vote date";
    }

    if (state.endTime <= state.startTime) {
        errors.endTime = "end date must be after start date";
    }

    return errors;
}


const validateSubmitterRewards = (state: ContestBuilderProps) => {
    const errors: ContestBuilderErrors = {
        subRewards: {
            duplicateRanks: [],
        }
    };

    const seenRanks: number[] = [];

    const payouts = state.submitterRewards.payouts;
    const ranks = payouts ? payouts.map((payout) => payout.rank) : [];

    ranks.forEach((rank, index) => {
        if (seenRanks.includes(rank)) {
            errors.subRewards.duplicateRanks.push(rank);
        } else {
            seenRanks.push(rank);
        }
    });

    return errors;
};
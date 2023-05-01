import { IToken, IERCToken, INativeToken } from "@/types/token";
import { OutputData } from "@editorjs/editorjs";

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
    payouts?: IPayout[];
}

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

export interface Prompt {
    title: string;
    body: OutputData | null;
    coverUrl?: string;
    coverBlob?: string;
}

export interface Deadlines {
    startTime: string;
    voteTime: string;
    endTime: string;
}

export interface ContestBuilderProps {
    type: string | null;
    deadlines: Deadlines;
    prompt: Prompt;
    spaceTokens: IToken[];
    submitterRewards: SubmitterRewards;
    voterRewards: VoterRewards;
    submitterRestrictions: SubmitterRestriction[] | [];
    votingPolicy: VotingPolicyType[] | [];
    errors: ContestBuilderErrors;
}

export type DeadlineError = {
    startTime?: string;
    voteTime?: string;
    endTime?: string;
}

export type RewardError = {
    duplicateRanks: number[];
}

export type PromptError = {
    title?: string;
    body?: string;
    coverUrl?: string;
}

export type ContestBuilderErrors = {
    type?: string;
    deadlines?: DeadlineError;
    subRewards?: RewardError;
    voterRewards?: RewardError;
    votingPolicy?: string;
    prompt?: PromptError;
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
                deadlines: {
                    ...state.deadlines,
                    startTime: action.payload,
                },
                errors: { ...state.errors, deadlines: { ...state.errors.deadlines, startTime: undefined } },
            };

        case "setVoteTime":
            return {
                ...state,
                deadlines: {
                    ...state.deadlines,
                    voteTime: action.payload,
                },
                errors: { ...state.errors, deadlines: { ...state.errors.deadlines, voteTime: undefined } },
            };

        case "setEndTime":
            return {
                ...state,
                deadlines: {
                    ...state.deadlines,
                    endTime: action.payload,
                },
                errors: { ...state.errors, deadlines: { ...state.errors.deadlines, endTime: undefined } },
            };

        case "setPromptTitle": {

            const { title: titleError, ...existingPromptErrors } = state.errors.prompt || {}

            return {
                ...state,
                prompt: {
                    ...state.prompt,
                    title: action.payload,
                },

                errors: { ...state.errors, prompt: { ...existingPromptErrors } },
            };
        }

        case "setPromptBody": {
            const { body: bodyError, ...existingPromptErrors } = state.errors.prompt || {}

            return {
                ...state,
                prompt: {
                    ...state.prompt,
                    body: action.payload,
                },
                errors: { ...state.errors, prompt: { ...existingPromptErrors } },
            };
        }

        case "setCoverBlob": {
            return {
                ...state,
                prompt: {
                    ...state.prompt,
                    coverBlob: action.payload,
                }
            };
        }

        case "setCoverUrl": {
            const { coverUrl: urlError, ...existingPromptErrors } = state.errors.prompt || {}

            return {
                ...state,
                prompt: {
                    ...state.prompt,
                    coverUrl: action.payload,
                },
                errors: { ...state.errors, prompt: { ...existingPromptErrors } },
            };
        }

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
            updatedPayouts[action.payload.index].rank = Number(action.payload.rank);
            const updatedErrors = { ...state.errors.subRewards };
            // if the index is in errors.dupliateRanks, remove it from the array
            if (updatedErrors.duplicateRanks.includes(action.payload.index)) {
                updatedErrors.duplicateRanks = updatedErrors.duplicateRanks.filter((index: number) => index !== action.payload.index);
            }

            return {
                ...state,
                submitterRewards: { ...state.submitterRewards, payouts: updatedPayouts },
                errors: {
                    ...state.errors,
                    subRewards: updatedErrors
                }
            };
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
            if (action.payload.token.type === 'ERC721' || action.payload.token.type === 'ERC1155') {
                return state;
            }
            const { [action.payload.token.type]: _, ...updatedVoterRewards } = state.voterRewards;
            return {
                ...state,
                voterRewards: {
                    // keep the existing rewards - the one we plucked
                    ...updatedVoterRewards,
                    [action.payload.token.type]: action.payload.token,


                    // add the type to each payout
                    payouts: (state.voterRewards?.payouts ?? [
                        {
                            rank: 1,
                            [action.payload.token.type]: { amount: '' },
                        }
                    ]).map((payout: any) => {
                        return {
                            ...payout,
                            [action.payload.token.type]: {
                                ...payout[action.payload.token.type],
                                amount: payout[action.payload.token.type]?.amount ?? ''
                            }
                        };
                    })
                }
            }
        };

        case "removeVoterReward": {
            const { [action.payload.token.type]: _, payouts, ...updatedVoterRewards } = state.voterRewards;

            const hasOtherRewardTypes = Object.keys(updatedVoterRewards).length > 0;
            const updatedPayouts: Array<object> | undefined = hasOtherRewardTypes ? [] : undefined;

            if (hasOtherRewardTypes) {
                for (let i = 0; i < state.voterRewards.payouts.length; i++) {
                    const payout = state.voterRewards.payouts[i];
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
                voterRewards: {
                    ...updatedVoterRewards,
                    ...(updatedPayouts !== undefined && { payouts: updatedPayouts })
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
                            ...(state.voterRewards.ETH ? { ETH: { amount: "" } } : {}),
                            ...(state.voterRewards.ERC20 ? { ERC20: { amount: "" } } : {}),

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
            updatedPayouts[action.payload.index].rank = Number(action.payload.rank);
            const updatedErrors = { ...state.errors.voterRewards };
            // if the index is in errors.dupliateRanks, remove it from the array
            if (updatedErrors.duplicateRanks.includes(action.payload.index)) {
                updatedErrors.duplicateRanks = updatedErrors.duplicateRanks.filter((index: number) => index !== action.payload.index);
            }

            return {
                ...state,
                voterRewards: { ...state.voterRewards, payouts: updatedPayouts },
                errors: {
                    ...state.errors,
                    voterRewards: updatedErrors
                }
            };
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
            return validateContestType(state.type);
        case 1:
            // contest deadlines are handled in component effects
            return validateContestDeadlines(state.deadlines);
        case 2:
            return validatePrompt(state);
        case 3:
            return validateSubmitterRewards(state);
        case 4:
            return validateVoterRewards(state);
        case 5:
            return { isError: false, errors: {} }
        case 6:
            return validateVotingPolicy(state);
        /*
    case 7:
        return validateStep7(state);
    */
        default:
            break;
    }
    return errors
}


export const validateContestType = (type: ContestBuilderProps['type']) => {

    const isError = !type || (type !== 'standard' && type !== 'twitter');

    return {
        isError: isError,
        ...(isError ? { errors: { type: "Contest type is required" } } : { errors: {} })
    }
}




export const validateContestDeadlines = (deadlines: ContestBuilderProps['deadlines']) => {

    const { startTime, voteTime, endTime } = deadlines || {};
    const now = new Date(Date.now()).toISOString().slice(0, -5) + "Z"

    // if startTime is "now", use a new Date() object for these calculations
    const calculatedStartTime = startTime === 'now' ? now : startTime;


    const calculateErrors = () => {
        let startTimeError = "";
        let voteTimeError = "";
        let endTimeError = "";

        // check for null values
        if (!calculatedStartTime) startTimeError = "start date is required";
        if (!voteTime) voteTimeError = "vote date is required";
        if (!endTime) endTimeError = "end date is required";
        if (startTimeError || voteTimeError || endTimeError) return { startTimeError, voteTimeError, endTimeError }

        // check that dates are in the correct order
        if (voteTime <= calculatedStartTime) voteTimeError = "vote date must be after start date";
        if (endTime <= voteTime) endTimeError = "end date must be after vote date";
        if (endTime <= calculatedStartTime) endTimeError = "end date must be after start date";

        return { startTimeError, voteTimeError, endTimeError }

    }

    const { startTimeError, voteTimeError, endTimeError } = calculateErrors();

    const isError = startTimeError || voteTimeError || endTimeError;

    const errors = {
        ...(isError ? {
            ...(startTimeError ? { startTime: startTimeError } : {}),
            ...(voteTimeError ? { voteTime: voteTimeError } : {}),
            ...(endTimeError ? { endTime: endTimeError } : {}),
        } : {})
    }

    return {
        errors,
        isError: isError,
    };
}


export const validateSubmitterRewards = (state: ContestBuilderProps) => {
    let isError = false;
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
            errors.subRewards.duplicateRanks.push(index);
            console.log(seenRanks)
            isError = true;
        } else {
            seenRanks.push(rank);
        }
    });

    return {
        errors,
        isError: isError,
    };
};

export const validateVoterRewards = (state: ContestBuilderProps) => {
    let isError = false;
    const errors: ContestBuilderErrors = {
        voterRewards: {
            duplicateRanks: [],
        }
    };

    const seenRanks: number[] = [];

    const payouts = state.voterRewards.payouts;
    const ranks = payouts ? payouts.map((payout) => payout.rank) : [];

    ranks.forEach((rank, index) => {
        if (seenRanks.includes(rank)) {
            errors.voterRewards.duplicateRanks.push(index);
            isError = true;
        } else {
            seenRanks.push(rank);
        }
    });

    return {
        errors,
        isError: isError,
    };
};

export const validateVotingPolicy = (state: ContestBuilderProps) => {
    // set an error if the voting policy is not set
    return {
        ...(!state.votingPolicy.length ? {
            errors: { votingPolicy: "Please add a voting policy" }, isError: true
        } : { isError: false, errors: {} }),
    }
}

export const validatePrompt = (state: ContestBuilderProps) => {

    const isTitle = state.prompt.title.length > 0;
    const isBody = state.prompt.body?.blocks?.length ?? 0 > 0;
    const isCoverUrl = state?.prompt?.coverUrl?.length ?? 0 > 0;

    return {
        isError: !isTitle || !isBody || !isCoverUrl,
        errors: {
            ...(isTitle && isBody && isCoverUrl ? {} : {
                prompt: {
                    ...(isTitle ? {} : { title: "Please enter a title" }),
                    ...(isBody ? {} : { body: "Please enter a description" }),
                    ...(isCoverUrl ? {} : { coverUrl: "Please enter a cover url" }),
                }
            })
        }
    }
}

export const cleanSubmitterRewards = (submitterRewards: SubmitterRewards) => {

    let seenETH: boolean = false;
    let seenERC20: boolean = false;
    let seenERC721: boolean = false;
    let seenERC1155: boolean = false;


    const cleanedPayouts = submitterRewards.payouts?.map((payout) => {
        const cleanedPayout: any = { rank: payout.rank };
        const ETHPayout = payout.ETH?.amount ?? '0';
        const ERC20Payout = payout.ERC20?.amount ?? '0';
        const ERC721Payout = payout.ERC721?.tokenId ?? -1;
        const ERC1155Payout = payout.ERC1155?.amount ?? '0';

        if (parseFloat(ETHPayout) > 0) {
            cleanedPayout.ETH = { amount: ETHPayout };
            seenETH = true;
        }

        if (parseFloat(ERC20Payout) > 0) {
            cleanedPayout.ERC20 = { amount: ERC20Payout };
            seenERC20 = true;
        }

        if (ERC721Payout > -1) {
            cleanedPayout.ERC721 = { tokenId: ERC721Payout };
            seenERC721 = true;
        }

        if (parseFloat(ERC1155Payout) > 0) {
            cleanedPayout.ERC1155 = { amount: ERC1155Payout };
            seenERC1155 = true;
        }

        return cleanedPayout;
    })

    return {
        ...(seenETH ? { ETH: submitterRewards.ETH } : {}),
        ...(seenERC20 ? { ERC20: submitterRewards.ERC20 } : {}),
        ...(seenERC721 ? { ERC721: submitterRewards.ERC721 } : {}),
        ...(seenERC1155 ? { ERC1155: submitterRewards.ERC1155 } : {}),
        ...(cleanedPayouts ? { payouts: cleanedPayouts } : {}),
    }
};

export const cleanVoterRewards = (voterRewards: VoterRewards) => {

    let seenETH: boolean = false;
    let seenERC20: boolean = false;


    const cleanedPayouts = voterRewards.payouts?.map((payout) => {
        const cleanedPayout: any = { rank: payout.rank };
        const ETHPayout = payout.ETH?.amount ?? '0';
        const ERC20Payout = payout.ERC20?.amount ?? '0';

        if (parseFloat(ETHPayout) > 0) {
            cleanedPayout.ETH = { amount: ETHPayout };
            seenETH = true;
        }

        if (parseFloat(ERC20Payout) > 0) {
            cleanedPayout.ERC20 = { amount: ERC20Payout };
            seenERC20 = true;
        }

        return cleanedPayout;
    })

    return {
        ...(seenETH ? { ETH: voterRewards.ETH } : {}),
        ...(seenERC20 ? { ERC20: voterRewards.ERC20 } : {}),
        ...(cleanedPayouts ? { payouts: cleanedPayouts } : {}),
    }
};
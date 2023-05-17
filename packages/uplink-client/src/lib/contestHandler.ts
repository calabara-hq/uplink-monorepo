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

export type ArcadeStrategy = {
    type: "arcade";
    votingPower?: string;
}

export type WeightedStrategy = {
    type: "weighted";
}


export type VotingPolicyType = {
    token?: IToken;
    strategy?: ArcadeStrategy | WeightedStrategy;
} & ({ strategy: ArcadeStrategy; votingPower: string } | { strategy: WeightedStrategy });


export interface Prompt {
    title: string;
    body: OutputData | null;
    coverUrl?: string;
    coverBlob?: string;
}

export interface Deadlines {
    snapshot: string;
    startTime: string;
    voteTime: string;
    endTime: string;
}

export interface AdditionalParams {
    anonSubs: boolean;
    visibleVotes: boolean;
    selfVote: boolean;
    subLimit: number;
}

export type Metadata = {
    type: string | null;
    category: string | null;
}

export interface ContestBuilderProps {
    metadata: Metadata;
    deadlines: Deadlines;
    prompt: Prompt;
    spaceTokens: IToken[];
    submitterRewards: SubmitterRewards;
    voterRewards: VoterRewards;
    submitterRestrictions: SubmitterRestriction[] | [];
    votingPolicy: VotingPolicyType[] | [];
    additionalParams: AdditionalParams;
    errors: ContestBuilderErrors;
}

export type DeadlineError = {
    snapshot?: string;
    startTime?: string;
    voteTime?: string;
    endTime?: string;
}

export type RewardError = {
    duplicateRanks?: number[];
}

export type PromptError = {
    title?: string;
    body?: string;
    coverUrl?: string;
}

export type MetadataError = {
    type?: string;
    category?: string;
}


export type ContestBuilderErrors = {
    metadata?: MetadataError;
    deadlines?: DeadlineError;
    prompt?: PromptError;
    submitterRewards?: RewardError;
    voterRewards?: RewardError;
    votingPolicy?: string;
}

export const reducer = (state: any, action: any) => {
    switch (action.type) {

        case "setType": {
            const { metadata, ...existingErrors } = state.errors;
            const { type: typeError, ...existingMetadataErrors } = metadata || {};
            return {
                ...state,
                metadata: {
                    ...state.metadata,
                    type: action.payload,
                },
                errors: {
                    ...existingErrors,
                    ...existingMetadataErrors && Object.keys(existingMetadataErrors).length > 0 ? { metadata: existingMetadataErrors } : {}
                }
            };
        }

        case "setCategory": {
            const { metadata, ...existingErrors } = state.errors;
            const { category: categoryError, ...existingMetadataErrors } = metadata || {};
            return {
                ...state,
                metadata: {
                    ...state.metadata,
                    category: action.payload,
                },
                errors: {
                    ...existingErrors,
                    ...existingMetadataErrors && Object.keys(existingMetadataErrors).length > 0 ? { metadata: existingMetadataErrors } : {}
                }
            };
        }

        case "setSnapshot": {
            const { deadlines: deadlineErrors, ...existingErrors } = state.errors;
            const { snapshot: snapshotError, ...existingDeadlineErrors } = deadlineErrors || {};

            return {
                ...state,
                deadlines: {
                    ...state.deadlines,
                    snapshot: action.payload,
                },
                errors: {
                    ...existingErrors,
                    ...(existingDeadlineErrors && Object.keys(existingDeadlineErrors).length > 0) ? { deadlines: existingDeadlineErrors } : {}
                },
            };
        }

        case "setStartTime": {
            const { deadlines: deadlineErrors, ...existingErrors } = state.errors;
            const { startTime: startTimeError, ...existingDeadlineErrors } = deadlineErrors || {};

            return {
                ...state,
                deadlines: {
                    ...state.deadlines,
                    startTime: action.payload,
                },
                errors: {
                    ...existingErrors,
                    ...(existingDeadlineErrors && Object.keys(existingDeadlineErrors).length > 0) ? { deadlines: existingDeadlineErrors } : {}
                },
            };
        }
        case "setVoteTime": {
            const { deadlines: deadlineErrors, ...existingErrors } = state.errors;
            const { voteTime: voteTimeError, ...existingDeadlineErrors } = deadlineErrors || {};

            return {
                ...state,
                deadlines: {
                    ...state.deadlines,
                    voteTime: action.payload,
                },
                errors: {
                    ...existingErrors,
                    ...(existingDeadlineErrors && Object.keys(existingDeadlineErrors).length > 0) ? { deadlines: existingDeadlineErrors } : {}
                },
            };
        }

        case "setEndTime": {
            const { deadlines: deadlineErrors, ...existingErrors } = state.errors;
            const { endTime: endTimeError, ...existingDeadlineErrors } = deadlineErrors || {};
            return {
                ...state,
                deadlines: {
                    ...state.deadlines,
                    endTime: action.payload,
                },
                errors: {
                    ...existingErrors,
                    ...(existingDeadlineErrors && Object.keys(existingDeadlineErrors).length > 0) ? { deadlines: existingDeadlineErrors } : {}
                },
            };
        }
        case "setPromptTitle": {
            const { prompt: promptErrors, ...existingErrors } = state.errors
            const { title: titleError, ...existingPromptErrors } = promptErrors || {}

            return {
                ...state,
                prompt: {
                    ...state.prompt,
                    title: action.payload,
                },

                errors: {
                    ...existingErrors,
                    ...(existingPromptErrors && Object.keys(existingPromptErrors).length > 0) ? { prompt: existingPromptErrors } : {}
                },
            };
        }

        case "setPromptBody": {
            const { prompt: promptErrors, ...existingErrors } = state.errors
            const { body: bodyError, ...existingPromptErrors } = promptErrors || {}
            return {
                ...state,
                prompt: {
                    ...state.prompt,
                    body: action.payload,
                },
                errors: {
                    ...existingErrors,
                    ...(existingPromptErrors && Object.keys(existingPromptErrors).length > 0) ? { prompt: existingPromptErrors } : {}
                },
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
            const { prompt: promptErrors, ...existingErrors } = state.errors
            const { coverUrl: urlError, ...existingPromptErrors } = promptErrors || {}

            return {
                ...state,
                prompt: {
                    ...state.prompt,
                    coverUrl: action.payload,
                },
                errors: {
                    ...existingErrors,
                    ...(existingPromptErrors && Object.keys(existingPromptErrors).length > 0) ? { prompt: existingPromptErrors } : {}
                },
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
            const oldPayoutRank = state.submitterRewards.payouts[action.payload].rank;
            const { submitterRewards, ...existingErrors } = state.errors;
            const { duplicateRanks: duplicateRankErrors } = submitterRewards || {};

            // remove the first occurance of old rank from duplicate ranks if it exists
            let found = false;
            const newDuplicateRanks = duplicateRankErrors?.filter((rank: number) => {
                if (!found && rank === oldPayoutRank) {
                    found = true;
                    return false;
                }
                return true;
            });

            const updatedErrors = {
                ...existingErrors,
                ...(newDuplicateRanks?.length ?? 0 > 0 ? {
                    submitterRewards: {
                        ...submitterRewards,
                        duplicateRanks: newDuplicateRanks,
                    }
                } : {})
            }

            return {
                ...state,
                submitterRewards: {
                    ...state.submitterRewards,
                    payouts: state.submitterRewards.payouts.filter((_: any, index: number) => index !== action.payload),
                },
                errors: updatedErrors,
            };
        }

        case "updateSubRank": {
            const updatedPayouts = [...state.submitterRewards.payouts];
            const oldRank = updatedPayouts[action.payload.index].rank;
            updatedPayouts[action.payload.index].rank = Number(action.payload.rank);


            const { submitterRewards, ...existingErrors } = state.errors;
            const { duplicateRanks: duplicateRankErrors } = submitterRewards || {};

            // remove the first occurance of old rank from duplicate ranks if it exists
            let found = false;
            const newDuplicateRanks = duplicateRankErrors?.filter((rank: number) => {
                if (!found && rank === oldRank) {
                    found = true;
                    return false;
                }
                return true;
            });
            const updatedErrors = {
                ...existingErrors,
                ...(newDuplicateRanks?.length ?? 0 > 0 ? {
                    submitterRewards: {
                        duplicateRanks: newDuplicateRanks
                    }
                } : {})
            };

            return {
                ...state,
                submitterRewards: { ...state.submitterRewards, payouts: updatedPayouts },
                errors: updatedErrors
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
            const oldPayoutRank = state.voterRewards.payouts[action.payload].rank;
            const { voterRewards, ...existingErrors } = state.errors;
            const { duplicateRanks: duplicateRankErrors } = voterRewards || {};

            // remove the first occurance of old rank from duplicate ranks if it exists
            let found = false;
            const newDuplicateRanks = duplicateRankErrors?.filter((rank: number) => {
                if (!found && rank === oldPayoutRank) {
                    found = true;
                    return false;
                }
                return true;
            });

            const updatedErrors = {
                ...existingErrors,
                ...(newDuplicateRanks?.length ?? 0 > 0 ? {
                    voterRewards: {
                        ...voterRewards,
                        duplicateRanks: newDuplicateRanks,
                    }
                } : {})
            }

            return {
                ...state,
                voterRewards: {
                    ...state.voterRewards,
                    payouts: state.voterRewards.payouts.filter((_: any, index: number) => index !== action.payload),
                },
                errors: updatedErrors,
            };
        }


        case "updateVoterRank": {
            const updatedPayouts = [...state.voterRewards.payouts];
            const oldRank = updatedPayouts[action.payload.index].rank;
            updatedPayouts[action.payload.index].rank = Number(action.payload.rank);


            const { voterRewards, ...existingErrors } = state.errors;
            const { duplicateRanks: duplicateRankErrors } = voterRewards || {};

            // remove the first occurance of old rank from duplicate ranks if it exists
            let found = false;
            const newDuplicateRanks = duplicateRankErrors?.filter((rank: number) => {
                if (!found && rank === oldRank) {
                    found = true;
                    return false;
                }
                return true;
            });
            const updatedErrors = {
                ...existingErrors,
                ...(newDuplicateRanks?.length ?? 0 > 0 ? {
                    voterRewards: {
                        duplicateRanks: newDuplicateRanks
                    }
                } : {})
            };

            return {
                ...state,
                voterRewards: { ...state.voterRewards, payouts: updatedPayouts },
                errors: updatedErrors
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
            const { votingPolicy, ...errors } = state.errors || {};
            return {
                ...state,
                votingPolicy: [
                    ...state.votingPolicy,
                    action.payload.policy,
                ],
                errors: errors,
            };

        }

        case "removeVotingPolicy": {
            const { votingPolicy, ...errors } = state.errors || {};

            return {
                ...state,
                votingPolicy: state.votingPolicy.filter((_: any, index: number) => index !== action.payload),
                errors: errors
            };
        }

        case "updateVotingPolicy": {
            const { votingPolicy, ...errors } = state.errors || {};
            const updatedVotingPolicy = [...state.votingPolicy];
            updatedVotingPolicy[action.payload.index] = action.payload.policy;
            return { ...state, votingPolicy: updatedVotingPolicy, errors: errors };
        }

        case "setAnonSubs": return { ...state, additionalParams: { ...state.additionalParams, anonSubs: action.payload } };

        case "setVisibleVotes": return { ...state, additionalParams: { ...state.additionalParams, visibleVotes: action.payload } };

        case "setSelfVote": return { ...state, additionalParams: { ...state.additionalParams, selfVote: action.payload } };

        case "setSubLimit": return { ...state, additionalParams: { ...state.additionalParams, subLimit: action.payload } };

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
            return validateContestMetadata(state.metadata);
        case 1:
            return validateContestDeadlines(state.deadlines);
        case 2:
            return validatePrompt(state.prompt);
        case 3:
            return validateSubmitterRewards(state.submitterRewards);
        case 4:
            return validateVoterRewards(state.voterRewards);
        case 5:
            return { isError: false, errors: {} }
        case 6:
            return validateVotingPolicy(state.votingPolicy);
        case 7:
            return { isError: false, errors: {} }
    }
    return errors
}


export const validateContestMetadata = (metadata: ContestBuilderProps['metadata']) => {

    const { type, category } = metadata || {};

    const isTypeError = !type || (type !== 'standard' && type !== 'twitter');
    const isCategoryError = !category;

    const isError = isTypeError || isCategoryError;


    const errors = {
        ...(isError ? {
            metadata: {
                ...(isTypeError) ? { type: "Contest type is required" } : {},
                ...(isCategoryError) ? { category: "Contest category is required" } : {}
            }
        } : {})
    }


    return {
        isError: isError,
        errors,
        value: metadata
    }
}


export const validateContestDeadlines = (deadlines: ContestBuilderProps['deadlines']) => {

    const { snapshot, startTime, voteTime, endTime } = deadlines || {};
    const now = new Date(Date.now()).toISOString();

    // if startTime or snapshot is "now", use a new Date() object for these calculations
    const calculatedStartTime = startTime === 'now' ? now : startTime;
    const calculatedSnapshot = snapshot === 'now' ? now : snapshot;

    const calculateErrors = () => {
        let snapshotError = "";
        let startTimeError = "";
        let voteTimeError = "";
        let endTimeError = "";

        // check for null values
        if (!calculatedSnapshot) snapshotError = "snapshot date is required";
        if (!calculatedStartTime) startTimeError = "start date is required";
        if (!voteTime) voteTimeError = "vote date is required";
        if (!endTime) endTimeError = "end date is required";
        if (snapshotError || startTimeError || voteTimeError || endTimeError) return { snapshotError, startTimeError, voteTimeError, endTimeError }

        // check that dates are in the correct order
        if (calculatedSnapshot > calculatedStartTime) snapshotError = "snapshot date must be before start date";
        if (calculatedSnapshot > now) snapshotError = "snapshot date must be in the past";
        if (voteTime <= calculatedStartTime) voteTimeError = "vote date must be after start date";
        if (endTime <= voteTime) endTimeError = "end date must be after vote date";
        if (endTime <= calculatedStartTime) endTimeError = "end date must be after start date";

        return { snapshotError, startTimeError, voteTimeError, endTimeError }

    }

    const { snapshotError, startTimeError, voteTimeError, endTimeError } = calculateErrors();

    const isError = !!(startTimeError || voteTimeError || endTimeError || snapshotError);

    const errors = {
        ...(isError ? {
            deadlines: {
                ...(snapshotError ? { snapshot: snapshotError } : {}),
                ...(startTimeError ? { startTime: startTimeError } : {}),
                ...(voteTimeError ? { voteTime: voteTimeError } : {}),
                ...(endTimeError ? { endTime: endTimeError } : {}),
            }
        } : {})
    }

    const cleanedDeadlines = {
        snapshot: calculatedSnapshot,
        startTime: calculatedStartTime,
        voteTime,
        endTime
    }

    return {
        errors,
        isError: isError,
        value: cleanedDeadlines
    };
}


export const validatePrompt = (prompt: ContestBuilderProps['prompt']) => {

    const isTitle = prompt.title.length > 0;
    const isBody = prompt.body?.blocks?.length ?? 0 > 0;

    const pattern = /^https:\/\/calabara\.mypinata\.cloud\/ipfs\/[a-zA-Z0-9]+/;

    const isValidCoverUrl = prompt?.coverUrl ? pattern.test(prompt.coverUrl) : true;
    const isValidBody = prompt.body?.blocks?.length ?? 0 > 0;

    const isError = !isTitle || !isBody || !isValidCoverUrl;

    const errors = {
        ...(isError ? {
            prompt: {
                ...(isTitle ? {} : { title: "Prompt title is required" }),
                ...(isBody ? {} : { body: "Prompt body is required" }),
                ...(isValidCoverUrl ? {} : { coverUrl: "Image is not valid" }),
            }
        } : {})
    }

    return {
        isError: isError,
        errors: errors,
        value: {
            title: prompt.title,
            body: prompt.body,
            ...(prompt.coverUrl ? { coverUrl: prompt.coverUrl } : {})
        }
    }
}


export const validateSubmitterRewards = (submitterRewards: ContestBuilderProps['submitterRewards']) => {


    const duplicateRanks: number[] = [];
    const seenRanks: number[] = [];

    const payouts = submitterRewards.payouts;
    const ranks = payouts ? payouts.map((payout) => payout.rank) : [];
    ranks.forEach((rank, index) => {
        if (seenRanks.includes(rank)) {
            duplicateRanks.push(rank);
        } else {
            seenRanks.push(rank);
        }
    });


    const isError = duplicateRanks.length > 0;

    const errors = {
        ...(isError ?
            {
                submitterRewards: {
                    duplicateRanks: duplicateRanks,
                }
            } : {}),
    }

    return {
        errors,
        isError: isError,
        value: cleanSubmitterRewards(submitterRewards)
    };
};

export const validateVoterRewards = (voterRewards: ContestBuilderProps['voterRewards']) => {

    const duplicateRanks: number[] = [];
    const seenRanks: number[] = [];

    const payouts = voterRewards.payouts;
    const ranks = payouts ? payouts.map((payout) => payout.rank) : [];

    ranks.forEach((rank, index) => {
        if (seenRanks.includes(rank)) {
            duplicateRanks.push(rank);
        } else {
            seenRanks.push(rank);
        }
    });
    const isError = duplicateRanks.length > 0;

    const errors = {
        ...(isError ?
            {
                voterRewards: {
                    duplicateRanks: duplicateRanks,
                }
            } : {}),
    }

    return {
        errors,
        isError: isError,
        value: cleanVoterRewards(voterRewards)
    };
};

export const validateVotingPolicy = (votingPolicy: ContestBuilderProps['votingPolicy']) => {
    // set an error if the voting policy is not set

    const isError = !votingPolicy.length || votingPolicy.length === 0;
    const errors = {
        ...(isError ? {
            votingPolicy: "Voting policy is required"
        } : {}),
    }


    return {
        errors,
        isError: isError,
        value: votingPolicy
    }
}


export const validateAllContestBuilderProps = (contestBuilderProps: ContestBuilderProps) => {

    const { metadata, deadlines, prompt, submitterRewards, submitterRestrictions, voterRewards, votingPolicy, additionalParams } = contestBuilderProps;

    const contestMetadataValidation = validateContestMetadata(metadata);
    const deadlineValidation = validateContestDeadlines(deadlines);
    const promptValidation = validatePrompt(prompt);
    const subRewardValidation = validateSubmitterRewards(submitterRewards);
    const voterRewardValidation = validateVoterRewards(voterRewards);
    const votingPolicyValidation = validateVotingPolicy(votingPolicy);

    const isError = contestMetadataValidation.isError || deadlineValidation.isError || promptValidation.isError || subRewardValidation.isError || voterRewardValidation.isError || votingPolicyValidation.isError;

    const errors = {
        ...(isError ? {
            ...(contestMetadataValidation.isError ? contestMetadataValidation.errors : {}),
            ...(deadlineValidation.isError ? deadlineValidation.errors : {}),
            ...(promptValidation.isError ? promptValidation.errors : {}),
            ...(subRewardValidation.isError ? subRewardValidation.errors : {}),
            ...(voterRewardValidation.isError ? voterRewardValidation.errors : {}),
            ...(votingPolicyValidation.isError ? votingPolicyValidation.errors : {}),
        } : {})
    }

    return {
        errors,
        isError: isError,
        values: {
            metadata: contestMetadataValidation.value,
            deadlines: deadlineValidation.value,
            prompt: promptValidation.value,
            submitterRewards: subRewardValidation.value,
            voterRewards: voterRewardValidation.value,
            submitterRestrictions: submitterRestrictions,
            votingPolicy: votingPolicyValidation.value,
            additionalParams: additionalParams
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
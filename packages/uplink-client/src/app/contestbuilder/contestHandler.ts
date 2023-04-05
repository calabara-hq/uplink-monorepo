import { IToken, IERCToken, INativeToken } from "@/types/token";

export type RewardOption = IToken & {
    selected: boolean;
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
    submitterRewardOptions: RewardOption[];
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

        case "addSubmitterRewardOption":
            return {
                ...state,
                submitterRewardOptions: [...state.submitterRewardOptions, action.payload],
            };

        case "swapSubmitterRewardOption":
            // swap the reward with same type as payload
            return {
                ...state,
                submitterRewardOptions: state.submitterRewardOptions.map((reward: RewardOption) => {
                    if (reward.type === action.payload.type) {
                        return action.payload;
                    }
                    return reward;
                }),
            };

        case "toggleSubmitterRewardOption":
            // set selet for reward with same type as payload
            return {
                ...state,
                submitterRewardOptions: state.submitterRewardOptions.map((reward: RewardOption) => {
                    if (reward.type === action.payload.type) {
                        return { ...reward, selected: action.payload.selected };
                    }
                    return reward;
                }),
            };

        case "setErrors":
            return {
                ...state,
                errors: { ...state.errors, ...action.payload },
            }
        default:
            return state;
    }
}


/**
 * submitter reward options -> add / swap
 * selected submitter rewards -> add / swap / remove
 * 
 * OR
 * 
 * submitter reward options -> add / swap
 */
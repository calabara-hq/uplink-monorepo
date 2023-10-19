import { ContestBuilderProps, ThreadItem } from "../__generated__/resolvers-types";
import { TwitterThread, TwitterThreadSchema } from "../types/writeTweet.js";
import {
    ContestAdditionalParams,
    ContestAdditionalParamsSchema,
    ContestDeadlines,
    ContestDeadlinesSchema,
    ContestMetadata,
    ContestMetadataSchema,
    ContestPromptData,
    ContestPromptDataSchema,
    ContestSubmitterRestrictions,
    ContestSubmitterRestrictionsSchema,
    ContestSubmitterRewards,
    ContestSubmitterRewardsSchema,
    ContestVoterRewards,
    ContestVoterRewardsSchema,
    ContestVotingPolicy,
    ContestVotingPolicySchema,
    WritableContest,
    writableContestSchema
} from "../types/writeContest.js";

export const validateMetadata = (metadata: ContestMetadata): ContestMetadata => {
    return ContestMetadataSchema.parse(metadata);
}

export const validateDeadlines = (deadlines: ContestDeadlines): ContestDeadlines => {
    return ContestDeadlinesSchema.parse(deadlines);
}

export const validatePrompt = (prompt: ContestPromptData): ContestPromptData => {
    return ContestPromptDataSchema.parse(prompt);
}

export const validateSubmitterRewards = async (submitterRewards: ContestSubmitterRewards): Promise<ContestSubmitterRewards> => {
    return ContestSubmitterRewardsSchema.parseAsync(submitterRewards);
}

export const validateVoterRewards = async (voterRewards: ContestVoterRewards): Promise<ContestVoterRewards> => {
    return ContestVoterRewardsSchema.parseAsync(voterRewards);
}

export const validateSubmitterRestrictions = async (submitterRestrictions: ContestSubmitterRestrictions): Promise<ContestSubmitterRestrictions> => {
    return ContestSubmitterRestrictionsSchema.parseAsync(submitterRestrictions);
}

export const validateVotingPolicy = async (votingPolicy: ContestVotingPolicy): Promise<ContestVotingPolicy> => {
    return ContestVotingPolicySchema.parseAsync(votingPolicy);
}

export const validateAdditionalParams = (additionalParams: ContestAdditionalParams): ContestAdditionalParams => {
    return ContestAdditionalParamsSchema.parse(additionalParams)
}

export const validateTweetThread = (tweetThread: ThreadItem[]): TwitterThread => {
    return TwitterThreadSchema.parse(tweetThread);
}

export const validateContestData = async (contest: ContestBuilderProps): Promise<WritableContest> => {
    return writableContestSchema.parseAsync(contest);
}
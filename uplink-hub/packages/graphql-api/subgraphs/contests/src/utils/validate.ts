import { CreateContestData, ThreadItemInput } from "../__generated__/resolvers-types";
import { TwitterThread, TwitterThreadSchema } from "../types/writeTweet.js";
import {
    ContestAdditionalParams,
    ContestAdditionalParamsSchema,
    ContestChainSchema,
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

export type IncomingChainId = CreateContestData["chainId"];
export type IncomingMetadata = CreateContestData["metadata"];
export type IncomingDeadlines = CreateContestData["deadlines"];
export type IncomingPrompt = CreateContestData["prompt"];
export type IncomingSubmitterRewards = CreateContestData["submitterRewards"];
export type IncomingVoterRewards = CreateContestData["voterRewards"];
export type IncomingSubmitterRestrictions = CreateContestData["submitterRestrictions"];
export type IncomingVotingPolicy = CreateContestData["votingPolicy"];
export type IncomingAdditionalParams = CreateContestData["additionalParams"];

export const validateChainId = (chainId: number): number => {
    return ContestChainSchema.parse(chainId);
}

export const validateMetadata = (metadata: IncomingMetadata): ContestMetadata => {
    return ContestMetadataSchema.parse(metadata);
}

export const validateDeadlines = (deadlines: IncomingDeadlines): ContestDeadlines => {
    return ContestDeadlinesSchema.parse(deadlines);
}

export const validatePrompt = (prompt: IncomingPrompt): ContestPromptData => {
    return ContestPromptDataSchema.parse(prompt);
}

export const validateSubmitterRewards = async (submitterRewards: IncomingSubmitterRewards): Promise<ContestSubmitterRewards> => {
    return ContestSubmitterRewardsSchema.parseAsync(submitterRewards);
}

export const validateVoterRewards = async (voterRewards: IncomingVoterRewards): Promise<ContestVoterRewards> => {
    return ContestVoterRewardsSchema.parseAsync(voterRewards);
}

export const validateSubmitterRestrictions = async (submitterRestrictions: IncomingSubmitterRestrictions): Promise<ContestSubmitterRestrictions> => {
    return ContestSubmitterRestrictionsSchema.parseAsync(submitterRestrictions);
}

export const validateVotingPolicy = async (votingPolicy: IncomingVotingPolicy): Promise<ContestVotingPolicy> => {
    return ContestVotingPolicySchema.parseAsync(votingPolicy);
}

export const validateAdditionalParams = (additionalParams: IncomingAdditionalParams): ContestAdditionalParams => {
    return ContestAdditionalParamsSchema.parse(additionalParams)
}

export const validateContestData = async (contest: CreateContestData): Promise<WritableContest> => {
    return writableContestSchema.parseAsync(contest);
}

export const validateTweetThread = (tweetThread: ThreadItemInput[]): TwitterThread => {
    return TwitterThreadSchema.parse(tweetThread);
}
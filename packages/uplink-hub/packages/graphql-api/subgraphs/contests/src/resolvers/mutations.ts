
import { DecimalScalar } from "lib";
import { createDBContest } from "../utils/database.js";
import {
    validateMetadata,
    validateDeadlines,
    validatePrompt,
    validateSubmitterRestrictions,
    validateSubmitterRewards,
    validateVoterRewards,
    validateVotingPolicy,
    ContestBuilderProps,
    validateAdditionalParams
} from "../utils/validateContestParams.js";

import Decimal from 'decimal.js'

import { GraphQLError } from "graphql";

const processContestData = async (contestData: ContestBuilderProps) => {
    const { metadata, deadlines, prompt, submitterRewards, voterRewards, submitterRestrictions, votingPolicy, additionalParams } = contestData;

    const metadataResult = validateMetadata(metadata);
    const deadlinesResult = validateDeadlines(deadlines);
    const promptResult = validatePrompt(prompt);
    const submitterRewardsResult = await validateSubmitterRewards(submitterRewards);
    const voterRewardsResult = await validateVoterRewards(voterRewards);
    const submitterRestrictionsResult = await validateSubmitterRestrictions(submitterRestrictions);
    const votingPolicyResult = await validateVotingPolicy(votingPolicy);
    const additionalParamsResult = await validateAdditionalParams(additionalParams);

    const errors = {
        ...(metadataResult.error ? { metadata: metadataResult.error } : {}),
        ...(deadlinesResult.error ? { deadlines: deadlinesResult.error } : {}),
        ...(promptResult.error ? { prompt: promptResult.error } : {}),
        ...(submitterRewardsResult.error ? { submitterRewards: submitterRewardsResult.error } : {}),
        ...(voterRewardsResult.error ? { voterRewards: voterRewardsResult.error } : {}),
        ...(submitterRestrictionsResult.error ? { submitterRestrictions: submitterRestrictionsResult.error } : {}),
        ...(votingPolicyResult.error ? { votingPolicy: votingPolicyResult.error } : {}),
        ...(additionalParamsResult.error ? { additionalParams: additionalParamsResult.error } : {}),
    }

    const isSuccess = Object.keys(errors).length === 0;

    return {
        success: isSuccess,
        errors: errors,
    }
}

const mutations = {
    Mutation: {
        createContest: async (_: any, args: any, context: any) => {
            //const user = await Authorization.getUser(context);
            //if (!user) throw new Error('Unauthorized');

            const { contestData } = args;

            const result = await processContestData(contestData);

            if (result.success) {
                const data = {
                    metadata: contestData.metadata,
                    deadlines: contestData.deadlines,
                    prompt: contestData.prompt,
                    additionalParams: contestData.additionalParams,
                    submitterRewards: contestData.submitterRewards,
                    voterRewards: contestData.voterRewards,
                    submitterRestrictions: contestData.submitterRestrictions,
                }
                let contestId = await createDBContest(data)
            }

            return {
                success: result.success,
                errors: result.errors,
            }
        },
    }
}


export default mutations;

import {
    validateDeadlines,
    validatePrompt,
    validateSubmitterRestrictions,
    validateSubmitterRewards,
    validateVoterRewards,
    validateVotingPolicy,
    ContestBuilderProps
} from "../utils/validateContestParams.js";

import { GraphQLError } from "graphql";

const processContestData = async (contestData: ContestBuilderProps) => {
    const { type, deadlines, prompt, submitterRewards, voterRewards, submitterRestrictions, votingPolicy } = contestData;

    const deadlinesResult = validateDeadlines(deadlines);
    const promptResult = validatePrompt(prompt);
    const submitterRewardsResult = await validateSubmitterRewards(submitterRewards);
    const voterRewardsResult = await validateVoterRewards(voterRewards);
    const submitterRestrictionsResult = await validateSubmitterRestrictions(submitterRestrictions);
    const votingPolicyResult = await validateVotingPolicy(votingPolicy);

    const errors = {

        ...(promptResult.error ? { prompt: promptResult.error } : {}),
        ...(deadlinesResult.error ? { deadlines: deadlinesResult.error } : {}),
        ...(submitterRewardsResult.error ? { submitterRewards: submitterRewardsResult.error } : {}),
        ...(voterRewardsResult.error ? { voterRewards: voterRewardsResult.error } : {}),
        ...(submitterRestrictionsResult.error ? { submitterRestrictions: submitterRestrictionsResult.error } : {}),
        ...(votingPolicyResult.error ? { votingPolicy: votingPolicyResult.error } : {}),
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

            return {
                success: result.success,
                errors: result.errors,
            }
        },
    }
}


export default mutations;
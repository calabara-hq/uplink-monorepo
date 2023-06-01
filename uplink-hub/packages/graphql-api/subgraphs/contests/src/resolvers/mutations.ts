
import { AuthorizationController, schema } from "lib";
import { createDbContest } from "../utils/database.js";
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

import { GraphQLError } from "graphql";
import { sqlOps, db } from '../utils/database.js';

import dotenv from 'dotenv';
dotenv.config();

const authController = new AuthorizationController(process.env.REDIS_URL);

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


const verifyUserIsAdmin = async (user: any, spaceId: string) => {
    const isAdmin = await db.select({ id: schema.admins.id })
        .from(schema.admins)
        .where(
            sqlOps.and(
                sqlOps.eq(schema.admins.spaceId, parseInt(spaceId)),
                sqlOps.eq(schema.admins.address, user.address)
            )
        )

    return isAdmin.length > 0

}

const mutations = {
    Mutation: {
        createContest: async (_: any, args: any, context: any) => {
            const user = await authController.getUser(context);
            if (!user) throw new Error('Unauthorized');

            console.log(user)

            const isSpaceAdmin = await verifyUserIsAdmin(user, args.contestData.spaceId)
            if (!isSpaceAdmin) throw new Error('Unauthorized');


            const { contestData } = args;


            if (contestData.metadata.type === 'twitter') {
                const now = new Date().toISOString();
                const isTwitterAuth = (user?.twitter?.accessToken ?? null) && (user?.twitter?.expiresAt ?? now > now);

                if (!isTwitterAuth) return {
                    success: false,
                    contestId: null,
                    errors: {
                        twitter: "account is unauthorized"
                    }
                }
            }

            const result = await processContestData(contestData);

            let contestId

            if (result.success) {
                const data = {
                    spaceId: contestData.spaceId,
                    metadata: contestData.metadata,
                    deadlines: contestData.deadlines,
                    prompt: contestData.prompt,
                    additionalParams: contestData.additionalParams,
                    submitterRewards: contestData.submitterRewards,
                    voterRewards: contestData.voterRewards,
                    submitterRestrictions: contestData.submitterRestrictions,
                    votingPolicy: contestData.votingPolicy,
                }
                contestId = await createDbContest(data, user)
            } else {
                contestId = null
            }

            return {
                success: result.success,
                errors: result.errors,
                contestId: contestId,
            }
        },
    }
}


export default mutations;
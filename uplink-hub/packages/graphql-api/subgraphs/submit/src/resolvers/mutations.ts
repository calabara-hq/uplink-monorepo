import { GraphQLError } from "graphql";
import { AuthorizationController } from "lib";
import dotenv from "dotenv";
import { SubmissionPayload, TwitterSubmissionPayload } from "../__generated__/resolvers-types.js";
import { validateStandardSubmissionPayload, validateTwitterSubmissionPayload } from "../utils/validate.js";
import { createStandardSubmission, createTwitterSubmission } from "../utils/insert.js";
dotenv.config();

const authController = new AuthorizationController(process.env.REDIS_URL!);

const mutations = {
    Mutation: {
        createSubmission: async (_: any, { contestId, submission }: { contestId: string, submission: SubmissionPayload }, context: any) => {
            const user = await authController.getUser(context);
            if (!user) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })

            const validPayload = await validateStandardSubmissionPayload(submission);
            return createStandardSubmission(user, parseInt(contestId), validPayload);
        },

        createTwitterSubmission: async (_: any, { contestId, submission }: { contestId: string, submission: TwitterSubmissionPayload }, context: any) => {
            const user = await authController.getUser(context);
            if (!user || !user.twitter) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })

            let validPayload = await validateTwitterSubmissionPayload(submission);
            return createTwitterSubmission(user, parseInt(contestId), validPayload);
        }
    },
};

export default mutations;

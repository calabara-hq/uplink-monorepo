import { GraphQLError } from "graphql";
import { AuthorizationController, Context } from "lib";
import dotenv from "dotenv";
import { DropConfig, SubmissionPayload, TwitterSubmissionPayload } from "../__generated__/resolvers-types.js";
import { validateStandardSubmissionPayload, validateTwitterSubmissionPayload } from "../utils/validate.js";
import { createStandardSubmission, createTwitterSubmission } from "../utils/insert.js";
import createDrop from "../utils/createDrop.js";
import { createMintBoardPost } from "../utils/mintBoard.js";
import { registerMint } from "../utils/registerMint.js";
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

            const validPayload = validateStandardSubmissionPayload(submission);
            return createStandardSubmission(user, parseInt(contestId), validPayload);
        },

        createTwitterSubmission: async (_: any, { contestId, submission }: { contestId: string, submission: TwitterSubmissionPayload }, context: any) => {
            const user = await authController.getUser(context);

            const isTwitterAuth = Boolean(user?.twitter?.accessToken)
            const isTwitterExpired = (new Date(user?.twitter?.expiresAt ?? '1') > new Date(Date.now()));

            if (!user || !isTwitterAuth || isTwitterExpired) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })

            let validPayload = validateTwitterSubmissionPayload(submission);
            return createTwitterSubmission(user, parseInt(contestId), validPayload);
        },

        createUserDrop: async (_: any, {
            submissionId,
            contestId,
            contractAddress,
            chainId,
            dropConfig
        }: {
            submissionId: string,
            contestId: string,
            contractAddress: string,
            chainId: number,
            dropConfig: DropConfig
        }, context: any) => {
            const user = await authController.getUser(context);
            if (!user) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })

            return createDrop(user, submissionId, contestId, contractAddress, chainId, dropConfig)
        },

        createMintBoardPost: async (_: any, {
            spaceName,
            contractAddress,
            chainId,
            dropConfig
        }: {
            spaceName: string,
            contractAddress: string,
            chainId: number,
            dropConfig: DropConfig
        }, context: any) => {
            const user = await authController.getUser(context);
            if (!user) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })

            return createMintBoardPost(user, spaceName, chainId, contractAddress, dropConfig)
        },

        registerMint: async (_: any, {
            editionId,
            amount
        }: {
            editionId: string,
            amount: number
        }, context: Context) => {
            const user = await authController.getUser(context);
            if (!user) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })
            
            return registerMint(user, editionId, amount)
        }
    }
};

export default mutations;

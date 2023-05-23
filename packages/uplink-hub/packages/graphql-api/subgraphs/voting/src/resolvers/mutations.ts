import { db, sqlOps } from "../utils/database.js";
import { GraphQLError } from "graphql";
import { schema, AuthorizationController } from "lib";
import { castVotes, retractAllVotes, retractSingleVote } from "../utils/voting.js";
import dotenv from "dotenv";
dotenv.config();

const authController = new AuthorizationController(process.env.REDIS_URL);

const mutations = {
    Mutation: {
        // take in array of voting objects
        /**
        * {
        *  submissionId: number,
        *  votes: number,
        * }
        */
        castVotes: async (_: any, args: any, context: any) => {

            const user = await authController.getUser(context);
            if (!user) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })

            console.log(args.castVotesPayload);
            return castVotes(user, args.contestId, args.castVotesPayload);

        },

        removeSingleVote: async (_: any, args: any, context: any) => {
            const user = await authController.getUser(context);
            if (!user) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })

            return retractSingleVote(user, args.contestId, args.submissionId);

        },

        removeAllVotes: async (_: any, args: any, context: any) => {
            const user = await authController.getUser(context);
            if (!user) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })
            return retractAllVotes(user, args.contestId);

        }
    },
};

export default mutations;

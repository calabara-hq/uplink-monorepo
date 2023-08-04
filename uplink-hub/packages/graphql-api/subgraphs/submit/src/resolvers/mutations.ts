import { db, sqlOps } from "../utils/database.js";
import { GraphQLError } from "graphql";
import { schema, AuthorizationController } from "lib";
import { submit, twitterSubmit } from "../utils/submit.js";
import dotenv from "dotenv";
dotenv.config();

const authController = new AuthorizationController(process.env.REDIS_URL);

const mutations = {
    Mutation: {
        createSubmission: async (_: any, args: any, context: any) => {
            const user = await authController.getUser(context);
            if (!user) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })
            return submit(user, args.contestId, args.submission);
        },

        createTwitterSubmission: async (_: any, args: any, context: any) => {
            console.log('CREATING TWITTER SUBMISSION')
            const user = await authController.getUser(context);
            if (!user || !user.twitter) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })
            let result = await twitterSubmit(user, args.contestId, args.submission);
            console.log(result);
            return result;
        }
    },
};

export default mutations;

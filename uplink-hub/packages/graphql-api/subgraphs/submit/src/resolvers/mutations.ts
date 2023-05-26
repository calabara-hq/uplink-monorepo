import { db, sqlOps } from "../utils/database.js";
import { GraphQLError } from "graphql";
import { schema, AuthorizationController } from "lib";
import { submit } from "../utils/submit.js";
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

        }
    },
};

export default mutations;

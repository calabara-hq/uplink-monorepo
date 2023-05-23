import { db, sqlOps } from "../utils/database.js";
import { GraphQLError } from "graphql";
import { schema, AuthorizationController } from "lib";
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
            // calculate voting power
            // check if user has enough voting power
            // cast votes
            // update cache
            // return updated voting power parameters + all submissions voted on

        },

        retractVotes: async (_: any, args: any, context: any) => {
            // delete votes from database
            // return updated voting power parameters 
        },
    },
};

export default mutations;

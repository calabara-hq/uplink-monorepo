import { schema } from "lib";
import { sqlOps, db } from "../utils/database.js";
import { GraphQLError } from "graphql";
import { computeSubmissionParams } from "../utils/submit.js";

const queries = {
    Query: {
        getUserSubmissionParams: async (_: any, args: any, context: any) => {
            return computeSubmissionParams({ address: args.walletAddress }, parseInt(args.contestId))
        }
    },

};

export default queries
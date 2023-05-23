import { schema } from "lib";
import { sqlOps, db } from "../utils/database.js";
import { GraphQLError } from "graphql";
import { calculateUserVotingParams } from "../utils/voting.js";


const queries = {
    Query: {
        async getUserVotingParams(_: any, args: any, context: any) {
            return calculateUserVotingParams({ address: args.walletAddress }, args.contestId);
        }
    },

};

export default queries
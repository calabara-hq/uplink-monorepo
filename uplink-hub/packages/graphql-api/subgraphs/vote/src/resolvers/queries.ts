import { schema } from "lib";
import { sqlOps, db } from "../utils/database.js";
import { GraphQLError } from "graphql";
import { calculateUserVotingParams, fetchContestParams } from "../utils/voting.js";


const queries = {
    Query: {
        async getUserVotingParams(_: any, args: any, context: any) {
            const contestParams = await fetchContestParams(args.contestId);
            if (!contestParams) return {
                totalVotingPower: 0,
                votesSpent: 0,
                votesRemaining: 0,
                userVotes: [],
            }
            return calculateUserVotingParams({ address: args.walletAddress }, args.contestId, contestParams.deadlines);
        }
    },

};

export default queries
import { schema } from "lib";
import { sqlOps, db } from "../utils/database.js";
import { GraphQLError } from "graphql";
import { calculateUserVotingParams, fetchContestParams } from "../utils/voting.js";
import { AuthorizationController } from "lib";
import dotenv from "dotenv";
dotenv.config();

const authController = new AuthorizationController(process.env.REDIS_URL);

const queries = {
    Query: {
        async getUserVotingParams(_: any, args: any, context: any) {
            const { walletAddress, contestId } = args

            const user = walletAddress ? { address: walletAddress } : await authController.getUser(context);

            if (!user) throw new GraphQLError('Unknown user', {
                extensions: {
                    code: 'UNKOWN_USER'
                }
            })
            const contestParams = await fetchContestParams(contestId);
            if (!contestParams) return {
                totalVotingPower: 0,
                votesSpent: 0,
                votesRemaining: 0,
                userVotes: [],
            }
            return calculateUserVotingParams(user, contestId, contestParams.deadlines);
        }
    },

};

export default queries
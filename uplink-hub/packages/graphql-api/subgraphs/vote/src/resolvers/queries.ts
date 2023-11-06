import { GraphQLError } from "graphql";
import { calculateUserVotingParams, fetchContestParams } from "../utils/voting.js";
import { AuthorizationController } from "lib";
import dotenv from "dotenv";
dotenv.config();

const authController = new AuthorizationController(process.env.REDIS_URL);

const queries = {
    Query: {
        async getUserVotingParams(_: any, args: any, context: any) {
            const { contestId } = args

            const user = await authController.getUser(context);
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
            return calculateUserVotingParams(user, contestId, contestParams.deadlines, contestParams.chainId);
        }
    },

};

export default queries
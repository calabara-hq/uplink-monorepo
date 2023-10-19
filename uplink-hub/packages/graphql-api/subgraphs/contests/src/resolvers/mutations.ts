
import { AuthorizationController, schema, Context } from "lib";
import { GraphQLError } from "graphql";
import { sqlOps, db, dbSingleContestById, dbIsContestTweetQueued, dbIsUserSpaceAdmin } from '../utils/database.js';
import dotenv from 'dotenv';
import { validateContestData, validateTweetThread } from "../utils/validate.js";
import { insertContest, queueTweet } from "../utils/insert.js";
import { ContestBuilderProps, ThreadItem } from "../__generated__/resolvers-types.js";

dotenv.config();

const authController = new AuthorizationController(process.env.REDIS_URL!);

const throwMutationError = (code: string) => {

    const codeTable: { [key: string]: string } = {
        "UNAUTHORIZED": "Unauthorized",
        "CONTEST_DOES_NOT_EXIST": "Contest does not exist",
        "NOT_TWITTER_CONTEST": "Contest is not a twitter contest",
        "CONTEST_TWEET_EXISTS": "Contest already has a tweet",
        "CONTEST_TWEET_QUEUED": "Contest tweet already queued"
    }

    if (codeTable[code]) throw new GraphQLError(codeTable[code], {
        extensions: {
            code
        }
    })

    else {
        throw new GraphQLError("Unknown error", {
            extensions: {
                code: "UNKNOWN"
            }
        })
    }
}



const mutations = {
    Mutation: {
        createContest: async (_: any, args: { spaceId: string, contestData: ContestBuilderProps }, context: any) => {

            const { spaceId, contestData } = args;

            const user = await authController.getUser(context);
            if (!user) throwMutationError('UNAUTHORIZED')

            const isSpaceAdmin = await dbIsUserSpaceAdmin(user, parseInt(args.spaceId))
            if (!isSpaceAdmin) throwMutationError('UNAUTHORIZED')

            const validContestData = await validateContestData(contestData);
            try {
                const contestId = await insertContest(parseInt(spaceId), validContestData)
                return { success: true, contestId }
            } catch (e) {
                return { success: false, contestId: null }
            }
        },

        createContestTweet: async (_: any, args: { contestId: string, spaceId: string, tweetThread: ThreadItem[] }, context: Context) => {

            const user = await authController.getUser(context);
            const isTwitterAuth = (user?.twitter?.accessToken ?? null) && (user?.twitter?.accessSecret ?? null);
            if (!user || !isTwitterAuth) throwMutationError('UNAUTHORIZED')

            const isSpaceAdmin = await dbIsUserSpaceAdmin(user, parseInt(args.spaceId))
            if (!isSpaceAdmin) throwMutationError('UNAUTHORIZED')

            const contest = await dbSingleContestById(parseInt(args.contestId))
            if (!contest) throwMutationError('CONTEST_DOES_NOT_EXIST')
            if (contest.metadata.type !== 'twitter') throwMutationError('NOT_TWITTER_CONTEST')
            if (contest.tweetId) throwMutationError('CONTEST_TWEET_EXISTS')

            const tweetQueuedResult = await dbIsContestTweetQueued(parseInt(args.contestId))
            if (tweetQueuedResult) throwMutationError('CONTEST_TWEET_QUEUED')

            const validThread = validateTweetThread(args.tweetThread);

            try {
                await queueTweet(contest.id, user, contest.startTime, validThread)
                return { success: true }
            } catch (e) {
                console.log(e)
                return { success: false }
            }
        },
    },



}


export default mutations;
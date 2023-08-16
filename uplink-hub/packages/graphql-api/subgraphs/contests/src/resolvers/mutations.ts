
import { AuthorizationController, schema } from "lib";
import { createDbContest, queueTweet } from "../utils/database.js";
import {
    validateContestParams, validateTweetThread
} from "../utils/validateContestParams.js";

import { GraphQLError } from "graphql";
import { sqlOps, db } from '../utils/database.js';

import dotenv from 'dotenv';
import { dbContestTweetQueue, dbSingleContestById } from "./queries.js";
dotenv.config();

const authController = new AuthorizationController(process.env.REDIS_URL);


const verifyUserIsAdmin = async (user: any, spaceId: string) => {
    const isAdmin = await db.select({ id: schema.admins.id })
        .from(schema.admins)
        .where(
            sqlOps.and(
                sqlOps.eq(schema.admins.spaceId, parseInt(spaceId)),
                sqlOps.eq(schema.admins.address, user.address)
            )
        )

    return isAdmin.length > 0

}

const mutations = {
    Mutation: {
        createContest: async (_: any, args: any, context: any) => {
            const user = await authController.getUser(context);
            if (!user) throw new Error('Unauthorized');
            const isSpaceAdmin = await verifyUserIsAdmin(user, args.contestData.spaceId)
            if (!isSpaceAdmin) throw new Error('Unauthorized');

            const { contestData } = args;
            const result = await validateContestParams(contestData);
            let contestId

            if (result.success) {
                const data = {
                    spaceId: contestData.spaceId,
                    metadata: contestData.metadata,
                    deadlines: contestData.deadlines,
                    prompt: contestData.prompt,
                    additionalParams: contestData.additionalParams,
                    submitterRewards: contestData.submitterRewards,
                    voterRewards: contestData.voterRewards,
                    submitterRestrictions: contestData.submitterRestrictions,
                    votingPolicy: contestData.votingPolicy,
                }
                contestId = await createDbContest(data, user)
            } else {
                contestId = null
            }

            return {
                success: result.success,
                errors: result.errors,
                contestId: contestId,
            }
        },
        createContestTweet: async (_: any, args: any, context: any) => {
            const user = await authController.getUser(context);
            const isTwitterAuth = (user?.twitter?.accessToken ?? null) && (user?.twitter?.accessSecret ?? null);

            if (!user || !isTwitterAuth) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })
            const isSpaceAdmin = await verifyUserIsAdmin(user, args.spaceId)

            if (!isSpaceAdmin) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })

            const contest = await dbSingleContestById.execute({ contestId: args.contestId })

            if (!contest) throw new GraphQLError('Contest not found', {
                extensions: {
                    code: 'CONTEST_DOES_NOT_EXIST'
                }
            })
            if (contest.metadata.type !== 'twitter') throw new GraphQLError('Contest is not a twitter contest', {
                extensions: {
                    code: 'NOT_TWITTER_CONTEST'
                }
            })
            if (contest.tweetId) throw new GraphQLError('Contest already has a tweet', {
                extensions: {
                    code: 'CONTEST_TWEET_EXISTS'
                }
            })

            const tweetQueuedResult = await dbContestTweetQueue.execute({ contestId: args.contestId })
            if (tweetQueuedResult) throw new GraphQLError('Contest tweet already queued', {
                extensions: {
                    code: 'CONTEST_TWEET_QUEUED'
                }
            })


            const { cleanPayload, errors, success } = validateTweetThread(args.tweetThread);

            if (success) {
                await queueTweet(contest.id, user, contest.startTime, cleanPayload);
                return { success: true }
            }

            else if (!success) {
                return {
                    success,
                    errors
                }
            }

        },
    },



}


export default mutations;
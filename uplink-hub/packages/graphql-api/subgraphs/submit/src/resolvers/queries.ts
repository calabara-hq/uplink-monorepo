import { sqlOps, db } from "../utils/database.js";
import { GraphQLError } from "graphql";
import { computeSubmissionParams } from "../utils/submit.js";
import { AuthorizationController, schema } from "lib";
import dotenv from 'dotenv'
dotenv.config();

const authController = new AuthorizationController(process.env.REDIS_URL);


const singleSubmissionById = async (id: string) => {
    const submissionId = parseInt(id);
    const result = await db.select({
        id: schema.submissions.id,
        contestId: schema.submissions.contestId,
        author: schema.submissions.author,
        created: schema.submissions.created,
        type: schema.submissions.type,
        url: schema.submissions.url,
        version: schema.submissions.version,
    })
        .from(schema.submissions)
        .where(sqlOps.eq(schema.submissions.id, submissionId));
    return result[0];
}

const submissionsByContestId = async (id: string) => {
    const contestId = parseInt(id);
    const result = await db.select({
        id: schema.submissions.id,
        contestId: schema.submissions.contestId,
        author: schema.submissions.author,
        created: schema.submissions.created,
        type: schema.submissions.type,
        url: schema.submissions.url,
        version: schema.submissions.version,
    })
        .from(schema.submissions)
        .where(sqlOps.eq(schema.submissions.contestId, contestId));
    return result;
}


// take a random sample of 20 submissions that recieved more than 5 vote instances (not vote amount)
const getPopularSubmissions = async () => {


    // get submissions that recieved more than 5 unique vote instances (not vote amount)
    const submissionIds = await db.select({
        submissionId: schema.votes.submissionId,
    }).from(schema.votes)
        .groupBy(schema.votes.submissionId)
        .having(sqlOps.gt(sqlOps.sql<number>`count(*)`, -1))
        .then(res => res.map(el => el.submissionId))



    if (submissionIds.length > 0) {
        // extract the details only for submissions in which the contest has ended, and take a random sample of 20
        const submissions = await db.select({
            id: schema.submissions.id,
            created: schema.submissions.created,
            type: schema.submissions.type,
            contestId: schema.submissions.contestId,
            author: schema.submissions.author,
            url: schema.submissions.url,
            version: schema.submissions.version,
            contestCategory: schema.contests.category,
            spaceName: schema.spaces.name,
            spaceDisplayName: schema.spaces.displayName,
        }).from(schema.submissions)
            .leftJoin(schema.contests, sqlOps.eq(schema.submissions.contestId, schema.contests.id))
            .leftJoin(schema.spaces, sqlOps.eq(schema.contests.spaceId, schema.spaces.id))
            .where(sqlOps.and(
                sqlOps.inArray(schema.submissions.id, submissionIds),
                sqlOps.lt(schema.contests.endTime, new Date().toISOString())
            ))
            .limit(20)

        return submissions;
    } else {
        return [];
    }
}

const queries = {
    Query: {
        async getUserSubmissionParams(_, { walletAddress, contestId }, contextValue, info) {

            const user = walletAddress ? { address: walletAddress } : await authController.getUser(contextValue);
            if (!user) throw new GraphQLError('Unknown user', {
                extensions: {
                    code: 'UNKOWN_USER'
                }
            })
            return computeSubmissionParams(user, parseInt(contestId))
        },

        async submission(_, { submissionId }, contextValue, info) {
            return singleSubmissionById(submissionId);
        },

        async popularSubmissions(_, { submissionId }, contextValue, info) {
            return getPopularSubmissions();
        },
    },

    Contest: {
        submissions(contest) {
            console.log('here we are!!')
            return submissionsByContestId(contest.id)
        }
    }

};

export default queries
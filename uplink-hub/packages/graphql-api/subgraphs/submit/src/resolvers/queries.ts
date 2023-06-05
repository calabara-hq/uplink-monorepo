import { schema } from "lib";
import { sqlOps, db } from "../utils/database.js";
import { GraphQLError } from "graphql";
import { computeSubmissionParams } from "../utils/submit.js";



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

const queries = {
    Query: {
        async getUserSubmissionParams(_, { walletAddress, contestId }, contextValue, info) {
            return computeSubmissionParams({ address: walletAddress }, parseInt(contestId))
        },

        async submission(_, { submissionId }, contextValue, info) {
            return singleSubmissionById(submissionId);
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
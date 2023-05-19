import { db, sqlOps } from "../utils/database.js";
import { GraphQLError } from "graphql";
import dotenv from 'dotenv';
import { schema } from "lib";
dotenv.config();



const fetchVotingPolicy = async (contestId: number) => {
    const votingPolicy = await db.select({
        id: schema.votingPolicy.id,
        contestId: schema.votingPolicy.contestId,
        strategyType: schema.votingPolicy.strategyType,
        arcadeVotingPolicy: {
            ...schema.arcadeVotingStrategy,
            token: schema.tokens
        } as any,
        weightedVotingPolicy: {
            ...schema.weightedVotingStrategy,
            token: schema.tokens
        } as any
    })
        .from(schema.votingPolicy)
        .leftJoin(schema.arcadeVotingStrategy, sqlOps.eq(schema.arcadeVotingStrategy.votingPolicyId, schema.votingPolicy.id))
        .leftJoin(schema.weightedVotingStrategy, sqlOps.eq(schema.weightedVotingStrategy.votingPolicyId, schema.votingPolicy.id))
        .leftJoin(schema.tokens, sqlOps.eq(schema.tokens.id, schema.arcadeVotingStrategy.tokenLink))
        .where(sqlOps.eq(schema.votingPolicy.contestId, contestId));

    return votingPolicy
}

const fetchDeadlines = async (contestId: number) => {
    const deadlines = await db.select({
        deadlines: {
            snapshot: schema.contests.snapshot,
            voteTime: schema.contests.voteTime,
            endTime: schema.contests.endTime,
        }
    })
        .from(schema.contests)
        .where(sqlOps.eq(schema.contests.id, contestId));

    return deadlines[0];
}

const calculateVotingPower = async (user: any, contestId: any) => {
    if (!user || !user.address) return 0;

    const [votingPolicy, snapshot] = await Promise.all([
        fetchVotingPolicy(contestId),
        fetchDeadlines(contestId)
    ]);

    if (!votingPolicy || !snapshot) return 0;

    await Promise.all(votingPolicy.map(async (policy: any) => {
        if (policy.strategyType === "arcade") {
            //const {}
        } else if (policy.strategyType === "weighted") {

        }
    }));

}




const mutations = {
    Mutation: {

        castVotes: async (_: any, args: any, context: any) => {

        },

        retractVotes: async (_: any, args: any, context: any) => {

        },
    },
};

export default mutations;

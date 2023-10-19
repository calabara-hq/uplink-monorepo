import { IToken, schema } from "lib";
import { ArcadeVotingStrategySchema, ContestFungibleTokenRewardSchema, ContestNonFungibleTokenRewardSchema, ContestSubmitterRestrictions, ContestSubmitterRewards, ContestVoterRewards, ContestVotingPolicy, WeightedVotingStrategySchema } from "../types/writeContest.js";
import { z } from 'zod';
import { VerifiedTokenSchema } from "../types/writeToken.js";
import { InsertedTokenCache } from "./insert.js";

export const djb2Hash = (str: string): number => {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
}

export const ExtractedTokenCacheSchema = z.record(VerifiedTokenSchema)
export type ExtractedTokenCache = z.infer<typeof ExtractedTokenCacheSchema>

// extract tokens from contest data and return as a records object
export const extractTokens = (
    submitterRewards: ContestSubmitterRewards,
    voterRewards: ContestVoterRewards,
    submitterRestrictions: ContestSubmitterRestrictions,
    votingPolicy: ContestVotingPolicy
): ExtractedTokenCache => {

    const { payouts: subPayouts, ...subPayoutTokens } = submitterRewards;
    const { payouts: voterPayouts, ...voterPayoutTokens } = voterRewards;
    const subRestrictionTokens = submitterRestrictions.map(({ token }) => token);
    const votingPolicyTokens = votingPolicy.map(({ token }) => token);

    const tokenRecords: ExtractedTokenCache = {};

    const addTokenRecords = (tokens: IToken[]) => {
        for (const token of tokens) {
            const tokenHash = djb2Hash(JSON.stringify(token));
            tokenRecords[tokenHash] = token
        }
    }

    addTokenRecords(Object.values(subPayoutTokens))
    addTokenRecords(Object.values(voterPayoutTokens))
    addTokenRecords(subRestrictionTokens)
    addTokenRecords(votingPolicyTokens)
    return tokenRecords;
}

export const PreparedRewardsSchema = z.array(z.object({
    rank: z.number(),
    tokenLink: z.number(),
    value: z.union([ContestFungibleTokenRewardSchema, ContestNonFungibleTokenRewardSchema])
}))
export type PreparedRewards = z.infer<typeof PreparedRewardsSchema>


export const prepareRewards = (rewards: ContestSubmitterRewards | ContestVoterRewards, insertedTokenCache: InsertedTokenCache): PreparedRewards => {
    const { payouts, ...tokenDefs } = rewards;
    if (!payouts) return [];

    const output: PreparedRewards = [];

    for (const payout of payouts) {
        const { rank, ...tokenKeys } = payout;
        for (const [tokenType, value] of Object.entries(tokenKeys)) {
            const token = tokenDefs[tokenType as keyof typeof tokenDefs];
            const tokenLink = insertedTokenCache[djb2Hash(JSON.stringify(token))].dbTokenId;
            output.push({
                rank,
                tokenLink,
                value
            })
        }
    }
    return output;
}

export const PreparedRestrictionsSchema = z.array(z.object({
    tokenLink: z.number(),
    threshold: z.string()
}))
export type PreparedRestrictions = z.infer<typeof PreparedRestrictionsSchema>

export const prepareRestrictions = (restrictions: ContestSubmitterRestrictions, insertedTokenCache: InsertedTokenCache): PreparedRestrictions => {
    const output: PreparedRestrictions = [];
    for (const restriction of restrictions) {
        const { token, threshold } = restriction;
        const tokenLink = insertedTokenCache[djb2Hash(JSON.stringify(token))].dbTokenId;
        output.push({
            tokenLink,
            threshold
        })
    }
    return output;
}

export const PreparedVotingPolicySchema = z.array(z.object({
    tokenLink: z.number(),
    strategy: z.union([ArcadeVotingStrategySchema, WeightedVotingStrategySchema]),
}))

export type PreparedVotingPolicy = z.infer<typeof PreparedVotingPolicySchema>

export const prepareVotingPolicy = (policy: ContestVotingPolicy, insertedTokenCache: InsertedTokenCache): PreparedVotingPolicy => {
    const output: PreparedVotingPolicy = [];

    for (const { token, ...rest } of policy) {
        const tokenLink = insertedTokenCache[djb2Hash(JSON.stringify(token))].dbTokenId;
        output.push({
            tokenLink,
            ...rest
        })
    }

    return output;
}

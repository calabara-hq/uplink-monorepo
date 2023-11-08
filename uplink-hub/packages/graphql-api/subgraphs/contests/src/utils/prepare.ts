import { IToken, schema } from "lib";
import { ArcadeVotingStrategySchema, ContestFungibleTokenRewardSchema, ContestNonFungibleTokenRewardSchema, ContestSubmitterRestrictions, ContestSubmitterRewards, ContestVoterRewards, ContestVotingPolicy, WeightedVotingStrategySchema } from "../types/writeContest.js";
import { z } from 'zod';
import { VerifiedTokenSchema } from "../types/writeToken.js";
import { InsertedTokenCache } from "./insert.js";

// serialize a token object into an ordered string for hashing
const serialize = (token: IToken): string => {
    // A type assertion to let TypeScript know we're sure about what keys we're accessing
    const tokenAsAny = token as any;

    const sortedKeys = Object.keys(token).sort();
    const serialized = sortedKeys
        .map(key => {
            const value = tokenAsAny[key];
            if (value !== undefined && value !== null) {
                return `${key}:${JSON.stringify(value)}`;
            }
            return '';
        })
        .filter(part => part.length > 0) // Remove empty strings resulting from undefined or null values
        .join('|');

    return serialized;
};

export const djb2Hash = (token: IToken): string => {
    const ser = serialize(token);
    let hash = 5381;
    for (let i = 0; i < ser.length; i++) {
        hash = (hash * 33) ^ ser.charCodeAt(i);
    }
    return (hash >>> 0).toString(16);
};
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
            const tokenHash = djb2Hash(token);
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
            if (token) {
                const tokenLink = insertedTokenCache[djb2Hash(token)].dbTokenId;
                output.push({
                    rank,
                    tokenLink,
                    value
                })
            }
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
        const tokenLink = insertedTokenCache[djb2Hash(token)].dbTokenId;
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
        const tokenLink = insertedTokenCache[djb2Hash(token)].dbTokenId;
        output.push({
            tokenLink,
            ...rest
        })
    }

    return output;
}
import { DatabaseController, schema } from "lib";
import { ContestPromptData, ContestPromptDataSchema, WritableContest, isArcadeVotingStrategy, isWeightedVotingStrategy } from "../types/writeContest.js";
import { ExtractedTokenCache, PreparedRestrictions, PreparedRewards, PreparedVotingPolicy, extractTokens, prepareRestrictions, prepareRewards, prepareVotingPolicy } from "./prepare.js";
import pinataSDK from '@pinata/sdk';
import dotenv from 'dotenv';
import { z } from "zod";
import { TwitterThread } from "../types/writeTweet.js";
import { dbNewTweetQueueType } from "lib/dist/drizzle/schema.js";
import { nanoid } from 'nanoid';

dotenv.config();

const pinata = new pinataSDK({ pinataApiKey: process.env.PINATA_KEY, pinataSecretApiKey: process.env.PINATA_SECRET });

const databaseController = new DatabaseController(process.env.DATABASE_HOST!, process.env.DATABASE_USERNAME!, process.env.DATABASE_PASSWORD!);
export const db = databaseController.db;
export const sqlOps = databaseController.sqlOps;

const pinPrompt = async (promptData: ContestPromptData): Promise<string> => {
    return pinata.pinJSONToIPFS({ ...promptData, version: 'uplink-v1' }).then((result) => {
        return `https://uplink.mypinata.cloud/ipfs/${result.IpfsHash}`;
    }).catch((err) => {
        throw new Error(err);
    })
}

// update the space to token mapping in the db
const insertSpaceToken = async (spaceId: number, tokenId: number, tx: any) => {
    const existingTokenLink = await tx.select({ id: schema.spaceTokens.id })
        .from(schema.spaceTokens)
        .where(sqlOps.and(
            sqlOps.eq(schema.spaceTokens.spaceId, spaceId),
            sqlOps.eq(schema.spaceTokens.tokenLink, tokenId)
        )).first()

    if (!existingTokenLink) {
        const newSpaceToken: schema.dbNewSpaceToTokenType = {
            spaceId,
            tokenLink: tokenId
        }

        await tx.insert(schema.spaceTokens).values(newSpaceToken);
    }
}

export const InsertedTokenCacheSchema = z.record(z.object({ dbTokenId: z.number() }))
export type InsertedTokenCache = z.infer<typeof InsertedTokenCacheSchema>

export const insertUniqueTokens = async (spaceId: number, tokens: ExtractedTokenCache, tx: any): Promise<InsertedTokenCache> => {
    const insertedTokens: InsertedTokenCache = {};
    for (const extractedHash of Object.keys(tokens)) {
        if (!insertedTokens[extractedHash]) {
            // have not already inserted locally.
            // check remote existence
            const remoteToken = await tx.select({ id: schema.tokens.id }).from(schema.tokens).where(sqlOps.eq(schema.tokens.tokenHash, extractedHash)).first();
            if (remoteToken) {
                // have already inserted remotely
                insertedTokens[extractedHash] = { dbTokenId: remoteToken.id }; // add to cache
                await insertSpaceToken(spaceId, remoteToken.id, tx); // update space token mapping
            } else {
                // have not already inserted remotely. insert it.
                const newToken: schema.dbNewTokenType = {
                    ...tokens[extractedHash],
                    tokenHash: extractedHash
                }
                const insertedToken = await tx.insert(schema.tokens).values(newToken); // insert token
                insertedTokens[extractedHash] = { dbTokenId: parseInt(insertedToken.insertId) }; // add to cache
                await insertSpaceToken(spaceId, insertedToken[0], tx); // update space token mapping
            }
        }
    }
    return insertedTokens;
}

// insert rewards
const handleRewards = async (contestId: number, rewards: PreparedRewards, rewardType: 'submitter' | 'voter', tx: any) => {
    const tokenRewardsArr: schema.dbNewTokenRewardType[] = [];
    for (const reward of rewards) {
        const newReward: schema.dbNewRewardType = {
            contestId,
            rank: reward.rank,
            recipient: rewardType,
        }
        const insertedReward = await tx.insert(schema.rewards).values(newReward);
        const newTokenReward: schema.dbNewTokenRewardType = {
            rewardId: parseInt(insertedReward.insertId),
            tokenLink: reward.tokenLink,
            amount: 'amount' in reward.value ? reward.value.amount.toString() : null,
            tokenId: 'tokenId' in reward.value ? reward.value.tokenId : null,
        }
        tokenRewardsArr.push(newTokenReward);
    }
    if (tokenRewardsArr.length > 0) await tx.insert(schema.tokenRewards).values(tokenRewardsArr);
}

const handleRestrictions = async (contestId: number, restrictions: PreparedRestrictions, tx: any) => {
    const subRestrictionArr: schema.dbNewTokenRestrictionType[] = []
    for (const restriction of restrictions) {
        const newRestriction: schema.dbNewSubmitterRestrictionType = {
            contestId,
            restrictionType: "token",
        }
        const insertedRestriction = await tx.insert(schema.submitterRestrictions).values(newRestriction);

        const newTokenRestriction: schema.dbNewTokenRestrictionType = {
            restrictionId: parseInt(insertedRestriction.insertId),
            tokenLink: restriction.tokenLink,
            threshold: restriction.threshold,
        }
        subRestrictionArr.push(newTokenRestriction);
    };
    if (subRestrictionArr.length > 0) await tx.insert(schema.tokenRestrictions).values(subRestrictionArr);
}

// insert the voting policies
const handleVotingPolicy = async (contestId: number, votingPolicy: PreparedVotingPolicy, tx: any) => {

    for (const policy of votingPolicy) {
        const newPolicy: schema.dbNewVotingPolicyType = {
            contestId,
            strategyType: policy.strategy.type,
        }
        const insertedPolicy = await tx.insert(schema.votingPolicy).values(newPolicy);

        if (isArcadeVotingStrategy(policy.strategy)) {
            const newArcadeStrategy: schema.dbNewArcadeVotingStrategyType = {
                votingPolicyId: parseInt(insertedPolicy.insertId),
                tokenLink: policy.tokenLink,
                votingPower: policy.strategy.votingPower
            }

            await tx.insert(schema.arcadeVotingStrategy).values(newArcadeStrategy);
        }

        else if (isWeightedVotingStrategy(policy.strategy)) {
            const newWeightedStrategy: schema.dbNewWeightedVotingStrategyType = {
                votingPolicyId: parseInt(insertedPolicy.insertId),
                tokenLink: policy.tokenLink,
            }

            await tx.insert(schema.weightedVotingStrategy).values(newWeightedStrategy);
        }

    }
}


export const insertContest = async (spaceId: number, contestData: WritableContest): Promise<number> => {

    try {

        const extractedTokenCache = extractTokens( // extract tokens from contest data and return as a records object
            contestData.submitterRewards,
            contestData.voterRewards,
            contestData.submitterRestrictions,
            contestData.votingPolicy
        );
        const promptUrl = await pinPrompt(contestData.prompt); // pin the prompt data to IPFS

        const newContest: schema.dbNewContestType = {
            spaceId: spaceId,
            type: contestData.metadata.type,
            category: contestData.metadata.category,
            anonSubs: contestData.additionalParams.anonSubs ? 1 : 0,
            visibleVotes: contestData.additionalParams.visibleVotes ? 1 : 0,
            selfVote: contestData.additionalParams.selfVote ? 1 : 0,
            subLimit: contestData.additionalParams.subLimit,
            startTime: contestData.deadlines.startTime,
            voteTime: contestData.deadlines.voteTime,
            endTime: contestData.deadlines.endTime,
            snapshot: contestData.deadlines.snapshot,
            promptUrl: promptUrl,
            created: new Date().toISOString(),
            tweetId: null
        }

        return await db.transaction(async (tx: any) => {
            const contest = await tx.insert(schema.contests).values(newContest); // insert the contest
            const insertedTokenCache = await insertUniqueTokens(spaceId, extractedTokenCache, tx); // insert the extracted tokens and return a recordset of id's

            const submitterRewards = prepareRewards(contestData.submitterRewards, insertedTokenCache); // prepare the rewards for insertion
            const voterRewards = prepareRewards(contestData.voterRewards, insertedTokenCache); // prepare the rewards for insertion
            const submitterRestrictions = prepareRestrictions(contestData.submitterRestrictions, insertedTokenCache); // prepare the restrictions for insertion
            const votingPolicy = prepareVotingPolicy(contestData.votingPolicy, insertedTokenCache); // prepare the voting policy for insertion

            const contestId = parseInt(contest.insertId);
            await handleRewards(contestId, submitterRewards, 'submitter', tx); // insert the submitter rewards
            await handleRewards(contestId, voterRewards, 'voter', tx); // insert the voter rewards
            await handleRestrictions(contestId, submitterRestrictions, tx); // insert the restrictions
            await handleVotingPolicy(contestId, votingPolicy, tx); // insert the voting policy
            return contestId
        })


    } catch (err: any) {
        throw new Error("database error: " + err.message)

    }
};


export const queueTweet = async (contestId: number, user: any, startTime: string, tweetThread: TwitterThread) => {

    type TweetQueueThreadItem = {
        id: string;
        text: string;
        media: {
            type?: string;
            size?: number;
            url?: string;
        } | null;
    };

    const tweetQueueThread: TweetQueueThreadItem[] = tweetThread.map((item) => {
        return {
            id: nanoid(),
            text: item.text || "",

            media: item.videoAsset ? {
                url: item.videoAsset,
                type: item.assetType,
                size: item.assetSize
            } : item.previewAsset ? {
                url: item.previewAsset,
                type: item.assetType,
                size: item.assetSize
            } : null
        }
    });


    const tweetJob: dbNewTweetQueueType = {
        contestId: contestId,
        author: user.address,
        created: startTime, // set created to startTime so that the job will be picked up by the scheduler close to the start time
        jobContext: 'contest',
        payload: tweetQueueThread,
        accessToken: user.twitter.accessToken,
        accessSecret: user.twitter.accessSecret,
        retries: 0,
        status: 0
    }


    await db.insert(schema.tweetQueue).values(tweetJob)
        .then(() => { return { success: true } })
        .catch((err: any) => {
            throw new Error("database error: " + err.message)
        })
}

import { EditorOutputData, IToken, DatabaseController, schema, isERCToken } from "lib";
import pinataSDK from '@pinata/sdk';
import dotenv from 'dotenv';
dotenv.config();

const pinata = new pinataSDK({ pinataApiKey: process.env.PINATA_KEY, pinataSecretApiKey: process.env.PINATA_SECRET });

const databaseController = new DatabaseController(process.env.DATABASE_HOST, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);
export const db = databaseController.db;
export const sqlOps = databaseController.sqlOps;


type Metadata = {
    type: string;
    category: string;
}

type Deadlines = {
    startTime: string;
    voteTime: string;
    endTime: string;
    snapshot: string;
}

type Prompt = {
    title: string;
    body: EditorOutputData;
    coverUrl?: string;
}

type AdditionalParams = {
    anonSubs: boolean;
    visibleVotes: boolean;
    selfVote: boolean;
    subLimit: number;
}

type FungiblePayout = {
    amount: string;
}

type NonFungiblePayout = {
    tokenId: number | null;
}

interface IPayout {
    rank: number;
    ETH?: FungiblePayout;
    ERC20?: FungiblePayout;
    ERC721?: NonFungiblePayout;
    ERC1155?: FungiblePayout;
}

interface SubmitterRewards {
    ETH?: IToken;
    ERC20?: IToken;
    ERC721?: IToken;
    ERC1155?: IToken;
    payouts?: IPayout[];
}

interface VoterRewards {
    ETH?: IToken;
    ERC20?: IToken;
    payouts?: IPayout[];
}

interface SubmitterRestriction {
    token: IToken;
    threshold: string;
}

type ArcadeStrategy = {
    type: "arcade";
    votingPower: string;
};

type WeightedStrategy = {
    type: "weighted";
};

interface VotingPolicy {
    token: IToken;
    strategy: ArcadeStrategy | WeightedStrategy;
}

type ContestData = {
    spaceId: string;
    metadata: Metadata;
    deadlines: Deadlines;
    //created: string;
    prompt: Prompt;
    additionalParams: AdditionalParams;
    submitterRewards: SubmitterRewards;
    voterRewards: VoterRewards;
    submitterRestrictions: SubmitterRestriction[];
    votingPolicy: VotingPolicy[];
}


// simple object hash function
function djb2Hash(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
}


export const prepareContestPromptUrl = async (contestPrompt: Prompt) => {
    const prompt = { ...contestPrompt, version: 'uplink-v1' }

    return pinata.pinJSONToIPFS(prompt).then((result) => {
        return `https://calabara.mypinata.cloud/ipfs/${result.IpfsHash}`;
    }).catch((err) => {
        throw new Error(err);
    })
}


const insertSubRewards = async (contestId, submitterRewards) => {

    const tokenSubRewardsArr = [];
    await db.transaction(async (innerTx) => {
        for (const reward of submitterRewards) {
            const newReward: schema.dbNewRewardType = {
                contestId,
                rank: reward.rank,
                recipient: 'submitter',
            }
            const insertedReward = await innerTx.insert(schema.rewards).values(newReward);
            const newTokenReward: schema.dbNewTokenRewardType = {
                rewardId: parseInt(insertedReward.insertId),
                tokenLink: reward.tokenLink,
                amount: 'amount' in reward.value ? reward.value.amount.toString() : null,
                tokenId: 'tokenId' in reward.value ? reward.value.tokenId : null,
            }
            tokenSubRewardsArr.push(newTokenReward);
        }
        if (tokenSubRewardsArr.length > 0) await innerTx.insert(schema.tokenRewards).values(tokenSubRewardsArr);
    });
}


const insertVoterRewards = async (contestId, voterRewards) => {

    const tokenVoterRewardsArr = [];
    await db.transaction(async (innerTx) => {
        for (const reward of voterRewards) {
            const newReward: schema.dbNewRewardType = {
                contestId,
                rank: reward.rank,
                recipient: 'voter',
            }
            const insertedReward = await innerTx.insert(schema.rewards).values(newReward);
            const newTokenReward: schema.dbNewTokenRewardType = {
                rewardId: parseInt(insertedReward.insertId),
                tokenLink: reward.tokenLink,
                amount: 'amount' in reward.value ? reward.value.amount.toString() : null,
                tokenId: 'tokenId' in reward.value ? reward.value.tokenId : null,
            }
            tokenVoterRewardsArr.push(newTokenReward);
        }
        if (tokenVoterRewardsArr.length > 0) await innerTx.insert(schema.tokenRewards).values(tokenVoterRewardsArr);
    });
}


const insertSubmitterRestrictions = async (contestId, submitterRestrictions) => {

    // insert submitter restrictions to restrictions table
    const subRestrictionArr = []
    await db.transaction(async (innerTx) => {
        for (const restriction of submitterRestrictions) {
            const newRestriction: schema.dbNewSubmitterRestrictionType = {
                contestId,
                restrictionType: "token",
            }
            const insertedRestriction = await innerTx.insert(schema.submitterRestrictions).values(newRestriction);

            const newTokenRestriction: schema.dbNewTokenRestrictionType = {
                restrictionId: parseInt(insertedRestriction.insertId),
                tokenLink: restriction.tokenLink,
                threshold: restriction.threshold,
            }
            subRestrictionArr.push(newTokenRestriction);
        };
        if (subRestrictionArr.length > 0) await innerTx.insert(schema.tokenRestrictions).values(subRestrictionArr);

    });
}

const insertVotingPolicies = async (contestId, votingPolicy) => {

    // insert the voting policies
    await db.transaction(async (innerTx) => {

        for (const policy of votingPolicy) {
            const newVotingPolicy: schema.dbNewVotingPolicyType = {
                contestId,
                strategyType: policy.strategy.type,
            }
            const insertedVotingPolicy = await innerTx.insert(schema.votingPolicy).values(newVotingPolicy);

            if (policy.strategy.type === "arcade") {
                const newArcadeVotingPolicy: schema.dbNewArcadeVotingStrategyType = {
                    votingPolicyId: parseInt(insertedVotingPolicy.insertId),
                    votingPower: policy.strategy.votingPower,
                    tokenLink: policy.tokenLink,
                }
                await innerTx.insert(schema.arcadeVotingStrategy).values(newArcadeVotingPolicy);
            }
            else if (policy.strategy.type === "weighted") {
                const newWeightedVotingPolicy: schema.dbNewWeightedVotingStrategyType = {
                    votingPolicyId: parseInt(insertedVotingPolicy.insertId),
                    tokenLink: policy.tokenLink,
                }
                await innerTx.insert(schema.weightedVotingStrategy).values(newWeightedVotingPolicy);
            }
        };
    });

}

// update the many-to-many mapping of spacesToTokens
const insertSpaceToken = async (spaceId, tokenId) => {
    const existingLink = await db.select({ id: schema.spacesToTokens.id })
        .from(schema.spacesToTokens)
        .where(sqlOps.and(
            sqlOps.eq(schema.spacesToTokens.spaceId, spaceId),
            sqlOps.eq(schema.spacesToTokens.tokenLink, tokenId)
        ));

    if (!existingLink[0]) {
        // insert the new link
        const newSpaceToken: schema.dbNewSpaceToTokenType = {
            spaceId: spaceId,
            tokenLink: tokenId,
        }
        await db.insert(schema.spacesToTokens).values(newSpaceToken);
    }
}



export const createDbContest = async (contest: ContestData) => {
    const spaceId = parseInt(contest.spaceId);
    const promptUrl = await prepareContestPromptUrl(contest.prompt);



    const uniqueTokens = new Map();

    const insertUniqueToken = async (token) => {
        const tokenHash = djb2Hash(JSON.stringify(token)).toString(16);

        if (!uniqueTokens.has(tokenHash)) {
            const existingToken = await db
                .select({ id: schema.tokens.id })
                .from(schema.tokens)
                .where(sqlOps.eq(schema.tokens.tokenHash, tokenHash));

            if (!existingToken[0]) {
                const newToken: schema.dbNewTokenType = {
                    tokenHash: tokenHash,
                    type: token.type,
                    symbol: token.symbol,
                    decimals: token.decimals,
                    address: isERCToken(token) ? token.address : null,
                    tokenId: isERCToken(token) ? token.tokenId : null,
                };

                const insertedToken = await db.insert(schema.tokens).values(newToken);
                const insertId = parseInt(insertedToken.insertId);
                uniqueTokens.set(tokenHash, { dbTokenId: insertId });
                await insertSpaceToken(spaceId, insertId);
                return insertId;
            } else {
                const existingId = existingToken[0].id;
                uniqueTokens.set(tokenHash, { dbTokenId: existingId });
                await insertSpaceToken(spaceId, existingId);
                return existingId;
            }
        } else {
            const existingId = uniqueTokens.get(tokenHash).dbTokenId;
            await insertSpaceToken(spaceId, existingId);
            return existingId;
        }
    }



    const prepareContestRewards = async (contestRewards: SubmitterRewards | VoterRewards) => {
        const flattenedRewards = [];

        if (contestRewards.payouts) {
            for (const payout of contestRewards.payouts) {
                const { rank, ...payoutData } = payout;

                for (const [tokenType, value] of Object.entries(payoutData)) {
                    const reward = {
                        rank: payout.rank,
                        tokenLink: await insertUniqueToken(contestRewards[tokenType]),
                        value
                    };
                    flattenedRewards.push(reward);
                }
            }
        }

        return flattenedRewards;
    };


    const prepareRestrictionsAndPolicies = async (arr) => {
        const returnArr = [];
        for (const arrElement of arr) {
            const { token, ...rest } = arrElement;
            const dbTokenId = await insertUniqueToken(token);
            returnArr.push({ tokenLink: dbTokenId, ...rest });
        };
        return returnArr;
    };


    const adjustedSubmitterRewards = await prepareContestRewards(contest.submitterRewards);
    const adjustedVoterRewards = await prepareContestRewards(contest.submitterRewards);
    const adjustedVotingPolicy = await prepareRestrictionsAndPolicies(contest.votingPolicy);
    const adjustedSubmitterRestrictions = await prepareRestrictionsAndPolicies(contest.submitterRestrictions);

    const newContest: schema.dbNewContestType = {
        spaceId: spaceId,
        type: contest.metadata.type,
        category: contest.metadata.category,
        promptUrl: promptUrl,
        startTime: new Date(contest.deadlines.startTime),
        voteTime: new Date(contest.deadlines.voteTime),
        endTime: new Date(contest.deadlines.endTime),
        snapshot: new Date(contest.deadlines.snapshot),
        anonSubs: contest.additionalParams.anonSubs,
        visibleVotes: contest.additionalParams.visibleVotes,
        selfVote: contest.additionalParams.selfVote,
        subLimit: contest.additionalParams.subLimit,
        created: new Date()
    }


    try {
        return await db.transaction(async (tx) => {
            const contest = await tx.insert(schema.contests).values(newContest)
            const contestId = parseInt(contest.insertId);
            await Promise.all([
                insertSubRewards(contestId, adjustedSubmitterRewards),
                insertVoterRewards(contestId, adjustedVoterRewards),
                insertSubmitterRestrictions(contestId, adjustedSubmitterRestrictions),
                insertVotingPolicies(contestId, adjustedVotingPolicy),
            ]);
            return contestId;
        });
    } catch (err) {
        throw new Error("database error: " + err.message)
    }





};
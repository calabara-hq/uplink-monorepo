import { EditorOutputData, IToken, _prismaClient } from "lib";
import pinataSDK from '@pinata/sdk';
import dotenv from 'dotenv';
import { isERCToken } from "lib";
dotenv.config();

const pinata = new pinataSDK({ pinataApiKey: process.env.PINATA_KEY, pinataSecretApiKey: process.env.PINATA_SECRET });


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


export type FungiblePayout = {
    amount: string;
}

export type NonFungiblePayout = {
    tokenId: number | null;
}


interface IPayout {
    rank: number;
    ETH?: FungiblePayout;
    ERC20?: FungiblePayout;
    ERC721?: NonFungiblePayout;
    ERC1155?: FungiblePayout;
}

export interface SubmitterRewards {
    ETH?: IToken;
    ERC20?: IToken;
    ERC721?: IToken;
    ERC1155?: IToken;
    payouts?: IPayout[];
}

export interface VoterRewards {
    ETH?: IToken;
    ERC20?: IToken;
    payouts?: IPayout[];
}

export interface SubmitterRestriction {
    token: IToken;
    threshold: string;
}

type ContestData = {
    metadata: Metadata;
    deadlines: Deadlines;
    //created: string;
    prompt: Prompt;
    additionalParams: AdditionalParams;
    submitterRewards: SubmitterRewards;
    voterRewards: VoterRewards;
    submitterRestrictions: SubmitterRestriction[];
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

/*
    take the rewards and create a flattened array of payouts
    it should look like this:
    [
        {
            rank: 1,
            payouts: [
                {
                    token: {
                        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                        ...
                    }
                    amount?: '1000000000000000000'
                    tokenId?: 100
                }
            ]

    ]

*/
const prepareContestRewards = async (contestRewards: SubmitterRewards | VoterRewards) => {
    const flattenedRewards = contestRewards.payouts?.flatMap(payout => {
        const { rank, ...payoutData } = payout;
        return Object.entries(payoutData).map(([tokenType, value]) => ({
            rank: payout.rank,
            token: contestRewards[tokenType],
            value
        }));
    }) ?? [];

    return flattenedRewards;
}

export const createDBContest = async (contest: ContestData) => {

    //console.log(JSON.stringify(contest, null, 2))

    const promptUrl = await prepareContestPromptUrl(contest.prompt);

    const flattenedSubmitterRewards = await prepareContestRewards(contest.submitterRewards);
    const flattenedVoterRewards = await prepareContestRewards(contest.voterRewards);

    const submitterRewardsData = await Promise.all(flattenedSubmitterRewards.map(async (payout) => {
        const { rank, token, value } = payout;
        const tokenHash = djb2Hash(JSON.stringify(token)).toString(16);
        const dbToken = await _prismaClient.token.upsert({
            where: { tokenHash: tokenHash },
            update: {},
            create: {
                tokenHash: tokenHash,
                type: token.type,
                symbol: token.symbol,
                decimals: token.decimals,
                address: isERCToken(token) ? token.address : null,
                tokenId: isERCToken(token) ? token.tokenId : null,

            },
        });
        return {
            rank,
            value,
            token: {
                connect: {
                    id: dbToken.id,
                },
            },
        };
    }));

    const voterRewardsData = await Promise.all(flattenedVoterRewards.map(async (payout) => {
        const { rank, token, value } = payout;
        const tokenHash = djb2Hash(JSON.stringify(token)).toString(16);
        const dbToken = await _prismaClient.token.upsert({
            where: { tokenHash: tokenHash },
            update: {},
            create: {
                tokenHash: tokenHash,
                type: token.type,
                symbol: token.symbol,
                decimals: token.decimals,
                address: isERCToken(token) ? token.address : null,
                tokenId: isERCToken(token) ? token.tokenId : null,
            },
        });
        return {
            rank,
            value,
            token: {
                connect: {
                    id: dbToken.id,
                },
            },
        };
    }));

    const submitterRestrictionData = await Promise.all(contest.submitterRestrictions.map(async (restriction) => {
        const { token, threshold } = restriction;
        const tokenHash = djb2Hash(JSON.stringify(token)).toString(16);
        const dbToken = await _prismaClient.token.upsert({
            where: { tokenHash: tokenHash },
            update: {},
            create: {
                tokenHash: tokenHash,
                type: token.type,
                symbol: token.symbol,
                decimals: token.decimals,
                address: isERCToken(token) ? token.address : null,
                tokenId: isERCToken(token) ? token.tokenId : null,
            },
        });
        return {
            threshold,
            token: {
                connect: {
                    id: dbToken.id,
                },
            },
        };

    }));



    const newContest = await _prismaClient.contest.create({
        data: {
            created: new Date().toISOString(),
            type: contest.metadata.type,
            category: contest.metadata.category,
            promptUrl: promptUrl,
            startTime: contest.deadlines.startTime,
            voteTime: contest.deadlines.voteTime,
            endTime: contest.deadlines.endTime,
            snapshot: contest.deadlines.snapshot,
            anonSubs: contest.additionalParams.anonSubs,
            visibleVotes: contest.additionalParams.visibleVotes,
            selfVote: contest.additionalParams.selfVote,
            subLimit: contest.additionalParams.subLimit,
            submitterRewards: {
                create: submitterRewardsData.map(reward => {
                    return {
                        type: 'token',
                        rank: reward.rank,
                        token: reward.token,
                        ...('amount' in reward.value && { amount: reward.value.amount.toString() }),
                        ...('tokenId' in reward.value && { tokenId: reward.value.tokenId })
                    }
                })
            },
            voterRewards: {
                create: voterRewardsData.map(reward => {
                    return {
                        type: 'token',
                        rank: reward.rank,
                        token: reward.token,
                        ...('amount' in reward.value && { amount: reward.value.amount.toString() }),
                        ...('tokenId' in reward.value && { tokenId: reward.value.tokenId })
                    }
                })
            },
            submitterTokenRestrictions: {
                create: submitterRestrictionData.map(restriction => {
                    return {
                        token: restriction.token,
                        threshold: restriction.threshold.toString()
                    }
                })
            },
            space: {
                connect: {
                    id: 1
                }
            },
        }


    });

    console.log(JSON.stringify(newContest, null, 2))
}
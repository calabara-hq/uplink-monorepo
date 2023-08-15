
import {
    isERCToken,
    IERCToken,
    IToken,
    EditorOutputData,
} from "lib";

import { tokenController } from "./tokenController.js";


export type FungiblePayout = {
    amount: string;
}

export type NonFungiblePayout = {
    tokenId: number | null;
}

export type Deadlines = {
    snapshot: string;
    startTime: string;
    voteTime: string;
    endTime: string;
}

export type Prompt = {
    title: string;
    body: EditorOutputData;
    coverUrl?: string;
}

export type SubmitterRestriction = {
    token?: IToken;
    threshold?: string;
}

export type ArcadeStrategy = {
    type: "arcade";
    votingPower: string;
};

export type WeightedStrategy = {
    type: "weighted";
};

export type VotingPolicy = {
    token?: IToken;
    strategy: ArcadeStrategy | WeightedStrategy;
};

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

export interface AdditionalParams {
    anonSubs: boolean;
    visibleVotes: boolean;
    selfVote: boolean;
    subLimit: number;
}

export type Metadata = {
    type: "standard" | "twitter";
    category: string;
}

type TwitterThreadItem = {
    text?: string,
    previewAsset?: string,
    videoAsset?: string,
    assetType?: string,
    assetSize?: string
}


export interface ContestBuilderProps {
    metadata: Metadata;
    deadlines: Deadlines;
    prompt: Prompt;
    submitterRewards: SubmitterRewards;
    voterRewards: VoterRewards;
    submitterRestrictions: SubmitterRestriction[] | [];
    votingPolicy: VotingPolicy[] | [];
    additionalParams: AdditionalParams;
}


export const validateMetadata = (metadata: ContestBuilderProps['metadata']) => {
    const { type, category } = metadata;

    const errorArr: string[] = [];

    if (!category) {
        errorArr.push("Contest category is required");
        return { metadata, error: "Contest category is required" }
    }

    return {
        metadata: {
            type: metadata.type,
            category: metadata.category.trim().toLowerCase(),
        },
    };
}

export const validateDeadlines = (deadlines: ContestBuilderProps['deadlines']) => {
    const { snapshot, startTime, voteTime, endTime } = deadlines;

    const now = new Date().toISOString();
    const errorArr: string[] = [];

    if (snapshot && startTime && snapshot > startTime) {
        errorArr.push("Snapshot date must be before start date");
    }

    if (snapshot && snapshot > now) {
        errorArr.push("Snapshot date must be in the past");
    }

    if (voteTime && startTime && voteTime <= startTime) {
        errorArr.push("Vote date must be after start date");
    }

    if (endTime && voteTime && endTime <= voteTime) {
        errorArr.push("End date must be after vote date");
    }

    if (endTime && startTime && endTime <= startTime) {
        errorArr.push("End date must be after start date");
    }

    const error = errorArr.length > 0 ? errorArr.join(", ") : undefined;

    return { deadlines, error };
};


export const validatePrompt = (prompt: ContestBuilderProps['prompt']) => {
    const { title, body, coverUrl } = prompt;

    const errorArr: string[] = [];

    if (!title) {
        errorArr.push("Prompt title is required");
    }

    if (body.blocks.length === 0) {
        errorArr.push("Prompt body blocks cannot be empty");
    }

    // clean the title string
    const cleanedTitle = title.trim();

    const error = errorArr.length > 0 ? errorArr.join(", ") : undefined;

    return { prompt: { title: cleanedTitle, body, ...(coverUrl ? { coverUrl } : {}) }, error };
};



export const validateSubmitterRewards = async (submitterRewards: ContestBuilderProps['submitterRewards']) => {
    if (!submitterRewards || Object.keys(submitterRewards).length === 0) {
        return { submitterRewards };
    }

    const errorArr: string[] = [];
    const seenRanks = new Set<number>();

    const { payouts, ...tokens } = submitterRewards;

    if ((payouts?.length ?? 0 > 0) && Object.keys(tokens).length === 0) {
        return { submitterRewards, error: "At least one token must be defined" };
    }

    if (Object.keys(tokens).length > 0 && !(payouts?.length)) {
        return { submitterRewards, error: "At least one payout must be defined" };
    }


    await Promise.all(Object.keys(tokens).map(async (token) => {
        const tokenData = tokens[token];


        if (isERCToken(tokenData)) {
            const isValid = await tokenController.verifyTokenStandard({
                contractAddress: tokenData.address as IERCToken["address"],
                expectedStandard: token as "ERC20" | "ERC721" | "ERC1155",
            });

            if (!isValid) {
                errorArr.push(`Invalid ${token} token`);
            }

            if (tokenData.type === 'ERC1155') {
                const isValidId = await tokenController.isValidERC1155TokenId({
                    contractAddress: tokenData.address,
                    tokenId: tokenData.tokenId
                });
                if (!isValidId) {
                    errorArr.push(`Invalid ${token} token id`);
                } else {
                    const isFungible = await tokenController.isERC1155TokenFungible({
                        contractAddress: tokenData.address,
                        tokenId: tokenData.tokenId
                    });
                    if (!isFungible) {
                        errorArr.push(`ERC1155 token is not fungible`);
                    }
                }
            }
        }

    }));


    payouts.forEach((payout, index) => {
        const rank = payout.rank;
        if (seenRanks.has(rank)) {
            errorArr.push(`Duplicate rank ${rank} found at index ${index}`);
        } else {
            seenRanks.add(rank);
        }

        for (const token of ["ETH", "ERC20", "ERC1155"]) {
            const fungiblePayout = payout[token as keyof IPayout] as FungiblePayout;
            if (fungiblePayout?.amount) {
                const amount = parseFloat(fungiblePayout.amount);
                if (amount <= 0 || !amount) {
                    errorArr.push(`Invalid ${token} amount for rank ${rank} at index ${index}`);
                }

                fungiblePayout.amount = amount.toString();
            }
        }

        const nonFungiblePayout = payout.ERC721 as NonFungiblePayout;
        if (nonFungiblePayout?.tokenId === null) {
            errorArr.push(`Invalid ERC721 tokenId for rank ${rank} at index ${index}`);
        }
    });

    const error = errorArr.length > 0 ? errorArr.join(", ") : undefined;

    return { submitterRewards, error };
};



export const validateVoterRewards = async (voterRewards: ContestBuilderProps['voterRewards']) => {
    const response: {
        voterRewards: ContestBuilderProps['voterRewards'];
        error?: string;
    } = {
        voterRewards: voterRewards
    };

    if (!voterRewards || Object.keys(voterRewards).length === 0) return response;

    const errorArr: string[] = [];
    const seenRanks = new Set<number>();

    const { payouts, ...tokens } = response.voterRewards;

    if ((payouts?.length ?? 0 > 0) && Object.keys(tokens).length === 0) {
        response.error = "At least one token must be defined";
        return response;
    }

    if (Object.keys(tokens).length > 0 && !(payouts?.length)) {
        response.error = "At least one payout must be defined";
        return response;
    }

    await Promise.all(Object.keys(tokens).map(async (token) => {
        const tokenData = tokens[token];

        if (isERCToken(tokenData)) {
            const isValid = await tokenController.verifyTokenStandard({
                contractAddress: tokenData.address as IERCToken["address"],
                expectedStandard: token as "ERC20",
            });

            if (!isValid) {
                errorArr.push(`Invalid ${token} token`);
            }
        }
    }));

    payouts.forEach((payout, index) => {
        const { rank, ...tokenKeys } = payout;
        if (seenRanks.has(rank)) {
            errorArr.push(`Duplicate rank ${rank} found at index ${index}`);
        } else {
            seenRanks.add(rank);
        }

        if (Object.keys(tokenKeys).length > 1) {
            errorArr.push(`Only one token can be defined for payout at index ${index}`);
        }

        const fungiblePayout = payout.ERC20 as FungiblePayout;
        if (fungiblePayout?.amount) {
            const amount = parseFloat(fungiblePayout.amount);
            if (amount <= 0 || !amount) {
                errorArr.push(`Invalid ERC20 amount for rank ${rank} at index ${index}`);
            }
        }
    });

    if (errorArr.length > 0) response.error = errorArr.join(", ");

    return response;
};

export const validateSubmitterRestrictions = async (submitterRestrictions: ContestBuilderProps['submitterRestrictions']) => {
    if (!submitterRestrictions || submitterRestrictions.length === 0) {
        return { submitterRestrictions };
    }

    const errorArr: string[] = [];

    await Promise.all(submitterRestrictions.map(async ({ token, threshold }, index) => {
        if (isERCToken(token)) {
            const isValid = await tokenController.verifyTokenStandard({
                contractAddress: token.address,
                expectedStandard: token.type,
            });

            if (!isValid) {
                errorArr.push(`Invalid ${token.type} token`);
            }

            if (token.type === 'ERC1155') {
                const isValidId = await tokenController.isValidERC1155TokenId({
                    contractAddress: token.address,
                    tokenId: token.tokenId
                });
                if (!isValidId) {
                    errorArr.push(`Invalid ${token} token id`);
                } else {
                    const isFungible = await tokenController.isERC1155TokenFungible({
                        contractAddress: token.address,
                        tokenId: token.tokenId
                    });
                    if (!isFungible) {
                        errorArr.push(`ERC1155 token is not fungible`);
                    }
                }
            }
        }

        const floatThreshold = parseFloat(threshold);

        if (!floatThreshold || floatThreshold <= 0) {
            errorArr.push(`Invalid threshold amount at index ${index}`);
        }
    }));

    const error = errorArr.length > 0 ? errorArr.join(", ") : undefined;
    return { submitterRestrictions, error };
};



export const validateVotingPolicy = async (votingPolicy: ContestBuilderProps['votingPolicy']) => {
    if (!votingPolicy || votingPolicy.length < 1) {
        return { votingPolicy, error: "At least one voting policy must be defined" };
    }

    const errorArr: string[] = [];

    const validateStrategy = (strategy: VotingPolicy["strategy"]) => {
        if (!strategy.type) return false;

        if (strategy.type === 'arcade') {
            const floatVotingPower = parseFloat(strategy.votingPower);
            return floatVotingPower > 0;
        }

        return strategy.type === 'weighted';
    }

    await Promise.all(votingPolicy.map(async ({ token, strategy }, index) => {
        if (isERCToken(token)) {
            // verify the token is valid
            const isValidToken = await tokenController.verifyTokenStandard({
                contractAddress: token.address,
                expectedStandard: token.type,
            });

            if (!isValidToken) {
                errorArr.push(`Invalid ${token.type} token`);
            }
        }

        const isValidStrategy = validateStrategy(strategy);
        if (!isValidStrategy) {
            errorArr.push(`Invalid strategy at index ${index}`);
        }
    }));

    const error = errorArr.length > 0 ? errorArr.join(", ") : undefined;
    return { votingPolicy, error };
};


export const validateAdditionalParams = (additionalParams: ContestBuilderProps['additionalParams']) => {

    const { subLimit } = additionalParams;

    if (subLimit > 3) {
        return { additionalParams, error: "Submissions limit value cannot be greater than 3" };
    }

    if (subLimit < 0) {
        return { additionalParams, error: "Submissions limit value cannot be less than 0" };
    }

    return { additionalParams };

}


export const validateTweetThread = (thread: TwitterThreadItem[]) => {

    const contentResult = composeTweetThread(thread);

    const errors = {
        ...(contentResult.error ? { content: contentResult.error } : {}),
    }

    const isSuccess = Object.keys(errors).length === 0;
    const errorString = Object.values(errors).join(", ") || null;

    return {
        success: isSuccess,
        errors: errorString,
        cleanPayload: contentResult.result
    }

}

export const composeTweetThread = (thread: TwitterThreadItem[]) => {
    const errorArr: string[] = [];

    const createTemplateType = (videoAsset, previewAsset, text) => {
        if (videoAsset) return "video";
        else if (previewAsset) return "image";
        else if (text.trim()) return "text";
        else return null;
    }

    const cleanedThread = thread.map(({ text, previewAsset, videoAsset, assetType, assetSize }, index) => {

        const type = createTemplateType(videoAsset, previewAsset, text);

        if (!type) errorArr.push(`content required for thread item index ${index}`)

        if (type === "video" && !previewAsset) {
            errorArr.push("Video thumbnail is required");
        }

        if (text) {
            if (text.length > 280) errorArr.push(`text must be less than 280 characters for thread item index ${index}`)
        }

        return {
            ...(assetType ? { assetType } : {}),
            ...(assetSize ? { assetSize } : {}),
            ...(videoAsset ? { videoAsset } : {}),
            ...(previewAsset ? { previewAsset } : {}),
            ...(text ? { text } : {}),
        }

    })

    const error = errorArr.length > 0 ? errorArr.join(", ") : undefined;

    return {
        error,
        result: cleanedThread
    }
}


export const validateContestParams = async (contestData: ContestBuilderProps) => {
    const { metadata, deadlines, prompt, submitterRewards, voterRewards, submitterRestrictions, votingPolicy, additionalParams } = contestData;

    const metadataResult = validateMetadata(metadata);
    const deadlinesResult = validateDeadlines(deadlines);
    const promptResult = validatePrompt(prompt);
    const submitterRewardsResult = await validateSubmitterRewards(submitterRewards);
    const voterRewardsResult = await validateVoterRewards(voterRewards);
    const submitterRestrictionsResult = await validateSubmitterRestrictions(submitterRestrictions);
    const votingPolicyResult = await validateVotingPolicy(votingPolicy);
    const additionalParamsResult = validateAdditionalParams(additionalParams);

    const errors = {
        ...(metadataResult.error ? { metadata: metadataResult.error } : {}),
        ...(deadlinesResult.error ? { deadlines: deadlinesResult.error } : {}),
        ...(promptResult.error ? { prompt: promptResult.error } : {}),
        ...(submitterRewardsResult.error ? { submitterRewards: submitterRewardsResult.error } : {}),
        ...(voterRewardsResult.error ? { voterRewards: voterRewardsResult.error } : {}),
        ...(submitterRestrictionsResult.error ? { submitterRestrictions: submitterRestrictionsResult.error } : {}),
        ...(votingPolicyResult.error ? { votingPolicy: votingPolicyResult.error } : {}),
        ...(additionalParamsResult.error ? { additionalParams: additionalParamsResult.error } : {}),
    }

    const isSuccess = Object.keys(errors).length === 0;

    return {
        success: isSuccess,
        errors: errors,
    }
}
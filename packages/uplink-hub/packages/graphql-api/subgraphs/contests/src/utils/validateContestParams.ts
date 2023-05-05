
import {
    verifyTokenStandard,
    isERC1155TokenFungible,
    isValidERC1155TokenId,
    isERCToken,
    IERCToken,
    IToken,
    EditorOutputData,
} from "lib";


export type FungiblePayout = {
    amount: string;
}

export type NonFungiblePayout = {
    tokenId: number | null;
}

export type Deadlines = {
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


export interface ContestBuilderProps {
    type: "standard" | "twitter";
    deadlines: Deadlines;
    prompt: Prompt;
    submitterRewards: SubmitterRewards;
    voterRewards: VoterRewards;
    submitterRestrictions: SubmitterRestriction[] | [];
    votingPolicy: VotingPolicy[] | [];
}


export const validateDeadlines = (deadlines: ContestBuilderProps['deadlines']) => {
    const { startTime, voteTime, endTime } = deadlines;

    const errorArr: string[] = [];

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
            const isValid = await verifyTokenStandard({
                contractAddress: tokenData.address as IERCToken["address"],
                expectedStandard: token as "ERC20" | "ERC721" | "ERC1155",
            });

            if (!isValid) {
                errorArr.push(`Invalid ${token} token`);
            }

            if (tokenData.type === 'ERC1155') {
                const isValidId = await isValidERC1155TokenId({
                    contractAddress: tokenData.address,
                    tokenId: tokenData.tokenId
                });
                if (!isValidId) {
                    errorArr.push(`Invalid ${token} token id`);
                } else {
                    const isFungible = await isERC1155TokenFungible({
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
                if (amount <= 0) {
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
            const isValid = await verifyTokenStandard({
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
            if (amount <= 0) {
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
            const isValid = await verifyTokenStandard({
                contractAddress: token.address,
                expectedStandard: token.type,
            });

            if (!isValid) {
                errorArr.push(`Invalid ${token.type} token`);
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
    if (!votingPolicy) {
        return { votingPolicy };
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
            const isValidToken = await verifyTokenStandard({
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



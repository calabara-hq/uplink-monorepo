
import { ThreadItem } from "@/hooks/useThreadCreator";
import { handleMutationError } from "@/lib/handleMutationError";
import { ContestCategory, ContestType } from "@/types/contest";
import { IToken, IERCToken, INativeToken } from "@/types/token";
import type { OutputData } from "@editorjs/editorjs";

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

export type SubmitterRestriction = {
    token: IToken;
    threshold: string;
}

export type ArcadeStrategy = {
    type: "arcade";
    votingPower: string;
}

export type WeightedStrategy = {
    type: "weighted";
}

export type VotingPolicyType = {
    token?: IToken;
    strategy?: ArcadeStrategy | WeightedStrategy;
}

export interface Prompt {
    title: string;
    body: OutputData | null;
    coverUrl: string | null;
    coverBlob: string | null;
}

export interface Deadlines {
    snapshot: string;
    startTime: string;
    voteTime: string;
    endTime: string;
}

export interface AdditionalParams {
    anonSubs: boolean;
    visibleVotes: boolean;
    selfVote: boolean;
    subLimit: number;
}

export type Metadata = {
    type: ContestType | string | null;
    category: ContestCategory | null;
}

export interface ContestBuilderProps {
    metadata: Metadata;
    deadlines: Deadlines;
    prompt: Prompt;
    spaceTokens: IToken[];
    submitterRewards: SubmitterRewards;
    voterRewards: VoterRewards;
    submitterRestrictions: SubmitterRestriction[] | [];
    votingPolicy: VotingPolicyType[] | [];
    additionalParams: AdditionalParams;
    errors: ContestBuilderErrors;
}

export type DeadlineError = {
    snapshot: string;
    startTime: string;
    voteTime: string;
    endTime: string;
}

export type RewardError = {
    duplicateRanks: number[];
}

export type PromptError = {
    title: string;
    body: string;
    coverUrl: string;
}

export type MetadataError = {
    type: string;
    category: string;
}

export type ContestBuilderErrors = {
    metadata: MetadataError;
    deadlines: DeadlineError;
    prompt: PromptError;
    submitterRewards: RewardError;
    voterRewards: RewardError;
    votingPolicy: string;
}


export const rewardsObjectToArray = (rewards: SubmitterRewards | VoterRewards, strictTypes?: string[]) => {
    return Object.values(rewards).filter(
        (value): value is IToken =>
            value !== null &&
            typeof value !== "undefined" &&
            value !== rewards.payouts &&
            (!strictTypes || strictTypes.includes(value.type))
    );
};

export const arraysSubtract = (arr1: IToken[], arr2: IToken[], strictTypes?: string[]) => {
    return arr1.filter((item) => {
        // Check if the item is not in arr2
        return !arr2.some((obj) => {
            // Check if the objects are equal based on symbol and type
            return obj.symbol === item.symbol && obj.type === item.type;
        }) && (!strictTypes || strictTypes.includes(item.type))

    });
}

export const cleanSubmitterRewards = (submitterRewards: SubmitterRewards) => {

    let seenETH: boolean = false;
    let seenERC20: boolean = false;
    let seenERC721: boolean = false;
    let seenERC1155: boolean = false;


    const cleanedPayouts = submitterRewards.payouts?.map((payout) => {
        const cleanedPayout: any = { rank: payout.rank };
        const ETHPayout = payout.ETH?.amount ?? '0';
        const ERC20Payout = payout.ERC20?.amount ?? '0';
        const ERC721Payout = payout.ERC721?.tokenId ?? -1;
        const ERC1155Payout = payout.ERC1155?.amount ?? '0';

        if (parseFloat(ETHPayout) > 0) {
            cleanedPayout.ETH = { amount: ETHPayout };
            seenETH = true;
        }

        if (parseFloat(ERC20Payout) > 0) {
            cleanedPayout.ERC20 = { amount: ERC20Payout };
            seenERC20 = true;
        }

        if (ERC721Payout > -1) {
            cleanedPayout.ERC721 = { tokenId: ERC721Payout };
            seenERC721 = true;
        }

        if (parseFloat(ERC1155Payout) > 0) {
            cleanedPayout.ERC1155 = { amount: ERC1155Payout };
            seenERC1155 = true;
        }

        // if the payout is empty, return null
        const { rank, ...rest } = cleanedPayout;
        return someFieldPopulated(rest) ? cleanedPayout : null;
    }).filter((el) => el !== null) // filter null values after the map

    return {
        ...(seenETH ? { ETH: submitterRewards.ETH } : {}),
        ...(seenERC20 ? { ERC20: submitterRewards.ERC20 } : {}),
        ...(seenERC721 ? { ERC721: submitterRewards.ERC721 } : {}),
        ...(seenERC1155 ? { ERC1155: submitterRewards.ERC1155 } : {}),
        // cleaned payouts can be undefined if empty obj is passed
        ...(cleanedPayouts?.length ?? 0 > 0 ? { payouts: cleanedPayouts } : {}),
    }
};

export const cleanVoterRewards = (voterRewards: VoterRewards) => {

    let seenETH: boolean = false;
    let seenERC20: boolean = false;


    const cleanedPayouts = voterRewards.payouts?.map((payout) => {
        const cleanedPayout: any = { rank: payout.rank };
        const ETHPayout = payout.ETH?.amount ?? '0';
        const ERC20Payout = payout.ERC20?.amount ?? '0';

        if (parseFloat(ETHPayout) > 0) {
            cleanedPayout.ETH = { amount: ETHPayout };
            seenETH = true;
        }

        if (parseFloat(ERC20Payout) > 0) {
            cleanedPayout.ERC20 = { amount: ERC20Payout };
            seenERC20 = true;
        }

        // if the payout is empty, return null
        const { rank, ...rest } = cleanedPayout;
        return someFieldPopulated(rest) ? cleanedPayout : null;
    }).filter((el) => el !== null) // filter null values after the map

    return {
        ...(seenETH ? { ETH: voterRewards.ETH } : {}),
        ...(seenERC20 ? { ERC20: voterRewards.ERC20 } : {}),
        ...(cleanedPayouts?.length ?? 0 > 0 ? { payouts: cleanedPayouts } : {}),
    }
};

// detect if a field in an object is ! empty string
const someFieldPopulated = (fields: any) => {
    return Object.values(fields).some(field => field !== "")
}


// validation

export const validateMetadata = (metadata: Metadata) => {
    const { type, category } = metadata;
    const errors = {
        type: "",
        category: "",
    };

    if (!type) {
        errors.type = "Please select a contest type";
    }

    if (!category) {
        errors.category = "Please select a contest category";
    }

    return {
        isError: someFieldPopulated(errors),
        errors,
        data: {
            type,
            category,
        }
    }
}

export const validateDeadlines = (deadlines: Deadlines, clean: boolean) => {
    const { snapshot, startTime, voteTime, endTime } = deadlines;
    const errors = {
        snapshot: "",
        startTime: "",
        voteTime: "",
        endTime: "",
    };
    const now = new Date(Date.now()).toISOString();
    const calculatedStartTime = startTime === "now" ? now : startTime;
    const calculatedSnapshot = snapshot === "now" ? now : snapshot;
    // check for null values
    if (!calculatedSnapshot) errors.snapshot = "snapshot date is required";
    if (!calculatedStartTime) errors.startTime = "start date is required";
    if (!voteTime) errors.voteTime = "vote date is required";
    if (!endTime) errors.endTime = "end date is required";
    if (errors.snapshot || errors.startTime || errors.voteTime || errors.endTime) return { isError: true, errors, data: deadlines }


    // check that dates are in the correct order
    if (calculatedSnapshot > calculatedStartTime) errors.snapshot = "snapshot date must be less than or equal to start date";
    if (voteTime <= calculatedStartTime) errors.voteTime = "vote date must be after start date";
    if (endTime <= voteTime) errors.endTime = "end date must be after vote date";
    if (endTime <= calculatedStartTime) errors.endTime = "end date must be after start date";


    // we use clean to determine whether or not to return the calculated dates. if the user is still working,
    // it makes more sense to keep the "now" vernacular until they do the final validation
    const cleanedDeadlines = {
        snapshot: clean ? calculatedSnapshot : snapshot,
        startTime: clean ? calculatedStartTime : startTime,
        voteTime,
        endTime
    }

    return {
        errors,
        isError: someFieldPopulated(errors),
        data: cleanedDeadlines
    }
}

export const validatePrompt = (prompt: Prompt) => {
    const { title, body, coverUrl, coverBlob } = prompt;
    const errors = {
        title: "",
        body: "",
        coverUrl: "",
    };

    const pattern = /^https:\/\/uplink\.mypinata\.cloud\/ipfs\/[a-zA-Z0-9]+/;
    if (!title) errors.title = "Please provide a title";
    if (!body || body?.blocks.length < 1) errors.body = "Please provide a prompt body";
    if (coverUrl) {
        if (!pattern.test(coverUrl)) errors.coverUrl = "Invalid cover image";
    }

    return {
        errors,
        isError: someFieldPopulated(errors),
        data: {
            title,
            body,
            coverUrl,
            coverBlob,
        }
    }
}

export const validateSubmitterRewards = (submitterRewards: SubmitterRewards) => {
    const seenRanks: number[] = [];
    const errors = {
        duplicateRanks: [],
    }

    const payouts =
        submitterRewards.payouts ??
        []
            .map((el) => {
                const { ETH, ERC20, ERC721, ERC1155, rank } = el;
                let obj: any = { rank };
                if (ETH?.amount) {
                    obj.ETH = ETH;
                }
                if (ERC20?.amount && ERC20.amount !== "") obj.ERC20 = ERC20;
                if (ERC721?.tokenId !== null && ERC721?.tokenId !== undefined)
                    obj.ERC721 = ERC721;
                if (ERC1155?.amount && ERC1155.amount !== "") obj.ERC1155 = ERC1155;

                return obj;
            })
            .filter((el) => Object.keys(el).length > 1); // Filter out objects that only have the rank

    const ranks = payouts ? payouts.map((payout) => payout.rank) : [];
    ranks.forEach((rank, index) => {
        if (seenRanks.includes(rank)) {
            errors.duplicateRanks.push(rank);
        } else {
            seenRanks.push(rank);
        }
    });

    const cleanedRewards = cleanSubmitterRewards(submitterRewards);
    return {
        errors,
        isError: errors.duplicateRanks.length > 0,
        data: cleanedRewards
    }
}


export const validateVoterRewards = (voterRewards: VoterRewards) => {
    const seenRanks: number[] = [];
    const errors = {
        duplicateRanks: [],
    }

    let payouts =
        voterRewards.payouts ??
        []
            .map((el) => {
                const { ETH, ERC20, rank } = el;
                let obj: any = { rank };
                if (ETH?.amount) {
                    obj.ETH = ETH;
                }
                if (ERC20?.amount && ERC20.amount !== "") obj.ERC20 = ERC20;

                return obj;
            })
            .filter((el) => Object.keys(el).length > 1); // Filter out objects that only have the rank
    const ranks = payouts ? payouts.map((payout) => payout.rank) : [];

    ranks.forEach((rank, index) => {
        if (seenRanks.includes(rank)) {
            errors.duplicateRanks.push(rank);
        } else {
            seenRanks.push(rank);
        }
    });

    const cleanedRewards = cleanVoterRewards(voterRewards);

    return {
        errors,
        isError: errors.duplicateRanks.length > 0,
        data: cleanedRewards
    }
}

export const validateVotingPolicy = (votingPolicy: VotingPolicyType[]) => {
    let error = "";
    if (votingPolicy.length === 0) error = "Please add at least one voting policy";
    return {
        errors: error,
        isError: !!error,
        data: votingPolicy
    }

}

// reducer 


export const initialState: ContestBuilderProps = {
    metadata: {
        type: null,
        category: null,
    },
    deadlines: {
        snapshot: "now",
        startTime: "now",
        voteTime: new Date(Date.now() + 2 * 864e5).toISOString(),
        endTime: new Date(Date.now() + 4 * 864e5).toISOString(),
    },

    prompt: {
        title: "",
        body: null,
        coverUrl: null,
        coverBlob: null,
    },

    spaceTokens: [
        {
            type: "ETH",
            symbol: "ETH",
            decimals: 18,
        },
    ],
    submitterRewards: {},
    voterRewards: {},
    submitterRestrictions: [],
    votingPolicy: [],
    additionalParams: {
        anonSubs: true,
        visibleVotes: false,
        selfVote: false,
        subLimit: 1,
    },
    errors: {
        metadata: {
            type: "",
            category: "",
        },
        deadlines: {
            startTime: "",
            voteTime: "",
            endTime: "",
            snapshot: "",
        },
        prompt: {
            title: "",
            body: "",
            coverUrl: "",
        },
        submitterRewards: {
            duplicateRanks: [],
        },
        voterRewards: {
            duplicateRanks: [],
        },
        votingPolicy: "",
    }
};

export const ContestReducer = (state, action) => {
    switch (action.type) {
        case "SET_FIELD": {
            return {
                ...state,
                [action.field]: action.value,
            };
        }
        case "SET_ERRORS": {
            return {
                ...state,
                errors: action.value,
            };
        }

        case "SET_TOTAL_STATE": return action.value;
    }
};

export const postContest = async (url,
    {
        arg,
    }: {
        arg: any
    }
) => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": arg.csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
            query: `
                mutation CreateContest($contestData: ContestBuilderProps!){
                    createContest(contestData: $contestData){
                        success
                        contestId
                        errors{
                            metadata
                            deadlines
                            prompt
                            submitterRewards
                            voterRewards
                            submitterRestrictions
                            votingPolicy
                        }
                    }
                }`,
            variables: {
                contestData: arg.contestData,
            },
        }),
    })
        .then((res) => res.json())
        .then(handleMutationError)
        .then((res) => res.data.createContest);
}
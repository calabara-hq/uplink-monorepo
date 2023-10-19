import { z } from 'zod';
import type { EditorOutputData } from "lib";
import { VerifiedTokenSchema } from './writeToken.js';

// metadata

export const ContestTypeSchema = z.enum(["standard", "twitter"]);
export const EditorOutputSchema: z.ZodType<EditorOutputData> = z.any();

export const ContestCategorySchema = z.enum([
    "art",
    "music",
    "writing",
    "video",
    "photography",
    "design",
    "memes",
    "other"
]);

export const ContestMetadataSchema = z.object({
    type: ContestTypeSchema,
    category: ContestCategorySchema,
});


// add. params

export const ContestAdditionalParamsSchema = z.object({
    anonSubs: z.boolean(),
    visibleVotes: z.boolean(),
    selfVote: z.boolean(),
    subLimit: z.number().min(0).max(3),
});

// deadlines

export const ContestDeadlinesSchema = z.object({
    startTime: z.string().datetime(),
    voteTime: z.string().datetime(),
    endTime: z.string().datetime(),
    snapshot: z.string().datetime(),
})
    .refine(data => { return new Date().toISOString() >= data.snapshot }, { message: "snapshot cannot be in the future" })
    .refine(data => { return data.snapshot <= data.startTime }, { message: "snapshot must be at or before start time" })
    .refine(data => { return data.startTime < data.voteTime }, { message: "start time must be before vote time" })
    .refine(data => { return data.voteTime < data.endTime }, { message: "vote time must be before end time" })


// prompt 

export const ContestPromptDataSchema = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string",
    })
        .trim()
        .min(1, { message: "Title must be at least 1 character long" })
        .max(100, { message: "Title must be less than 100 characters long" }),
    body: EditorOutputSchema,
    coverUrl: z.string().nullable(),
}).refine(data => { return data.body.blocks && data.body.blocks.length > 0 }, { message: "Prompt body is required" })

// rewards

const NonZeroPositiveFloat = z.string().refine((val) => {
    const asFloat = parseFloat(val);
    if (isNaN(asFloat) || asFloat <= 0 || !asFloat) return false;
    return true;
}, { message: "Invalid argument" });

const ZeroInclusivePositiveFloat = z.string().refine((val) => {
    const asFloat = parseFloat(val);
    if (isNaN(asFloat) || asFloat < 0 || !asFloat) return false;
    return true;
}, { message: "Invalid argument" });

// ensure that each rank is unique
const checkDuplicateRanks = (payouts: ContestRewardPayout[] | undefined): boolean => {
    if (!payouts) return true;
    const ranks = payouts.map(p => p.rank);
    const uniqueRanks = [...new Set(ranks)];
    return ranks.length === uniqueRanks.length;
}

// for voter rewards, ensure that each rank has only one token type
const checkOneTokenPerRank = (payouts: ContestRewardPayout[] | undefined): boolean => {
    if (!payouts) return true;
    // ensure only one payout token per rank
    for (const payout of payouts) {
        const { rank, ...tokens } = payout
        const numTokens = Object.keys(tokens).length;
        if (numTokens > 1) return false;
    }
    return true;
}

// ensure that each payout token is defined in the reward token definitions
const checkTokenDefinitions = (data: ContestSubmitterRewards): boolean => {
    const { payouts, ...tokens } = data;
    const tokenDefKeys = Object.keys(tokens);
    if (!payouts) return true;
    for (const payout of payouts) {
        const { rank, ...payoutTokens } = payout;
        const payoutTokenKeys = Object.keys(payoutTokens);
        const isDefined = payoutTokenKeys.every(key => tokenDefKeys.includes(key));
        if (!isDefined) return false;
    }
    return true;
}

export const ContestFungibleTokenRewardSchema = z.object({
    amount: NonZeroPositiveFloat
});

export const ContestNonFungibleTokenRewardSchema = z.object({
    tokenId: z.number(),
});

export const ContestRewardPayoutSchema = z.object({
    rank: z.number(),
    ETH: ContestFungibleTokenRewardSchema.optional(),
    ERC20: ContestFungibleTokenRewardSchema.optional(),
    ERC721: ContestNonFungibleTokenRewardSchema.optional(),
    ERC1155: ContestFungibleTokenRewardSchema.optional(),
});


export const ContestSubmitterRewardsSchema = z.object({
    ETH: VerifiedTokenSchema.optional(),
    ERC20: VerifiedTokenSchema.optional(),
    ERC721: VerifiedTokenSchema.optional(),
    ERC1155: VerifiedTokenSchema.optional(),
    payouts: z.array(ContestRewardPayoutSchema).optional()
}).superRefine((data, ctx) => {
    const areRanksUnique = checkDuplicateRanks(data.payouts)
    if (!areRanksUnique) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Duplicate ranks are not allowed",
        })
    }

    const arePayoutTokensDefined = checkTokenDefinitions(data)
    if (!arePayoutTokensDefined) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Missing token definition(s) for payout token(s)",
        })
    }
})

export const ContestVoterRewardsSchema = z.object({
    ETH: VerifiedTokenSchema.optional(),
    ERC20: VerifiedTokenSchema.optional(),
    payouts: z.array(ContestRewardPayoutSchema).optional()

}).superRefine((data, ctx) => {
    const areRanksUnique = checkDuplicateRanks(data.payouts)
    if (!areRanksUnique) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Duplicate ranks are not allowed",
        })
    }

    const isOneTokenPerRank = checkOneTokenPerRank(data.payouts)
    if (!isOneTokenPerRank) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Only one token type per rank is allowed",
        })
    }
})

// restrictions 

export const ContestSubmitterRestrictionsSchema = z.array(z.object({
    token: VerifiedTokenSchema,
    threshold: ZeroInclusivePositiveFloat
}));

// voting policy

export const ArcadeVotingStrategySchema = z.object({
    type: z.literal("arcade"),
    votingPower: NonZeroPositiveFloat
});

export const WeightedVotingStrategySchema = z.object({
    type: z.literal("weighted"),
});

export const ContestVotingPolicySchema = z.array(z.object({
    token: VerifiedTokenSchema,
    strategy: z.union([ArcadeVotingStrategySchema, WeightedVotingStrategySchema]),
})).min(1, { message: "At least one voting policy is required" });



// meta type

export const writableContestSchema = z.object({
    metadata: ContestMetadataSchema,
    deadlines: ContestDeadlinesSchema,
    prompt: ContestPromptDataSchema,
    submitterRewards: ContestSubmitterRewardsSchema,
    voterRewards: ContestVoterRewardsSchema,
    submitterRestrictions: ContestSubmitterRestrictionsSchema,
    votingPolicy: ContestVotingPolicySchema,
    additionalParams: ContestAdditionalParamsSchema,
});

// guards

export const isArcadeVotingStrategy = (strategy: ArcadeVotingStrategy | WeightedVotingStrategy): strategy is ArcadeVotingStrategy => {
    return ArcadeVotingStrategySchema.safeParse(strategy).success;
}

export const isWeightedVotingStrategy = (strategy: ArcadeVotingStrategy | WeightedVotingStrategy): strategy is WeightedVotingStrategy => {
    return WeightedVotingStrategySchema.safeParse(strategy).success;
}


// types

export type ContestType = z.infer<typeof ContestTypeSchema>;
export type ContestCategory = z.infer<typeof ContestCategorySchema>;
export type ContestMetadata = z.infer<typeof ContestMetadataSchema>;
export type ContestDeadlines = z.infer<typeof ContestDeadlinesSchema>;
export type ContestPromptData = z.infer<typeof ContestPromptDataSchema>;
export type ContestAdditionalParams = z.infer<typeof ContestAdditionalParamsSchema>;
export type ContestFungibleTokenReward = z.infer<typeof ContestFungibleTokenRewardSchema>;
export type ContestNonFungibleTokenReward = z.infer<typeof ContestNonFungibleTokenRewardSchema>;
export type ContestRewardPayout = z.infer<typeof ContestRewardPayoutSchema>;
export type ContestSubmitterRewards = z.infer<typeof ContestSubmitterRewardsSchema>;
export type ContestVoterRewards = z.infer<typeof ContestVoterRewardsSchema>;
export type ContestSubmitterRestrictions = z.infer<typeof ContestSubmitterRestrictionsSchema>;
export type ArcadeVotingStrategy = z.infer<typeof ArcadeVotingStrategySchema>;
export type WeightedVotingStrategy = z.infer<typeof WeightedVotingStrategySchema>;
export type ContestVotingPolicy = z.infer<typeof ContestVotingPolicySchema>;
export type WritableContest = z.infer<typeof writableContestSchema>;

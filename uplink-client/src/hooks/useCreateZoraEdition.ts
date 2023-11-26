import { uint64MaxSafe } from "@/utils/uint64";
import { useReducer, useState } from "react";
import { z } from "zod";
import { Decimal } from 'decimal.js';
import { handleMutationError } from "@/lib/handleMutationError";
import { Session } from "@/providers/SessionProvider";
import { parseIpfsUrl } from "@/lib/ipfs";

export const EditionConfig = z.object({
    name: z.string(),
    symbol: z.string(),
    editionSize: z.string(),
    royaltyBPS: z.number(),
    fundsRecipient: z.string(),
    defaultAdmin: z.string(),
    saleConfig: z.object({
        publicSalePrice: z.string(),
        maxSalePurchasePerAddress: z.number(),
        publicSaleStart: z.string(),
        publicSaleEnd: z.string(),
        presaleStart: z.string(),
        presaleEnd: z.string(),
        presaleMerkleRoot: z.string(),
    }),
    description: z.string(),
    animationURI: z.string(),
    imageURI: z.string(),
    referrer: z.string(),
})

export const ZoraEdition = z.object({
    chainId: z.number().refine((n) => n === 8453, { message: "Must be base network" }),
    address: z.string(),
    config: EditionConfig,
});

export const EditionNameSchema = z.string().min(1, { message: "Name is required" });
export const EditionSymbolSchema = z.string().min(1, { message: "Symbol is required" });
export const EditionSizeSchema = z.union([z.literal("open"), z.string().min(1, { message: "Edition size is required" })]).transform((val, ctx) => {
    if (val === "open") { return uint64MaxSafe.toString(); }
    if (val === "one") { return "1"; }
    const result = BigInt(val);
    if (!result) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Edition size must be greater than 0",
            path: ['editionSize'],
        })
        return z.NEVER;
    }

    return result.toString();
})

export const EditionRoyaltyBPSSchema = z.union([z.literal("zero"), z.literal("five"), z.string().min(1, { message: "Royalty % is required" })]).transform((val) => {
    if (val === "zero") { return 0 }
    if (val === "five") { return 500 }
    const bps = parseInt(new Decimal(val).times(100).toString());
    return bps
})

export const EditionPublicSalePriceSchema = z.union([z.literal("free"), z.string().min(1, { message: "Edition price is required" })]).transform((val) => {
    if (val === "free") return "0";
    return new Decimal(val).times(10 ** 18).toString();
})

export const EditionSaleConfigSchema = z.object({
    publicSalePrice: EditionPublicSalePriceSchema,
    publicSaleStart: z.union([z.string().datetime(), z.literal("now")]),
    publicSaleEnd: z.union([z.string().datetime(), z.literal("forever"), z.literal("week")]),
}).transform((val, ctx) => {
    const { publicSalePrice, publicSaleStart, publicSaleEnd } = val;
    const unixInS = (str: string | number | Date) => Math.floor(new Date(str).getTime() / 1000);
    const now = unixInS(new Date(Date.now()));
    const week = now + 604800;
    const unixSaleStart = publicSaleStart === "now" ? now : unixInS(publicSaleStart);
    const unixSaleEnd = publicSaleEnd === "forever" ? uint64MaxSafe : (publicSaleEnd === "week" ? week : unixInS(publicSaleEnd));
    if (unixSaleStart < now) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Public sale start must be in the future",
            path: ['publicSaleStart'],
        })
        return z.NEVER;
    }

    if (unixSaleStart > unixSaleEnd) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Public sale end must be after public sale start",
            path: ['publicSaleEnd'],
        })
        return z.NEVER;
    }

    return {
        publicSalePrice,
        publicSaleStart: unixSaleStart.toString(),
        publicSaleEnd: unixSaleEnd.toString(),
    }
})


export const ConfigurableZoraEditionSchema = z.object({
    creator: z.string().min(1, { message: "You must be signed in" }),
    name: z.string().min(1, { message: "Name is required" }),
    symbol: z.string().min(1, { message: "Symbol is required" }),
    editionSize: EditionSizeSchema,
    royaltyBPS: EditionRoyaltyBPSSchema,
    description: z.string().min(1, { message: "Description is required" }),
    animationURI: z.string(),
    imageURI: z.string(),
    saleConfig: EditionSaleConfigSchema,
}).transform((val, ctx) => {
    if (val.animationURI && !val.imageURI) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Video thumbnail must be set",
            path: ['animationURI'],
        })
        return z.NEVER;
    }

    if (!val.imageURI) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Image must be set",
            path: ['imageURI'],
        })
        return z.NEVER;
    }

    const output: ZoraEditionConfig = {
        name: val.name,
        symbol: val.symbol,
        editionSize: val.editionSize,
        royaltyBPS: val.royaltyBPS,
        fundsRecipient: val.creator,
        defaultAdmin: val.creator,
        saleConfig: {
            publicSalePrice: val.saleConfig.publicSalePrice,
            maxSalePurchasePerAddress: 2147483647, // max int32
            publicSaleStart: val.saleConfig.publicSaleStart,
            publicSaleEnd: val.saleConfig.publicSaleEnd,
            presaleStart: "0",
            presaleEnd: "0",
            presaleMerkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000"
        },
        description: val.description,
        animationURI: parseIpfsUrl(val.animationURI).raw,
        imageURI: parseIpfsUrl(val.imageURI).raw,
        referrer: "0xa943e039B1Ce670873ccCd4024AB959082FC6Dd8",
    }

    return output;
});

export type ZoraEditionConfig = z.infer<typeof EditionConfig>;
export type ConfigurableZoraEdition = z.infer<typeof ConfigurableZoraEditionSchema>;
export type ConfigurableZoraEditionInput = z.input<typeof ConfigurableZoraEditionSchema>;
export type ConfigurableZoraEditionOutput = z.output<typeof ConfigurableZoraEditionSchema>;


type ZodSafeParseErrorFormat = {
    [key: string]: { _errors: string[] };
};
export const EditionWizardReducer = (state: ConfigurableZoraEditionInput & { errors?: ZodSafeParseErrorFormat }, action: any) => {
    switch (action.type) {
        case "SET_FIELD":
            return {
                ...state,
                [action.payload.field]: action.payload.value,
                errors: { ...state.errors, [action.payload.field]: undefined }, // Clear error when field is set
            };
        case "SET_ERRORS":
            return {
                ...state,
                errors: action.payload,
            };
        default:
            return state;
    }
}


export const postDrop = async (url,
    {
        arg,
    }: {
        url: string;
        arg: {
            csrfToken: string;
            submissionId: string;
            contestId: string;
            contractAddress: string;
            chainId: number;
            dropConfig: ConfigurableZoraEditionOutput;
        }
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
                mutation CreateUserDrop($submissionId: ID!, $contestId: ID!, $contractAddress: String!, $chainId: Int!, $dropConfig: DropConfig!){
                    createUserDrop(submissionId: $submissionId, contestId: $contestId, contractAddress: $contractAddress, chainId: $chainId, dropConfig: $dropConfig){
                        success
                    }
                }`,
            variables: {
                csrfToken: arg.csrfToken,
                submissionId: arg.submissionId,
                contestId: arg.contestId,
                contractAddress: arg.contractAddress,
                chainId: arg.chainId,
                dropConfig: arg.dropConfig,
            },
        }),
    })
        .then((res) => res.json())
        .then(handleMutationError)
        .then((res) => res.data.createUserDrop);
}

export const flattenContractArgs = (args: ConfigurableZoraEditionOutput) => {
    if (!args) return null;
    return Object.entries(args).map(([key, val], idx) => {
        if (key === "saleConfig") return Object.values(val)
        return val;
    })
}

export default function useCreateZoraEdition(init_name: string, init_imageURI: string, init_animationURI: string, referrer?: string) {
    const [contractArguments, setContractArguments] = useState<ConfigurableZoraEditionOutput | null>(null);

    const isReferralValid = referrer ? referrer.startsWith('0x') && referrer.length === 42 : false;


    const [state, dispatch] = useReducer(EditionWizardReducer, {
        name: init_name ?? "",
        symbol: "",
        editionSize: "open",
        royaltyBPS: "zero",
        description: "",
        animationURI: init_animationURI ?? "",
        imageURI: init_imageURI ?? "",
        saleConfig: {
            publicSalePrice: "free",
            publicSaleStart: "now",
            publicSaleEnd: "forever",
        },
        errors: {},
    });


    const setField = (field: string, value: string) => {
        const keys = field.split('.');
        const lastKey = keys.pop();
        const lastObj = keys.reduce((stateObj, key) => stateObj[key] = stateObj[key] || {}, state);

        if (lastKey) {
            lastObj[lastKey] = value;
        }

        dispatch({
            type: 'SET_FIELD',
            payload: { field, value },
        });
    };

    const validate = (userAddress: Session['user']['address']) => {
        const { errors, ...rest } = state;
        const result = ConfigurableZoraEditionSchema.safeParse({
            ...rest,
            creator: userAddress,
        });

        if (!result.success) {
            // Formatting errors and dispatching
            const formattedErrors = (result as z.SafeParseError<typeof ConfigurableZoraEditionSchema>).error.format();
            dispatch({
                type: "SET_ERRORS",
                payload: formattedErrors, // Pass the formatted errors directly
            });
        }
        else if (result.success) {
            setContractArguments({
                ...result.data,
                referrer: isReferralValid ? referrer : "0xa943e039B1Ce670873ccCd4024AB959082FC6Dd8"
            });
        }
        return result;
    }

    return {
        contractArguments,
        state,
        setField,
        validate,
    }
}

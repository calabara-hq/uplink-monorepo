import { uint64MaxSafe } from "@/utils/uint64";
import { useReducer, useState } from "react";
import { z } from "zod";
import { Decimal } from 'decimal.js';
import { handleMutationError } from "@/lib/handleMutationError";
import { Session } from "@/providers/SessionProvider";
import { parseIpfsUrl } from "@/lib/ipfs";
import handleMediaUpload, { IpfsUpload, MediaUploadError } from "@/lib/mediaUpload";
import toast from "react-hot-toast";

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
    chainId: z.number().refine((n) => n === 8453 || n === 84531, { message: "Must be base network" }),
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



const calcSaleStart = (saleStart: string) => {
    const unixInS = (str: string | number | Date) => Math.floor(new Date(str).getTime() / 1000);
    const now = unixInS(new Date(Date.now()));
    if (saleStart === "now") return now;
    return unixInS(saleStart);
}

const calcSaleEnd = (saleEnd: string) => {
    const unixInS = (str: string | number | Date) => Math.floor(new Date(str).getTime() / 1000);
    const now = unixInS(new Date(Date.now()));
    const three_days = now + 259200;
    const week = now + 604800;
    if (saleEnd === "forever") return uint64MaxSafe;
    if (saleEnd === "3 days") return three_days;
    if (saleEnd === "week") return week;
    return unixInS(saleEnd);
}

export const EditionSaleConfigSchema = z.object({
    publicSalePrice: EditionPublicSalePriceSchema,
    publicSaleStart: z.union([z.string().datetime(), z.literal("now")]),
    publicSaleEnd: z.union([z.string().datetime(), z.literal("forever"), z.literal("week"), z.literal("3 days")]),
}).transform((val, ctx) => {
    const { publicSalePrice, publicSaleStart, publicSaleEnd } = val;
    const unixInS = (str: string | number | Date) => Math.floor(new Date(str).getTime() / 1000);
    const now = unixInS(new Date(Date.now()));
    const week = now + 604800;
    const unixSaleStart = calcSaleStart(publicSaleStart);
    const unixSaleEnd = calcSaleEnd(publicSaleEnd);
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

export const reserveMintBoardSlot = async (url,
    {
        arg,
    }: {
        url: string;
        arg: {
            csrfToken: string;
            spaceName: string;
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
                mutation ReserveMintBoardSlot($spaceName: String!){
                    reserveMintBoardSlot(spaceName: $spaceName){
                        success
                        slot
                    }
                }`,
            variables: {
                csrfToken: arg.csrfToken,
                spaceName: arg.spaceName,
            },
        }),
    })
        .then((res) => res.json())
        .then(handleMutationError)
        .then((res) => res.data.reserveMintBoardSlot);
}


export const postToMintBoard = async (url,
    {
        arg,
    }: {
        url: string;
        arg: {
            csrfToken: string;
            spaceName: string;
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
                mutation CreateMintBoardPost($spaceName: String!, $contractAddress: String!, $chainId: Int!, $dropConfig: DropConfig!){
                    createMintBoardPost(spaceName: $spaceName, contractAddress: $contractAddress, chainId: $chainId, dropConfig: $dropConfig){
                        success
                    }
                }`,
            variables: {
                csrfToken: arg.csrfToken,
                spaceName: arg.spaceName,
                contractAddress: arg.contractAddress,
                chainId: arg.chainId,
                dropConfig: arg.dropConfig,
            },
        }),
    })
        .then((res) => res.json())
        .then(handleMutationError)
        .then((res) => res.data.createMintBoardPost);
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

export default function useCreateZoraEdition(referrer?: string, templateConfig?: ConfigurableZoraEditionInput) {
    const [contractArguments, setContractArguments] = useState<ConfigurableZoraEditionOutput | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [animationBlob, setAnimationBlob] = useState<string | null>(null);
    const [imageBlob, setImageBlob] = useState<string | null>(null);
    const [thumbnailOptions, setThumbnailOptions] = useState<string[]>([]);
    const [thumbnailBlobIndex, setThumbnailBlobIndex] = useState<number | null>(null);
    const [isVideo, setIsVideo] = useState(false);


    const isReferralValid = referrer ? referrer.startsWith('0x') && referrer.length === 42 : false;

    const baseConfig = {
        name: "",
        symbol: "",
        editionSize: "open",
        royaltyBPS: "zero",
        description: "",
        animationURI: "",
        imageURI: "",
        saleConfig: {
            publicSalePrice: "free",
            publicSaleStart: "now",
            publicSaleEnd: "forever",
        },
        errors: {},
    }

    const initState = templateConfig ? { ...baseConfig, ...templateConfig } : baseConfig;

    const [state, dispatch] = useReducer(EditionWizardReducer, initState);


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


    const handleThumbnailChoice = async () => {
        if (thumbnailBlobIndex === null) return null;
        if (state.imageURI) return state.imageURI;
        try {
            setIsUploading(true)
            const blob = await fetch(thumbnailOptions[thumbnailBlobIndex]).then(r => r.blob())
            return await IpfsUpload(blob).then(url => {
                setField('imageURI', url);
                setIsUploading(false);
                return url;
            })
        } catch (e) {
            console.log(e);
            setIsUploading(false);
            setField('imageURI', '');
        }
    }

    const validate = async (userAddress: Session['user']['address']) => {

        const videoThumbnailUrl = state.animationURI ? await handleThumbnailChoice() : '';

        const { errors, ...rest } = state;

        const result = ConfigurableZoraEditionSchema.safeParse({
            ...rest,
            creator: userAddress,
            imageURI: videoThumbnailUrl || state.imageURI,
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


    const handleFileChange = ({
        event,
        isVideo,
        mode,
    }: {
        event: any;
        isVideo: boolean;
        mode: "primary" | "thumbnail";
    }) => {
        if (mode === "primary") {
            setIsUploading(true)

            handleMediaUpload(
                event,
                ["image", "video", "svg"],
                (mimeType) => {
                    setIsVideo(mimeType.includes("video"));
                },
                (base64, mimeType) => {
                    if (mimeType.includes("video")) setAnimationBlob(base64);
                    else setImageBlob(base64);
                },
                (ipfsUrl, mimeType) => {
                    if (mimeType.includes("video")) setField('animationURI', ipfsUrl);
                    else setField('imageURI', ipfsUrl);
                    setIsUploading(false);
                },
                (thumbnails) => {
                    setThumbnailOptions(thumbnails);
                    setThumbnailBlobIndex(0);

                },
                (size) => { }
            ).catch((err) => {

                if (err instanceof MediaUploadError) {
                    toast.error(err.message)
                }
                else {
                    console.log(err)
                    toast.error('Something went wrong. Please try again later.')
                }

                // clear out all the fields for the users next attempt
                setField('imageURI', '');
                setField('animationURI', '');
                setThumbnailOptions([]);
                setThumbnailBlobIndex(null);
                setImageBlob(null);
                setAnimationBlob(null);

            });
        }
        else if (mode === "thumbnail") {
            handleMediaUpload(
                event,
                ["image"],
                (mimeType) => { },
                (base64) => {
                    const existingThumbnailOptions = [...thumbnailOptions];
                    setThumbnailOptions([...existingThumbnailOptions, base64])
                    setThumbnailBlobIndex(existingThumbnailOptions.length);
                },
                (ipfsUrl) => {
                    setField("imageURI", ipfsUrl);
                },

            ).catch(() => {

            });
        }
    }



    return {
        contractArguments,
        setContractArguments,
        state,
        setField,
        validate,
        isUploading,
        animationBlob,
        imageBlob,
        thumbnailOptions,
        thumbnailBlobIndex,
        isVideo,
        setThumbnailBlobIndex,
        removeMedia: () => {
            setField('imageURI', '');
            setField('animationURI', '');
            setThumbnailOptions([]);
            setThumbnailBlobIndex(null);
            setImageBlob(null);
            setAnimationBlob(null);
            setIsVideo(false);
        },
        handleFileChange,
    }
}

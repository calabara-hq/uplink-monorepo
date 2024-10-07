"use client";
import { useReducer } from "react";
import { z } from "zod";
import { parseUnits, zeroAddress } from "viem";
import { DynamicLogicInputs, CreateFiniteChannelConfig } from '@tx-kit/sdk';
import {
    UniformInteractionPower,
    validateFiniteChannelInputs,
    WeightedInteractionPower,
} from '@tx-kit/sdk/utils';
import { getDynamicLogicAddress, NATIVE_TOKEN } from '@tx-kit/sdk/constants';
import { createWeb3Client } from "@/lib/viem";
import { Address, maxUint40 } from "viem";
import { normalize } from "viem/ens"
import { parseIpfsUrl, pinJSONToIpfs } from "@/lib/ipfs";
import { useSession } from "@/providers/SessionProvider";
import { Space } from "@/types/space";
import { CreateTokenInputs } from "./useCreateTokenReducer";
import { UploadToIpfsTokenMetadata } from "@/types/channel";
import { getTokenInfo } from "@/lib/tokenInfo";

const mainnetClient = createWeb3Client(1);

const convertEns = async (value: string | Address) => {
    if (value.endsWith(".eth")) {
        const resolved = await mainnetClient.getEnsAddress({
            name: normalize(value)
        });
        return resolved;
    }
    else return value;
}

const constructTokenMetadata = (input: CreateTokenInputs): UploadToIpfsTokenMetadata => {

    const imageUri = parseIpfsUrl(input.imageURI).raw;

    const metadata: UploadToIpfsTokenMetadata = {
        name: input.title,
        description: input.description,
        image: imageUri,
        type: input.type,
        content: {
            mime: input.mimeType,
            uri: imageUri
        }
    }

    if (input.animationURI) {
        const animationUri = parseIpfsUrl(input.animationURI).raw;
        metadata.animation_uri = animationUri;
        metadata.content.uri = animationUri;
    }

    return metadata;
}

const parseSaleDuration = (value: string): number => {
    if (value === "3 days") return 259200;
    if (value === "week") return 604800;
    else return Number(maxUint40);
}


export const InteractionLogicSchema = z.object({
    chainId: z.union([z.literal(8453), z.literal(84532)]),
    targetType: z.literal("balanceOf"),
    target: z.string().min(1, { message: "Target is required" }),
    signature: z.string().min(1, { message: "Signature is required" }),
    operator: z.union([z.literal("lt"), z.literal("gt"), z.literal("eq")]),
    data: z.string(),
    literalOperand: z.string().min(1, { message: "Literal operand is required" }),
    interactionPowerType: z.union([z.literal("uniform"), z.literal("dynamic")]),
    interactionPower: z.string().min(1, { message: "Interaction power is required" }),
}).transform(async (input, ctx) => {

    const fetchTokenDecimals = async (token: string) => {
        if (token === NATIVE_TOKEN) return 18;
        const { decimals } = await getTokenInfo({ contractAddress: token as Address, chainId: input.chainId });
        return decimals;
    }

    const buildInteractionPower = (type: string, value: string): UniformInteractionPower | WeightedInteractionPower => {
        if (type === "uniform") {
            return new UniformInteractionPower(BigInt(value));
        }
        else {
            return new WeightedInteractionPower();
        }
    }

    const buildReadOperation = async (baseRule: UniformInteractionPower | WeightedInteractionPower, operator: string, literalOperand: string, target: string, signature: string, data: string): Promise<DynamicLogicInputs> => {
        const decimals = await fetchTokenDecimals(target);
        if (operator === "lt") return baseRule.ifResultOf(target, signature, data).lt(parseUnits(literalOperand, decimals));
        else if (operator === "eq") return baseRule.ifResultOf(target, signature, data).eq(parseUnits(literalOperand, decimals));
        else return baseRule.ifResultOf(target, signature, data).gt(parseUnits(literalOperand, decimals));
    }

    const interactionPower = buildInteractionPower(input.interactionPowerType, input.interactionPower);
    const logic = buildReadOperation(interactionPower, input.operator, input.literalOperand, input.target, input.signature, input.data);

    return logic;
})

export const ContestSettingsSchema = z.object({

    chainId: z.union([z.literal(8453), z.literal(84532)]),
    defaultAdmin: z.string(),
    managers: z.array(z.string()),

    // metadata
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    imageURI: z.string().min(1, { message: "Media is required" }),
    animationURI: z.string(),

    // deadlines
    createStart: z.number().min(1, { message: "Submit date is required" }),
    mintStart: z.number().min(1, { message: "Vote date is required" }),
    mintEnd: z.number().min(1, { message: "Contest end date is required" }),

    // transport layer

    rewardToken: z.string(),
    rewardRanks: z.array(z.number()),
    rewardAllocations: z.array(z.string()),

    // setupActions

    logicContract: z.union([z.literal(zeroAddress), z.literal("DYNAMIC_LOGIC_ADDRESS")]),
    creatorLogic: z.array(InteractionLogicSchema),
    minterLogic: z.array(InteractionLogicSchema),

    feeContract: z.union([z.literal(zeroAddress), z.literal("CUSTOM_FEES_ADDRESS")]),
    channelTreasury: z.string(),
    uplinkPercentage: z.string().transform(val => parseFloat(val || "0")),
    channelPercentage: z.string().transform(val => parseFloat(val || "0")),
    creatorPercentage: z.string().transform(val => parseFloat(val || "0")),
    mintReferralPercentage: z.string().transform(val => parseFloat(val || "0")),
    sponsorPercentage: z.string().transform(val => parseFloat(val || "0")),
    ethMintPrice: z.string(),
    erc20MintPrice: z.string(),
    erc20Contract: z.string().startsWith("0x"),
}).transform(async (data, ctx) => {
    const ipfsData = constructTokenMetadata(data);


    const fetchTokenDecimals = async (token: string) => {
        if (token === NATIVE_TOKEN) return 18;
        const { decimals } = await getTokenInfo({ contractAddress: token as Address, chainId: data.chainId });
        return decimals;
    }

    const [ipfsUrl, rewardTokenDecimals] = await Promise.all([
        pinJSONToIpfs(ipfsData),
        fetchTokenDecimals(data.rewardToken),
    ]);

    if (!ipfsUrl) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            "message": "Failed to upload metadata to ipfs"
        })
    }

    if (data.erc20Contract !== zeroAddress && data.erc20MintPrice === "0") {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["erc20MintPrice"],
            "message": "Invalid ERC20 mint price"
        })
    }

    // move the decimals to the other schema validation
    const setupActions = data.logicContract === zeroAddress ? [] : [{
        logicContract: data.logicContract === "DYNAMIC_LOGIC_ADDRESS" ? getDynamicLogicAddress(data.chainId) : data.logicContract,
        creatorLogic: data.creatorLogic,
        minterLogic: data.minterLogic
    }]


    const rewardAllocations = data.rewardAllocations.map(alloc => parseUnits(alloc, rewardTokenDecimals));

    const config: CreateFiniteChannelConfig = {
        uri: ipfsUrl.raw,
        name: data.title,
        defaultAdmin: data.defaultAdmin,
        managers: data.managers,
        setupActions: setupActions,
        transportLayer: {
            createStartInSeconds: data.createStart,
            mintStartInSeconds: data.mintStart,
            mintEndInSeconds: data.mintEnd,
            rewards: {
                ranks: data.rewardRanks,
                allocations: rewardAllocations,
                totalAllocation: rewardAllocations.reduce((acc, curr) => acc + curr, BigInt(0)),
                token: data.rewardToken
            }

        }

    }

    try {
        validateFiniteChannelInputs(config);
    } catch (e) {

        console.log(e)
        // if (e.message.startsWith("Invalid eth mint price")) {
        //     ctx.addIssue({
        //         path: ["ethMintPrice"],
        //         code: z.ZodIssueCode.custom,
        //         "message": e.message
        //     })
        // }

        // if (e.message.startsWith("Invalid address")) {
        //     ctx.addIssue({
        //         path: ["channelTreasury"],
        //         code: z.ZodIssueCode.custom,
        //         message: "Invalid space treasury address"
        //     })
        // }


        // if (e.message.startsWith("Fee percentages must add up to 100")) {
        //     ctx.addIssue({
        //         path: ["feePercentages"],
        //         code: z.ZodIssueCode.custom,
        //         message: e.message
        //     })
        // }

        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: e.message
        })
    }

    return config;
})

export type InteractionLogicInput = z.input<typeof InteractionLogicSchema>;
export type InteractionLogicOutput = z.output<typeof InteractionLogicSchema>;
export type ContestSettingsInput = z.input<typeof ContestSettingsSchema>;
export type ContestSettingsOutput = z.output<typeof ContestSettingsSchema>;

type ZodSafeParseErrorFormat = {
    [key: string]: { _errors: string[] };
};

export const baseConfig: ContestSettingsInput & { errors: ZodSafeParseErrorFormat } = {
    chainId: 8453,

    defaultAdmin: "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C",
    managers: [],

    title: "test",
    description: "test",
    imageURI: "",
    animationURI: "",

    createStart: undefined,
    mintStart: undefined,
    mintEnd: undefined,

    rewardToken: "",
    rewardRanks: [],
    rewardAllocations: [],

    logicContract: zeroAddress,
    creatorLogic: [
        {
            chainId: 8453,
            target: "0x0578d8A44db98B23BF096A382e016e29a5Ce0ffe",
            targetType: "balanceOf",
            signature: "0x70a08231",
            operator: "gt",
            interactionPowerType: "uniform",
            literalOperand: "0",
            interactionPower: "1",
            data: "0x0000000000000000000000000000000000000000"

        }
    ],
    minterLogic: [],

    feeContract: zeroAddress,
    channelTreasury: zeroAddress,
    uplinkPercentage: "",
    channelPercentage: "",
    creatorPercentage: "",
    mintReferralPercentage: "",
    sponsorPercentage: "",
    ethMintPrice: "0",
    erc20MintPrice: "0",
    erc20Contract: zeroAddress,
    errors: {},
}


export type ContestSettingsStateType = ContestSettingsInput & { errors?: ZodSafeParseErrorFormat };


export const StateReducer = (state: ContestSettingsStateType, action: { type: string, payload: any }) => {
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


export function useCreateContestSettings(spaceData: Space) {
    const { data: session, status } = useSession();

    const initialState: ContestSettingsInput = {
        ...baseConfig,
        managers: spaceData.admins.map(admin => admin.address),
        imageURI: parseIpfsUrl(spaceData.logoUrl).raw,
    }

    const [state, dispatch] = useReducer(StateReducer, initialState);

    const setField = (field: string, value: any) => {
        dispatch({
            type: 'SET_FIELD',
            payload: { field, value },
        });
    }

    const setErrors = (errors: ZodSafeParseErrorFormat) => {
        dispatch({
            type: 'SET_ERRORS',
            payload: errors,
        });
    }

    const validateContestSettings = async () => {
        const { errors, ...rest } = state;
        const result = await ContestSettingsSchema.safeParseAsync({
            ...rest,
            defaultAdmin: session?.user?.address ?? "",
        });
        if (!result.success) {
            const formattedErrors = (result as z.SafeParseError<typeof ContestSettingsSchema>).error.format();
            console.log(formattedErrors);
            dispatch({
                type: "SET_ERRORS",
                payload: formattedErrors,
            });
        }

        return result;
    }


    return {
        state,
        setField,
        validateContestSettings
    }

}
"use client";
import { useReducer, useState } from "react";
import { z } from "zod";
import { parseEther, zeroAddress } from "viem";
import { TransmissionsClient, CreateInfiniteChannelConfig, validateInfiniteTransportLayer, validateSetFeeInputs } from '@tx-kit/sdk';
import { validateInfiniteChannelInputs, ChannelFeeArguments } from '@tx-kit/sdk';
import { getCustomFeesAddress } from '@tx-kit/sdk/constants';
import { createWeb3Client } from "@/lib/viem";
import { Address, maxUint40 } from "viem";
import { normalize } from "viem/ens"
import { parseIpfsUrl, pinJSONToIpfs } from "@/lib/ipfs";
import { useSession } from "@/providers/SessionProvider";
import _ from "lodash";
import { Space } from "@/types/space";
import { CreateTokenInputs } from "./useCreateTokenReducer";
import { TokenMetadata, UploadToIpfsTokenMetadata } from "@/types/channel";

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


export const MintBoardSettingsSchema = z.object({

    chainId: z.union([z.literal(8453), z.literal(84532)]),
    defaultAdmin: z.string(),
    managers: z.array(z.string()),

    // metadata
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    imageURI: z.string().min(1, { message: "Media is required" }),
    animationURI: z.string(),


    // transport layer
    saleDuration: z.string(),

    // setupActions
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
})


export const EditMintBoardSettingsSchema = MintBoardSettingsSchema.transform(async (data, ctx) => {

    const ipfsData = constructTokenMetadata(data);

    const [channelTreasury, ipfsUrl] = await Promise.all([
        convertEns(data.channelTreasury),
        pinJSONToIpfs(ipfsData)
    ]);

    if (!ipfsUrl) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            "message": "Failed to upload metadata to ipfs"
        })
    }


    const updatedFees: ChannelFeeArguments = data.feeContract === zeroAddress ? {
        feeContract: zeroAddress,
        feeArgs: null
    } : {
        feeContract: data.feeContract === "CUSTOM_FEES_ADDRESS" ? getCustomFeesAddress(data.chainId) : data.feeContract,
        feeArgs: {
            channelTreasury,
            uplinkPercentage: data.uplinkPercentage,
            channelPercentage: data.channelPercentage,
            creatorPercentage: data.creatorPercentage,
            mintReferralPercentage: data.mintReferralPercentage,
            sponsorPercentage: data.sponsorPercentage,
            ethMintPrice: parseEther(data.ethMintPrice),
            erc20MintPrice: BigInt(0),
            erc20Contract: data.erc20Contract
        }
    }

    const updatedMetadata = {
        uri: ipfsUrl.raw,
        name: data.title,
    }

    const updatedTransportLayer = {
        saleDurationInSeconds: parseSaleDuration(data.saleDuration),
    }


    const result = {
        updatedFees,
        updatedMetadata,
        updatedTransportLayer
    }

    try {

        validateInfiniteTransportLayer(result.updatedTransportLayer)
        validateSetFeeInputs(result.updatedFees)
        return result;

    } catch (e) {

        if (e.message.startsWith("Invalid eth mint price")) {
            ctx.addIssue({
                path: ["ethMintPrice"],
                code: z.ZodIssueCode.custom,
                "message": e.message
            })
        }

        if (e.message.startsWith("Invalid address")) {
            ctx.addIssue({
                path: ["channelTreasury"],
                code: z.ZodIssueCode.custom,
                message: "Invalid space treasury address"
            })
        }


        if (e.message.startsWith("Fee percentages must add up to 100")) {
            ctx.addIssue({
                path: ["feePercentages"],
                code: z.ZodIssueCode.custom,
                message: e.message
            })
        }


        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: e.message
        })
    }

})


export const NewMintBoardSettingsSchema = MintBoardSettingsSchema.transform(async (data, ctx) => {
    const ipfsData = constructTokenMetadata(data);

    const [channelTreasury, ipfsUrls] = await Promise.all([
        convertEns(data.channelTreasury),
        pinJSONToIpfs(ipfsData)
    ]);

    if (!ipfsUrls) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            "message": "Failed to upload metadata to ipfs"
        })
    }


    const setupActions = data.feeContract === zeroAddress ? [] : [{
        feeContract: data.feeContract === "CUSTOM_FEES_ADDRESS" ? getCustomFeesAddress(data.chainId) : data.feeContract,
        feeArgs: {
            channelTreasury,
            uplinkPercentage: data.uplinkPercentage,
            channelPercentage: data.channelPercentage,
            creatorPercentage: data.creatorPercentage,
            mintReferralPercentage: data.mintReferralPercentage,
            sponsorPercentage: data.sponsorPercentage,
            ethMintPrice: parseEther(data.ethMintPrice),
            erc20MintPrice: BigInt(data.erc20MintPrice),
            erc20Contract: data.erc20Contract
        }
    }]


    const config: CreateInfiniteChannelConfig = {
        uri: ipfsUrls.raw,
        name: data.title,
        defaultAdmin: data.defaultAdmin,
        managers: data.managers,
        setupActions: setupActions,
        transportLayer: {
            saleDurationInSeconds: parseSaleDuration(data.saleDuration),
        }

    }

    try {
        validateInfiniteChannelInputs(config);
    } catch (e) {

        if (e.message.startsWith("Invalid eth mint price")) {
            ctx.addIssue({
                path: ["ethMintPrice"],
                code: z.ZodIssueCode.custom,
                "message": e.message
            })
        }

        if (e.message.startsWith("Invalid address")) {
            ctx.addIssue({
                path: ["channelTreasury"],
                code: z.ZodIssueCode.custom,
                message: "Invalid space treasury address"
            })
        }


        if (e.message.startsWith("Fee percentages must add up to 100")) {
            ctx.addIssue({
                path: ["feePercentages"],
                code: z.ZodIssueCode.custom,
                message: e.message
            })
        }

        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: e.message
        })
    }

    return config;
})



export type MintBoardSettingsInput = z.input<typeof MintBoardSettingsSchema>;
export type NewMintBoardSettingsOutput = z.output<typeof NewMintBoardSettingsSchema>;
export type EditMintBoardSettingsOutput = z.output<typeof EditMintBoardSettingsSchema>;


type ZodSafeParseErrorFormat = {
    [key: string]: { _errors: string[] };
};

export const baseConfig: MintBoardSettingsInput & { errors: ZodSafeParseErrorFormat } = {
    chainId: 8453,
    defaultAdmin: "",
    managers: [],
    title: "",
    description: "",
    imageURI: "",
    animationURI: "",
    saleDuration: "week",
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


export type SettingsStateType = MintBoardSettingsInput & { errors?: ZodSafeParseErrorFormat };


export const StateReducer = (state: SettingsStateType, action: { type: string, payload: any }) => {
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


export function useMintBoardSettings(priorState: MintBoardSettingsInput | null, spaceData: Space) {
    const { data: session, status } = useSession();

    const initialState: MintBoardSettingsInput = {
        ...baseConfig,
        ...priorState,
        managers: spaceData.admins.map(admin => admin.address),
        imageURI: parseIpfsUrl(spaceData.logoUrl).raw,
    }

    const [state, dispatch] = useReducer(StateReducer, initialState);

    const setField = (field: string, value: string | boolean | number) => {
        dispatch({
            type: 'SET_FIELD',
            payload: { field, value },
        });
    }


    const validateEditMintboardSettings = async (): Promise<z.SafeParseReturnType<MintBoardSettingsInput, EditMintBoardSettingsOutput>> => {
        const { errors, ...rest } = state;
        const parseResult = await EditMintBoardSettingsSchema.safeParseAsync({
            ...rest,
            defaultAdmin: session?.user?.address ?? "",
        });
        if (!parseResult.success) {
            const formattedErrors = (parseResult as z.SafeParseError<typeof EditMintBoardSettingsSchema>).error.format();
            dispatch({
                type: "SET_ERRORS",
                payload: formattedErrors,
            });
            console.log("Errors", formattedErrors)
        }

        return parseResult
    }

    const validateNewMintboardSettings = async () => {
        const { errors, ...rest } = state;
        const result = await NewMintBoardSettingsSchema.safeParseAsync({
            ...rest,
            defaultAdmin: session?.user?.address ?? "",
        });
        if (!result.success) {
            const formattedErrors = (result as z.SafeParseError<typeof NewMintBoardSettingsSchema>).error.format();
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
        validateEditMintboardSettings,
        validateNewMintboardSettings
    }

}
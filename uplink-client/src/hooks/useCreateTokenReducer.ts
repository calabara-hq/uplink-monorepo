"use client";
import { parseIpfsUrl, pinJSONToIpfs } from '@/lib/ipfs';
import { z } from 'zod';
import { validateCreateTokenInputs, CreateTokenConfig } from "@tx-kit/sdk";
import { Address, http, maxUint256 } from 'viem';
import { useEffect, useReducer, useState } from 'react';
import { useCreateToken, useCreateTokenIntent } from "@tx-kit/hooks"
import { UploadToIpfsTokenMetadata } from '@/types/channel';
import { useConnect, useConnectors, useWalletClient } from 'wagmi';
import { ENTRYPOINT_ADDRESS_V06 } from "permissionless";
import { paymasterActionsEip7677 } from "permissionless/experimental";



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

export const CreateTokenSchema = z.object({
    channelAddress: z.string().startsWith("0x").length(42, { message: "Invalid channel address" }),
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string(),
    type: z.literal("uplink-v2"),
    imageURI: z.string().min(1, { message: "Media is required" }),
    animationURI: z.string(),
    mimeType: z.string(),
    maxSupply: z.string().min(1, { message: "Token supply is required" })
}).transform(async (data, ctx) => {

    const ipfsData = constructTokenMetadata(data);
    const ipfsUrl = await pinJSONToIpfs(ipfsData);

    if (!ipfsUrl) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Failed to upload metadata to ipfs"
        })
    }

    const config: CreateTokenConfig = {
        channelAddress: data.channelAddress,
        uri: ipfsUrl.raw,
        maxSupply: BigInt(data.maxSupply)
    }

    try {
        validateCreateTokenInputs(config)
    } catch (e) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            "message": e.message
        })
    }

    return config;
});

export type CreateTokenInputs = z.input<typeof CreateTokenSchema>;
export type CreateTokenOutputs = z.output<typeof CreateTokenSchema>;

type ZodSafeParseErrorFormat = {
    [key: string]: { _errors: string[] };
};

export const baseConfig: CreateTokenInputs & { errors: ZodSafeParseErrorFormat } = {
    channelAddress: "",
    title: "",
    description: "",
    type: "uplink-v2",
    imageURI: "",
    animationURI: "",
    maxSupply: maxUint256.toString(),
    errors: {}
}

export const stateReducer = (state: CreateTokenInputs & { errors?: ZodSafeParseErrorFormat }, action: { type: string, payload: any }) => {
    switch (action.type) {
        case "SET_FIELD":
            return {
                ...state,
                [action.payload.field]: action.payload.value
            }
        case "SET_ERRORS":
            return {
                ...state,
                errors: action.payload
            }
        default:
            return state;
    }
}

export const useCreateTokenReducer = (channelAddress: string) => {
    const { connectors } = useConnect();
    const { data: walletClient } = useWalletClient();

    const { status: createIntentStatus, createTokenIntent, signedIntent, error: createIntentError } = useCreateTokenIntent()
    const { status: createTokenStatus, createToken, tokenId, txHash: createTokenHash, error: createTokenError } = useCreateToken()

    const [isIntent, setIsIntent] = useState<boolean>(true)
    const [state, dispatch] = useReducer(stateReducer, {
        ...baseConfig,
        channelAddress
    })

    const setField = (field: string, value: any) => {
        dispatch({
            type: "SET_FIELD",
            payload: {
                field,
                value
            }
        })
    }

    const validate = async () => {
        const { errors, ...rest } = state;
        const result = await CreateTokenSchema.safeParseAsync(rest);

        if (!result.success) {
            const formattedErrors = (result as z.SafeParseError<typeof CreateTokenSchema>).error.format();
            console.log(formattedErrors)
            dispatch({
                type: "SET_ERRORS",
                payload: formattedErrors
            })
        }

        return result;
    }


    return {
        state,
        setField,
        validate,
        isIntent,
        setIsIntent,
        txError: isIntent ? createIntentError : createTokenError,
        txStatus: isIntent ? createIntentStatus : createTokenStatus,
        tx: isIntent ? createTokenIntent : createToken,
        txResponse: isIntent ? signedIntent : tokenId,
        txHash: isIntent ? null : createTokenHash
    }


}
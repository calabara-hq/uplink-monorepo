"use client";

import { useReducer, useState } from "react";
import { z } from "zod";
import { FieldError, SectionWrapper } from "./Utils";
import { MediaUpload } from "../MediaUpload/MediaUpload";
import { MarkdownEditor } from "../Studio/StudioTools";
import { parseIpfsUrl, pinJSONToIpfs, replaceGatewayLinksInString } from "@/lib/ipfs";
import { CreateTokenInputs } from "@/hooks/useCreateTokenReducer";
import { UploadToIpfsTokenMetadata } from "@/types/channel";
import { Label } from "../DesignKit/Label";
import { Input } from "../DesignKit/Input";


const constructTokenMetadata = (input: CreateTokenInputs): UploadToIpfsTokenMetadata => {

    const imageUri = parseIpfsUrl(input.imageURI).raw;

    const metadata: UploadToIpfsTokenMetadata = {
        name: input.title,
        description: replaceGatewayLinksInString(input.description),
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

const metadataSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    imageURI: z.string().min(1, { message: "Media is required" }),
    animationURI: z.string(),
}).transform(async (data, ctx) => {

    const ipfsData = constructTokenMetadata(data);
    const ipfsUrl = await pinJSONToIpfs(ipfsData);

    if (!ipfsUrl) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            "message": "Failed to upload metadata to ipfs"
        })
    }

    return {
        uri: ipfsUrl.raw
    }
});

type ZodSafeParseErrorFormat = {
    [key: string]: { _errors: string[] };
};

export type MetadataInput = z.input<typeof metadataSchema>;
export type MetadataOutput = z.output<typeof metadataSchema>;
export type MetadataState = MetadataInput & { errors?: ZodSafeParseErrorFormat };

const MetadataReducer = (state: MetadataState, action: { type: string; payload: any }): MetadataState => {
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

export const useMetadataSettings = (initialState?: MetadataInput) => {
    const [metadata, dispatch] = useReducer(MetadataReducer, {
        title: "",
        description: "",
        imageURI: "",
        animationURI: "",
        ...initialState,
    });

    const setMetadata = (field: string, value: any) => {
        dispatch({
            type: 'SET_FIELD',
            payload: { field, value },
        });
    }

    const validateMetadata = async () => {
        const { errors, ...rest } = metadata;
        const result = await metadataSchema.safeParseAsync(rest);

        if (!result.success) {
            const formattedErrors = (result as z.SafeParseError<typeof metadataSchema>).error.format();
            dispatch({
                type: "SET_ERRORS",
                payload: formattedErrors,
            });
            throw new Error("Failed to validate metadata");
        }

        return result;
    }
    return {
        metadata,
        setMetadata,
        validateMetadata,
    };
}

export const Metadata = ({ metadata, setMetadata }: { metadata: MetadataState, setMetadata: (field: string, value: any) => void }) => {
    const [isUploading, setIsUploading] = useState(false)

    const uploadStatusCallback = (status: boolean) => {
        setIsUploading(status)
    }

    const ipfsImageCallback = (url: string) => {
        setMetadata("imageURI", url)
    }

    const ipfsAnimationCallback = (url: string) => {
        setMetadata("animationURI", url)
    }

    const mimeTypeCallback = (mimeType: string) => {
        setMetadata("mimeType", mimeType);
    }

    return (
        <SectionWrapper title="Details">
            <div className="flex flex-col max-w-xs">
                <MediaUpload
                    acceptedFormats={['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'image/webp']}
                    uploadStatusCallback={uploadStatusCallback}
                    ipfsImageCallback={ipfsImageCallback}
                    ipfsAnimationCallback={ipfsAnimationCallback}
                    mimeTypeCallback={mimeTypeCallback}
                    maxVideoDuration={210}
                />
                {metadata.errors?.imageURI?._errors && (
                    <label className="label">
                        <span className="label-text-alt text-error max-w-sm overflow-wrap break-word">{metadata.errors.imageURI._errors.join(",")}</span>
                    </label>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <Label>Title</Label>
                <Input variant="outline" className="rounded-lg" value={metadata.title} onChange={(e) => setMetadata("title", e.target.value)} />
                {metadata.errors?.title?._errors && (
                    <FieldError error={metadata.errors.title._errors.join(",")} />
                )}
            </div>

            <MarkdownEditor onChange={(md) => setMetadata("description", md)} label={"Description"} error={metadata.errors?.description?._errors} markdown="" />

        </SectionWrapper>
    )
}
import { OutputData } from "@editorjs/editorjs";
import { toast } from "react-hot-toast";
import handleMediaUpload from "@/lib/mediaUpload";


export type SubmissionBuilderProps = {
    title: string;
    primaryAssetUrl: string | null;
    primaryAssetBlob: string | null;
    videoThumbnailUrl: string | null;
    videoThumbnailBlob: string | null;
    isVideo: boolean;
    isUploading: boolean;
    submissionBody: OutputData | null;
    errors: {
        type?: string;
        title?: string;
        primaryAsset?: string;
        videoThumbnail?: string;
        submissionBody?: string;
    };
};



export const reducer = (state: SubmissionBuilderProps, action: any) => {
    switch (action.type) {
        case "SET_FIELD":
            return {
                ...state,
                [action.payload.field]: action.payload.value,
                errors: {
                    ...state.errors,
                    [action.payload.field]: undefined,
                },
            };

        case "SET_ERRORS":
            return {
                ...state,
                errors: action.payload,
            };
        default:
            return state;
    }
};


export const setField = ({
    dispatch,
    field,
    value,
}: {
    dispatch: React.Dispatch<any>;
    field: string;
    value: any;
}) => {
    dispatch({
        type: "SET_FIELD",
        payload: { field, value },
    });
};

export const setErrors = ({
    dispatch,
    errors,
}: {
    dispatch: React.Dispatch<any>;
    errors: any;
}) => {
    dispatch({
        type: "SET_ERRORS",
        payload: errors,
    });
};

export const handleFileChange = ({
    event,
    dispatch,
    isVideo,
    mode
}: {
    event: any;
    dispatch: React.Dispatch<any>;
    isVideo: boolean;
    mode: "primary" | "thumbnail";
}) => {

    if (mode === "primary") {
        setField({ dispatch, field: "isUploading", value: true });

        handleMediaUpload(
            event,
            ["image", "video"],
            (mimeType) => {
                setField({
                    dispatch,
                    field: "isVideo",
                    value: mimeType.includes("video"),
                });
            },
            (base64) => {
                if (!isVideo) {
                    setField({ dispatch, field: "primaryAssetBlob", value: base64 });
                }
            },
            (ipfsUrl) => {
                setField({ dispatch, field: "primaryAssetUrl", value: ipfsUrl });
                setField({ dispatch, field: "isUploading", value: false });
            }
        ).catch(() => {
            setField({ dispatch, field: "isUploading", value: false });
            setField({
                dispatch,
                field: "isVideo",
                value: false,
            });
        });
    }
    else if (mode === "thumbnail") {
        handleMediaUpload(
            event,
            ["image"],
            (mimeType) => { },
            (base64) => {
                setField({ dispatch, field: "videoThumbnailBlob", value: base64 });
            },
            (ipfsUrl) => {
                setField({ dispatch, field: "videoThumbnailUrl", value: ipfsUrl });
            }
        ).catch(() => {

        });
    }
};


export const validateSubmission = (submissionState: any) => {
    const {
        title,
        primaryAssetUrl,
        videoThumbnailUrl,
        submissionBody,
        isVideo,
    } = submissionState;

    if (!title) {
        return {
            isError: true,
            errors: {
                title: "Please provide a title",
            },
        };
    }

    if (title.length < 3) {
        return {
            isError: true,
            errors: {
                title: "Title must be at least 3 characters",
            },
        };
    }

    if (title.length > 100) {
        return {
            isError: true,
            errors: {
                title: "Title must be less than 100 characters",
            },
        };
    }

    let type = null;
    if (isVideo) type = "video";
    else if (primaryAssetUrl) type = "image";
    else if (submissionBody) type = "text";

    if (!type) {
        return {
            isError: true,
            errors: {
                type: "Please upload an image, video, or text",
            },
        };
    }

    if (type === "video" && !videoThumbnailUrl) {
        return {
            isError: true,
            errors: {
                videoThumbnail: "Please choose a thumbnail for your video",
            },
        };
    }

    if (type === "text" && submissionBody?.blocks.length === 0) {
        return {
            isError: true,
            errors: {
                submissionBody: "Please provide a submission body",
            },
        };
    }

    return {
        isError: false,
        payload: {
            title: title.trim(),
            ...(videoThumbnailUrl ?
                { previewAsset: videoThumbnailUrl, videoAsset: primaryAssetUrl }
                : (primaryAssetUrl ? { previewAsset: primaryAssetUrl } : {})),
            ...(submissionBody ? { body: submissionBody } : {}),
        }
    }
};
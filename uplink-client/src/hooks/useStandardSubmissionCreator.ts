import type { OutputData } from "@editorjs/editorjs";
import handleMediaUpload, { IpfsUpload, MediaUploadError } from "@/lib/mediaUpload";
import { useReducer } from "react";
import { toast } from "react-hot-toast";

export type SubmissionBuilderProps = {
    title: string;
    primaryAssetUrl: string | null;
    videoThumbnailUrl: string | null;
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

export const useStandardSubmissionCreator = () => {
    const [state, dispatch] = useReducer(reducer, {
        title: "",
        primaryAssetUrl: null,
        videoThumbnailUrl: null,
        submissionBody: null,
        errors: {},
    });


    const setSubmissionTitle = (value: string) => {
        dispatch({
            type: "SET_FIELD",
            payload: { field: "title", value },
        });
    }

    const setSubmissionBody = (value: OutputData) => {
        dispatch({
            type: "SET_FIELD",
            payload: { field: "submissionBody", value },
        });
    }

    const setPrimaryAssetUrl = (value: string) => {
        dispatch({
            type: "SET_FIELD",
            payload: { field: "primaryAssetUrl", value },
        });
    }

    const setVideoThumbnailUrl = (value: string) => {
        dispatch({
            type: "SET_FIELD",
            payload: { field: "videoThumbnailUrl", value },
        });
    }

    const setErrors = (value: any) => {
        dispatch({
            type: "SET_ERRORS",
            payload: value,
        });
    }

    return {
        submission: state,
        setSubmissionTitle,
        setSubmissionBody,
        setPrimaryAssetUrl,
        setVideoThumbnailUrl,
        setErrors
    }

}

export const validateSubmission = async (state: SubmissionBuilderProps, onError: (data: any) => void) => {
    const {
        title,
        primaryAssetUrl,
        videoThumbnailUrl,
        submissionBody,
    } = state;

    const isVideo = Boolean(videoThumbnailUrl)

    if (!title) {
        toast.error("Please provide a title");
        onError({
            title: "Please provide a title",
        });
        return {
            isError: true,
        };
    }

    if (title.length < 3) {
        toast.error("Title must be at least 3 characters")
        onError({
            title: "Title must be at least 3 characters",
        })
        return {
            isError: true,
        };
    }

    if (title.length > 100) {
        toast.error("Title must be less than 100 characters")
        onError({
            title: "Title must be less than 100 characters",
        })
        return {
            isError: true,
        };
    }

    let type = null;
    if (isVideo) type = "video";
    else if (primaryAssetUrl) type = "image";
    else if (submissionBody) type = "text";

    if (!type) {
        toast.error("Please upload media or provide body content")
        onError({
            type: "Please upload media or provide body content",
        })
        return {
            isError: true,
        };
    }

    if (type === "text" && submissionBody?.blocks.length === 0) {
        toast.error("Please provide a submission body")
        onError({
            submissionBody: "Please provide a submission body",
        })
        return {
            isError: true,
        };
    }

    return {
        isError: false,
        payload: {
            title,
            body: submissionBody,
            previewAsset: isVideo ? videoThumbnailUrl : primaryAssetUrl,
            videoAsset: isVideo ? primaryAssetUrl : null,
        }
    };

}
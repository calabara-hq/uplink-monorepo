import type { OutputData } from "@editorjs/editorjs";
import { useReducer } from "react";
import { toast } from "react-hot-toast";

export type SubmissionBuilderProps = {
    title: string;
    videoAsset: string | null;
    previewAsset: string | null;
    submissionBody: OutputData | null;
    errors: {
        type?: string;
        title?: string;
        previewAsset?: string;
        videoAsset?: string;
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
        previewAsset: null,
        videoAsset: null,
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

    const setPreviewAsset = (value: string) => {
        dispatch({
            type: "SET_FIELD",
            payload: { field: "previewAsset", value },
        });
    }

    const setVideoAsset = (value: string) => {
        dispatch({
            type: "SET_FIELD",
            payload: { field: "videoAsset", value },
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
        setPreviewAsset,
        setVideoAsset,
        setErrors
    }

}

export const validateSubmission = async (state: SubmissionBuilderProps, onError: (data: any) => void) => {
    const {
        title,
        previewAsset,
        videoAsset,
        submissionBody,
    } = state;

    const isVideo = Boolean(videoAsset)

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
    else if (previewAsset) type = "image";
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
            previewAsset: previewAsset ? previewAsset : null,
            videoAsset :  videoAsset ? videoAsset : null
        }
    };

}
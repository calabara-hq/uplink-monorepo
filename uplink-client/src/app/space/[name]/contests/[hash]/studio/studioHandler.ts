import { OutputData } from "@editorjs/editorjs";
import { toast } from "react-hot-toast";
import handleMediaUpload from "@/lib/mediaUpload";


export type SubmissionBuilderProps = {
    title: string;
    primaryAsset: string | null;
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
}: {
    event: any;
    dispatch: React.Dispatch<any>;
    isVideo: boolean;
}) => {
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
};

export const handleSubmit = async ({
    state,
    dispatch,
    handleMutation,
    contestId,
}: {
    state: SubmissionBuilderProps;
    dispatch: React.Dispatch<any>;
    handleMutation: any;
    contestId: number;
}) => {
    const { isError, errors, payload } = validateSubmission(state);

    // handle the client-side validation errors
    if (isError) {
        // handle the special case of the type field since it doesn't belong to one single field
        if (errors?.type) return toast.error(errors.type);
        // handle the rest of the fields
        return setErrors({ dispatch, errors: errors });
    }

    const res = await handleMutation({
        contestId: contestId,
        submission: payload,
    });

    if (!res) return;
    const { errors: mutationErrors, success } = res.data.createSubmission;

    if (!success) {
        toast.error(
            "Oops, something went wrong. Please check the fields and try again."
        );
        console.log(mutationErrors);
    }

    if (success) {
        toast.success("Submission created successfully", {
            icon: "🎉",
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

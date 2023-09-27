import type { OutputData } from "@editorjs/editorjs";
import handleMediaUpload, { IpfsUpload, MediaUploadError } from "@/lib/mediaUpload";
import { initialState } from "@/ui/ContestForm/contestHandler";
import { useReducer } from "react";
import { toast } from "react-hot-toast";

export type SubmissionBuilderProps = {
    title: string;
    primaryAssetUrl: string | null;
    primaryAssetBlob: string | null;
    videoThumbnailUrl: string | null;
    videoThumbnailBlob: string | null;
    videoThumbnailBlobIndex: number | null;
    videoThumbnailOptions: string[] | null;
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

export const useStandardSubmissionCreator = () => {
    const [state, dispatch] = useReducer(reducer, {
        title: "",
        primaryAssetUrl: null,
        primaryAssetBlob: null,
        videoThumbnailUrl: null,
        videoThumbnailBlob: null,
        videoThumbnailBlobIndex: null,
        videoThumbnailOptions: null,
        isVideo: false,
        isUploading: false,
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

    const setPrimaryAssetBlob = (value: string) => {
        dispatch({
            type: "SET_FIELD",
            payload: { field: "primaryAssetBlob", value },
        });
    }

    const setVideoThumbnailUrl = (value: string) => {
        dispatch({
            type: "SET_FIELD",
            payload: { field: "videoThumbnailUrl", value },
        });
    }

    const setVideoThumbnailBlobIndex = (value: number) => {
        dispatch({
            type: "SET_FIELD",
            payload: { field: "videoThumbnailBlobIndex", value },
        });
    }

    const setVideoThumbnailOptions = (value: string[]) => {
        dispatch({
            type: "SET_FIELD",
            payload: { field: "videoThumbnailOptions", value },
        });
    }

    const removeMediaAsset = () => {
        setIsUploading(false);
        setIsVideo(false);
        setPrimaryAssetUrl(null);
        setPrimaryAssetBlob(null);
        setVideoThumbnailUrl(null);
        setVideoThumbnailBlobIndex(null);
        setVideoThumbnailOptions(null);
    }


    const setIsUploading = (value: boolean) => {
        dispatch({
            type: "SET_FIELD",
            payload: { field: "isUploading", value },
        });
    }

    const setIsVideo = (value: boolean) => {
        dispatch({
            type: "SET_FIELD",
            payload: { field: "isVideo", value },
        });
    }

    const setErrors = (value: any) => {
        dispatch({
            type: "SET_ERRORS",
            payload: value,
        });
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
                (base64) => {
                    if (!isVideo) {
                        setPrimaryAssetBlob(base64);
                    }
                },
                (ipfsUrl) => {
                    setPrimaryAssetUrl(ipfsUrl);
                    setIsUploading(false);
                },
                (thumbnails) => {
                    setVideoThumbnailOptions(thumbnails);
                    setVideoThumbnailBlobIndex(0);
                },
                (size) => { }
            ).catch((err) => {

                if (err instanceof MediaUploadError) {
                    // toast the message
                    toast.error(err.message)
                }
                else {
                    // log the message and toast a generic error
                    console.log(err)
                    toast.error('Something went wrong. Please try again later.')
                }

                // clear out all the fields for the users next attempt
                removeMediaAsset();

            });
        }
        else if (mode === "thumbnail") {
            handleMediaUpload(
                event,
                ["image"],
                (mimeType) => { },
                (base64) => {
                    const existingThumbnailOptions = [...state.videoThumbnailOptions];
                    setVideoThumbnailOptions([...existingThumbnailOptions, base64])
                    setVideoThumbnailBlobIndex(existingThumbnailOptions.length);
                },
                (ipfsUrl) => {
                    setVideoThumbnailUrl(ipfsUrl);
                },

            ).catch(() => {

            });
        }
    }

    const validateSubmission = async () => {
        const {
            title,
            primaryAssetUrl,
            videoThumbnailUrl,
            submissionBody,
            isVideo,
            videoThumbnailOptions,
            videoThumbnailBlobIndex,
            isUploading,
        } = state;


        if (isUploading) {
            toast.error('Your media is still uploading. Please wait for it to finish before submitting.')
            return {
                isError: true,
            }
        }

        if (!title) {
            toast.error("Please provide a title");
            setErrors({
                title: "Please provide a title",
            });
            return {
                isError: true,
            };
        }

        if (title.length < 3) {
            toast.error("Title must be at least 3 characters")
            setErrors({
                title: "Title must be at least 3 characters",
            })
            return {
                isError: true,
            };
        }

        if (title.length > 100) {
            toast.error("Title must be less than 100 characters")
            setErrors({
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
            setErrors({
                type: "Please upload media or provide body content",
            })
            return {
                isError: true,
            };
        }

        if (isVideo) {
            if (!videoThumbnailOptions[videoThumbnailBlobIndex]) {
                toast.error("Please choose a thumbnail for your video")
                setErrors({
                    videoThumbnail: "Please choose a thumbnail for your video",
                });
                return {
                    isError: true,
                };
            }
            else {
                // convert the base64 to blob first
                const blob = await fetch(videoThumbnailOptions[videoThumbnailBlobIndex]).then(r => r.blob())
                await IpfsUpload(blob).then(url => {
                    setVideoThumbnailUrl(url)
                }).catch(err => {
                    console.log(err)
                    toast.error('Something went wrong. Please try again.')
                    return {
                        isError: true,
                    }
                })
            }
        }

        if (type === "text" && submissionBody?.blocks.length === 0) {
            toast.error("Please provide a submission body")
            setErrors({
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

    return {
        submission: state,
        setSubmissionTitle,
        setSubmissionBody,
        setVideoThumbnailBlobIndex,
        setIsUploading,
        setIsVideo,
        handleFileChange,
        removeMediaAsset,
        validateSubmission,
        setErrors
    }

}
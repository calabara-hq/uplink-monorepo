import { useEffect, useReducer, useState } from "react";
import { nanoid } from 'nanoid';
import handleMediaUpload, { IpfsUpload, MediaUploadError } from "@/lib/mediaUpload";
import { toast } from "react-hot-toast";
import { set } from "date-fns";


// client context thread item
export type ThreadItem = {
    id: string;
    text: string;
    primaryAssetUrl: string | null;
    primaryAssetBlob: string | null;
    videoThumbnailUrl: string | null;
    videoThumbnailBlobIndex: number | null;
    videoThumbnailOptions: string[] | null;
    assetSize: string | null;
    assetType: string | null;
    isVideo: boolean;
    isUploading: boolean;
    error?: string;
};

// api context thread item
export type ApiThreadItem = {
    text: string;
    previewAsset?: string;
    videoAsset?: string;
    assetSize?: string;
    assetType?: string;
};


const threadReducer = (
    state: ThreadItem[],
    action: any
): ThreadItem[] => {
    switch (action.type) {
        case "SET_FIELD":
            return state.map((item) => {
                if (item.id === action.payload.id) {
                    return {
                        ...item,
                        [action.payload.field]: action.payload.value,
                        error: undefined,
                    };
                } else {
                    return item;
                }
            });

        case "ADD_TWEET":
            return [...state, action.payload];
        case "REMOVE_TWEET":
            return state.filter((item) => item.id !== action.payload);
        case "SET_ERROR":
            return state.map((item) => {
                if (item.id === action.payload.id) {
                    return {
                        ...item,
                        error: action.payload,
                    }
                }
                else {
                    return item;
                }
            });
        case "RESET":
            return action.payload;
        default:
            return state;
    }
}



export const useThreadCreator = (initialThread?: ThreadItem[]) => {

    const [state, dispatch] = useReducer(threadReducer,
        initialThread ? initialThread.map((tweet) => {
            return {            // if initialThread is passed, do nothing
                ...tweet,
            }
        }) : [{                // if initialThread is null, then use this default value
            id: nanoid(),
            text: "",
            primaryAssetUrl: null,
            primaryAssetBlob: null,
            videoThumbnailUrl: null,
            videoThumbnailBlobIndex: null,
            videoThumbnailOptions: null,
            assetSize: null,
            assetType: null,
            isVideo: false,
            isUploading: false,
        }]);

    useEffect(() => {
        return () => {
            reset();
        }
    }, [])

    const addTweet = () => {
        dispatch({
            type: "ADD_TWEET",
            payload: {
                id: nanoid(),
                text: "",
                primaryAssetUrl: null,
                primaryAssetBlob: null,
                videoThumbnailUrl: null,
                videoThumbnailBlobIndex: null,
                videoThumbnailOptions: null,
                assetSize: null,
                assetType: null,
                isVideo: false,
                isUploading: false,
            }
        });
    }

    const removeTweet = (id: string) => {
        dispatch({
            type: "REMOVE_TWEET",
            payload: id,
        });
    }

    const setTweetText = (id: string, text: string) => {
        dispatch({
            type: "SET_FIELD",
            payload: { id, field: 'text', value: text },
        });

    }

    const setTweetPrimaryAssetUrl = (id: string, url: string) => {
        dispatch({
            type: "SET_FIELD",
            payload: { id, field: 'primaryAssetUrl', value: url },
        });
    }

    const setTweetPrimaryAssetBlob = (id: string, blob: string) => {
        dispatch({
            type: "SET_FIELD",
            payload: { id, field: 'primaryAssetBlob', value: blob },
        });
    }

    const setTweetVideoThumbnailUrl = (id: string, url: string) => {
        dispatch({
            type: "SET_FIELD",
            payload: { id, field: 'videoThumbnailUrl', value: url },
        });
    }

    const setTweetVideoThumbnailBlobIndex = (id: string, index: number | null) => {
        dispatch({
            type: "SET_FIELD",
            payload: { id, field: 'videoThumbnailBlobIndex', value: index },
        });
    }

    const setTweetVideoThumbnailOptions = (id: string, options: string[]) => {
        dispatch({
            type: "SET_FIELD",
            payload: { id, field: 'videoThumbnailOptions', value: options },
        });
    }

    const setTweetAssetSize = (id: string, size: string) => {
        dispatch({
            type: "SET_FIELD",
            payload: { id, field: 'assetSize', value: size }
        })
    }


    const setTweetAssetType = (id: string, type: string) => {
        dispatch({
            type: "SET_FIELD",
            payload: { id, field: 'assetType', value: type }
        })
    }

    const removeTweetMedia = (id: string) => {
        setIsUploading(id, false);
        setIsVideo(id, false);
        setTweetPrimaryAssetUrl(id, null);
        setTweetPrimaryAssetBlob(id, null);
        setTweetVideoThumbnailUrl(id, null);
        setTweetVideoThumbnailBlobIndex(id, null);
        setTweetVideoThumbnailOptions(id, null);
        setTweetAssetSize(id, null);
        setTweetAssetType(id, null);
    }


    const setIsUploading = (id: string, isUploading: boolean) => {
        dispatch({
            type: "SET_FIELD",
            payload: { id, field: 'isUploading', value: isUploading },
        });
    }

    const setIsVideo = (id: string, isVideo: boolean) => {
        dispatch({
            type: "SET_FIELD",
            payload: { id, field: 'isVideo', value: isVideo },
        });
    }


    const reset = () => {
        dispatch({
            type: "RESET",
            payload: [{
                id: nanoid(),
                text: "",
                primaryAssetUrl: null,
                primaryAssetBlob: null,
                videoThumbnailUrl: null,
                videoThumbnailBlobIndex: null,
                assetSize: null,
                assetType: null,
                isVideo: false,
                isUploading: false,
            }]
        });
    }

    const handleFileChange = ({
        id,
        event,
        isVideo,
        mode
    }: {
        id: string;
        event: any;
        isVideo: boolean;
        mode: "primary" | "thumbnail";
    }) => {
        if (mode === "primary") {
            setIsUploading(id, true)

            handleMediaUpload(
                event,
                ["image", "video"],
                (mimeType) => {
                    setIsVideo(id, mimeType.includes("video"));
                    setTweetAssetType(id, mimeType)
                },
                (base64) => {
                    if (!isVideo) {
                        setTweetPrimaryAssetBlob(id, base64);
                    }
                },
                (ipfsUrl) => {
                    setTweetPrimaryAssetUrl(id, ipfsUrl);
                    setIsUploading(id, false);
                },
                (thumbnails) => {
                    setTweetVideoThumbnailOptions(id, thumbnails);
                    setTweetVideoThumbnailBlobIndex(id, 0);
                },
                (size) => {
                    setTweetAssetSize(id, size)
                }
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
                removeTweetMedia(id);

            });
        }
        else if (mode === "thumbnail") {
            handleMediaUpload(
                event,
                ["image"],
                (mimeType) => { },
                (base64) => {
                    const existingThumbnailOptions = state.filter((item) => item.id === id)[0].videoThumbnailOptions;
                    setTweetVideoThumbnailOptions(id, [...existingThumbnailOptions, base64])
                    setTweetVideoThumbnailBlobIndex(id, existingThumbnailOptions.length);
                },
                (ipfsUrl) => {
                    setTweetVideoThumbnailUrl(id, ipfsUrl);
                },

            ).catch(() => {

            });
        }
    };



    // check for errors and produce a clean thread object
    const validateThread = async () => {

        if (state.length === 0 || !state) {
            return {
                isError: true,
            }
        }


        if (state.some((item) => item.isUploading)) {
            toast.error('One of your tweets is still uploading. Please wait for it to finish before submitting.')
            return {
                isError: true,
            }
        }


        for await (const item of state) {

            const hasText = item.text.trim().length > 0;
            const hasMedia = item.primaryAssetUrl !== null || item.primaryAssetBlob !== null;

            if (!hasText && !hasMedia) {
                toast.error('One of your tweets is empty. Please add text or media to continue.')
                return {
                    isError: true,
                }
            }

            if (hasText) {
                if (item.text.length > 280) {
                    toast.error('One of your tweets is too long. Please shorten it to continue.')
                    return {
                        isError: true,
                    }
                }
            }

            if (hasMedia) {
                if (item.isVideo) {
                    if (!item.videoThumbnailOptions[item.videoThumbnailBlobIndex]) {
                        toast.error('One of your tweets is missing a video thumbnail. Please add a thumbnail to continue.')
                        return {
                            isError: true,
                        }
                    }
                    else {
                        // if there is a thumbnail, upload the blob and add it to the thread
                        // convert the base64 to blob first
                        const blob = await fetch(item.videoThumbnailOptions[item.videoThumbnailBlobIndex]).then(r => r.blob())
                        await IpfsUpload(blob).then(url => {
                            item.videoThumbnailUrl = url;
                        }).catch(err => {
                            console.log(err)
                            toast.error('Something went wrong. Please try again.')
                            return {
                                isError: true,
                            }
                        })
                    }
                }
            }
        }

        return {
            isError: false,
        }

    }

    return {
        thread: state,
        addTweet,
        removeTweet,
        removeTweetMedia,
        setTweetText,
        setTweetVideoThumbnailBlobIndex,
        handleFileChange,
        validateThread,
        resetThread: reset
    }

};
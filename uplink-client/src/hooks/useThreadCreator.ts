import { useEffect, useReducer, useState } from "react";
import { nanoid } from 'nanoid';



export type ThreadItem = {
    id: string;
    text: string;
    media: {
        type: "image" | "video";
        url?: string;
        blob?: string;
    } | null;
};



export type ThreadAction =
    | { type: "setTweetText"; payload: { id: string, text: ThreadItem['text'] } }
    | { type: "setTweetMediaUrl"; payload: { id: string, media: ThreadItem['media'] } }
    | { type: "setTweetMediaBlob"; payload: { id: string, media: ThreadItem['media'] } }
    | { type: "addTweet"; payload: ThreadItem }
    | { type: "removeTweet"; payload: string }
    | { type: "removeTweetMedia"; payload: string }
    | { type: "reset", payload: ThreadItem[] };


const threadReducer = (
    state: ThreadItem[],
    action: ThreadAction
): ThreadItem[] => {
    switch (action.type) {
        case "setTweetText": {
            const { id, text } = action.payload;
            return state.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        text,
                    };
                }
                return item;
            });
        }
        case "setTweetMediaUrl": {
            const { id, media } = action.payload;
            return state.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        media,
                    };
                }
                return item;
            })
        }

        case "setTweetMediaBlob": {
            const { id, media } = action.payload;
            return state.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        media,
                    };
                }
                return item;
            })
        }
        case "addTweet": {
            return [...state, action.payload];
        }
        case "removeTweet": {
            return state.filter((item) => item.id !== action.payload);
        }

        case "removeTweetMedia": {
            return state.map((item) => {
                if (item.id === action.payload) {
                    return {
                        ...item,
                        media: null,
                    };
                }
                return item;
            })
        }

        case "reset": {
            return action.payload;
        }
    }
}



export const useThreadCreator = (initialThread?: ThreadItem[] | []) => {

    const [state, dispatch] = useReducer(threadReducer,
        initialThread.map((tweet) => {
            return {            // if initialThread is passed, insert id to each tweet
                ...tweet,
                id: nanoid(),
            }
        }) ?? [{                // if initialThread is undefined, then use this default value
            id: nanoid(),
            text: "",
            media: null,
        }]);

    useEffect(() => {
        return () => {
            dispatch({          // reset to some default value on unmount
                type: "reset", payload: [{
                    id: nanoid(),
                    text: "",
                    media: null,
                }]
            });
        }
    }, [])

    const addTweet = () => {
        dispatch({
            type: "addTweet",
            payload: {
                id: nanoid(),
                text: "",
                media: null,
            }
        });
    }

    const removeTweet = (id: string) => {
        dispatch({
            type: "removeTweet",
            payload: id,
        });
    }

    const setTweetText = (id: string, text: string) => {
        dispatch({
            type: "setTweetText",
            payload: { id, text },
        });
    }

    const setTweetMediaUrl = (id: string, media: ThreadItem['media']) => {
        dispatch({
            type: "setTweetMediaUrl",
            payload: { id, media },
        });
    }

    const setTweetMediaBlob = (id: string, media: ThreadItem['media']) => {
        dispatch({
            type: "setTweetMediaBlob",
            payload: { id, media },
        });
    }

    const removeTweetMedia = (id: string) => {
        dispatch({
            type: "removeTweetMedia",
            payload: id,
        });
    }

    const reset = () => {
        dispatch({
            type: "reset", payload: [{
                id: nanoid(),
                text: "",
                media: null,
            }]
        });
    }

    return {
        thread: state,
        addTweet,
        removeTweet,
        setTweetText,
        setTweetMediaUrl,
        setTweetMediaBlob,
        removeTweetMedia,
        resetThread: reset
    }

};
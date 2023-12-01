
export type SubmissionType = "standard" | "twitter"
export type SubmissionFormat = "image" | "video" | "text"
import type { OutputData } from "@editorjs/editorjs";

export type BaseSubmission = {
    id: string;
    contestId: string;
    created: string;
    type: SubmissionType;
    url: string;
    version: string;
    author: {
        id: string;
        address: string;
        userName: string | null;
        displayName: string | null;
        profileAvatar: string | null;
    } | null;
    rank: string | null;
    totalVotes: string | null;
    nftDrop: {
        chainId: string;
        contractAddress: string;
        dropConfig: string;
    } | null;
};

export type TwitterSubmission = BaseSubmission & {
    type: "twitter";
    data: {
        type: SubmissionFormat;
        title: string;
        thread: {
            text?: string;
            previewAsset?: string;
            videoAsset?: string;
            assetSize?: number;
            assetType?: string;
        }[];
    };
}

export type StandardSubmission = BaseSubmission & {
    type: "standard";
    data: {
        type: SubmissionFormat;
        title: string;
        previewAsset?: string;
        videoAsset?: string;
        body?: OutputData;
    };
};

export type Submission = TwitterSubmission | StandardSubmission;

export const isStandardSubmission = (submission: Submission): submission is StandardSubmission => {
    return submission.type === 'standard';
}

export const isTwitterSubmission = (submission: Submission): submission is TwitterSubmission => {
    return submission.type === 'twitter';
}

export const isNftSubmission = (submission: Submission): boolean => {
    return Boolean(submission.nftDrop);
}
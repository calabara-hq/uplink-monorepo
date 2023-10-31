import { z } from 'zod';

const inferFormat = (threadItem: Tweet) => {
    const { text, previewAsset, videoAsset } = threadItem;
    if (videoAsset) return "video";
    else if (previewAsset) return "image";
    else if (text) return "text";
    else return null;
}

// remove nullish values from the payload
const stripData = (data: Tweet) => {
    const { text, previewAsset, videoAsset, assetType, assetSize } = data;
    return {
        ...(text ? { text } : {}),
        ...(previewAsset ? { previewAsset } : {}),
        ...(videoAsset ? { videoAsset } : {}),
        ...(assetType ? { assetType } : {}),
        ...(assetSize ? { assetSize } : {}),
    }
}

// extract so we can work with this type locally and avoid circular dependency
const TweetSchema = z.object({
    text: z.string().max(280).nullish(),
    previewAsset: z.string().url().nullish(),
    videoAsset: z.string().url().nullish(),
    assetType: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'video/mp4']).nullish(),
    assetSize: z.number().nullish(),
})

type Tweet = z.infer<typeof TweetSchema>; // local only

export const ThreadItemSchema = TweetSchema.transform((data, ctx) => {
    const type = inferFormat(data);
    const strippedData = stripData(data);
    if (!type) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Thread item content is required" });
        return z.NEVER;
    }

    if (type === "video" && !strippedData.previewAsset) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Video thumbnail is required" });
        return z.NEVER;
    }

    if ((type === "image" || type === "video") && !strippedData.assetSize) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Asset size is required" });
        return z.NEVER;
    }

    if ((type === "image" || type === "video") && !strippedData.assetType) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Asset type is required" });
        return z.NEVER;
    }

    return strippedData;
})

export const WritableTwitterSubmissionSchema = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string",
    })
        .trim()
        .min(1, { message: "Title must be at least 1 character long" })
        .max(100, { message: "Title must be less than 100 characters long" }),
    thread: z.array(ThreadItemSchema)
}).transform((data, ctx) => {
    const type = data.thread.length > 0 ? inferFormat(data.thread[0]) : null;

    if (!type) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Submission content is required" });
        return z.NEVER;
    }

    return { ...data, type };
})

export type ThreadItem = z.infer<typeof ThreadItemSchema>;
export type WritableTwitterSubmission = z.infer<typeof WritableTwitterSubmissionSchema>;
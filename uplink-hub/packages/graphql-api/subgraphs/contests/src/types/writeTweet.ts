import { z } from 'zod';


export const TweetSchema = z.object({
    text: z.string().trim().max(280).optional(),
    previewAsset: z.string().optional(),
    videoAsset: z.string().optional(),
    assetType: z.string().optional(),
    assetSize: z.number().optional(),
}).superRefine((tweet, ctx) => {
    if (!tweet) return false;
    const { videoAsset, previewAsset, text } = tweet;
    if (!videoAsset && !previewAsset && !text) { // no content
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Tweet must have text, video, or image",
        })
    }
    if (videoAsset && !previewAsset) { // thumbnail is required if video is present
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Tweet with video must have preview thumbnail",
        })

    }
})

export const TwitterThreadSchema = z.array(TweetSchema).nonempty()

export type Tweet = z.infer<typeof TweetSchema>;
export type TwitterThread = z.infer<typeof TwitterThreadSchema>;
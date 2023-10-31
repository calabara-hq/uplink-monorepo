import { z } from 'zod';
import type { EditorOutputData } from "lib";
export const EditorOutputSchema: z.ZodType<EditorOutputData> = z.any();
import { SubmissionPayload } from "../__generated__/resolvers-types.js";

// infer the submission format from the payload
const inferFormat = (data: SubmissionPayload) => {
    const { body, previewAsset, videoAsset } = data;
    if (videoAsset) return "video";
    else if (previewAsset) return "image";
    else if (body) return "text";
    else return null;
}


// remove nullish values from the payload
const stripData = (data: SubmissionPayload) => {
    const { title, body, previewAsset, videoAsset } = data;
    return {
        title,
        ...(videoAsset ? { videoAsset } : {}),
        ...(previewAsset ? { previewAsset } : {}),
        ...(body ? { body } : {}),
    }
}


export const WritableStandardSubmissionSchema = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string",
    })
        .trim()
        .min(1, { message: "Title must be at least 1 character long" })
        .max(100, { message: "Title must be less than 100 characters long" }),

    body: EditorOutputSchema.nullish(),
    previewAsset: z.string().url().nullish(),
    videoAsset: z.string().url().nullish(),


}).transform((data, ctx) => {
    const type = inferFormat(data);
    const strippedData = stripData(data);

    if (!type) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Submission content is required" });
        return z.NEVER;
    }

    if (type === "video" && !data.previewAsset) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Video thumbnail is required" });
        return z.NEVER;
    }

    if (data.body && data.body.blocks.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Submission body blocks cannot be empty" });
        return z.NEVER;
    }

    return { ...strippedData, type };
})

export type WritableStandardSubmission = z.infer<typeof WritableStandardSubmissionSchema>;

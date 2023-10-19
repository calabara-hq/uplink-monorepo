import { z } from "zod";
import { EditorOutputSchema } from "./editor";

// schemas

const SubmissionFormatSchema = z.enum(["video", "image", "text"]);

export const BaseSubmissionSchema = z.object({
    id: z.string(),
    contestId: z.string(),
    created: z.string().datetime(),
    url: z.string().url(),
    version: z.string(),
    author: z.string().optional(),
    totalVotes: z.string().nullable(),
    rank: z.number().nullable(),
})

export const StandardSubmissionDataSchema = z.object({
    type: SubmissionFormatSchema,
    title: z.string(),
    previewAsset: z.string().optional(),
    videoAsset: z.string().optional(),
    body: EditorOutputSchema.optional(),
})


export const TwitterSubmissionDataSchema = z.object({
    type: SubmissionFormatSchema,
    title: z.string(),
    thread: z.array(z.object({
        text: z.string().optional(),
        previewAsset: z.string().optional(),
        videoAsset: z.string().optional(),
        assetSize: z.number().optional(),
        assetType: z.string().optional(),
    }))
})


export const StandardSubmissionSchema = z.intersection(BaseSubmissionSchema, z.object({
    type: z.literal("standard"),
    data: StandardSubmissionDataSchema,
}))

export const TwitterSubmissionSchema = z.intersection(BaseSubmissionSchema, z.object({
    type: z.literal("twitter"),
    data: TwitterSubmissionDataSchema,
}))

export const SubmissionSchema = z.union([StandardSubmissionSchema, TwitterSubmissionSchema]);
export const SubmissionArraySchema = z.array(SubmissionSchema);

// types

export type BaseSubmission = z.infer<typeof BaseSubmissionSchema>;
export type TwitterSubmission = z.infer<typeof TwitterSubmissionSchema>;
export type StandardSubmission = z.infer<typeof StandardSubmissionSchema>;
export type Submission = z.infer<typeof SubmissionSchema>;
export type SubmissionArray = z.infer<typeof SubmissionArraySchema>;

// guards

export const isTwitterSubmission = (submission: any): submission is TwitterSubmission => {
    return TwitterSubmissionSchema.safeParse(submission).success;
}

export const isStandardSubmission = (submission: any): submission is StandardSubmission => {
    return StandardSubmissionSchema.safeParse(submission).success;
}

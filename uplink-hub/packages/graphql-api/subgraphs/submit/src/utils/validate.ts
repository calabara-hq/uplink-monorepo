import { SubmissionPayload, TwitterSubmissionPayload } from "../__generated__/resolvers-types";
import { WritableStandardSubmissionSchema } from "../types/writeStandardSubmission.js";
import { WritableTwitterSubmissionSchema } from "../types/writeTwitterSubmission.js";



export const validateStandardSubmissionPayload = (submission: SubmissionPayload) => {
    return WritableStandardSubmissionSchema.parse(submission);
}

export const validateTwitterSubmissionPayload = (submission: TwitterSubmissionPayload) => {
    return WritableTwitterSubmissionSchema.parse(submission);
}
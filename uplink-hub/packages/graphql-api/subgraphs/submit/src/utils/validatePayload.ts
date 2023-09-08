import { error } from "console";
import { EditorOutputData } from "lib";

const validateTitle = (title: string) => {
    const errorArr: string[] = [];

    if (!title) {
        errorArr.push("Submission title is required");
    }

    if (title.length > 50) {
        errorArr.push("Title must be less than 50 characters");
    }

    const cleanedTitle = title.trim();

    const error = errorArr.length > 0 ? errorArr.join(", ") : undefined;

    return {
        error,
        result: cleanedTitle
    }
}

const validateBody = (body: EditorOutputData | null) => {
    if (!body) return
    else if (body.blocks.length === 0) {
        return { error: "Submission body blocks cannot be empty" }
    }
    return { result: body }
}

const createTemplateType = (videoAsset: string | null, previewAsset?: string, body?: EditorOutputData | null) => {
    if (videoAsset) return "video";
    else if (previewAsset) return "image";
    else if (body) return "text";
    else return null;
}


const composeSubmission = (previewAsset: string | null, videoAsset: string | null, body: EditorOutputData | null) => {
    const errorArr: string[] = [];

    const type = createTemplateType(videoAsset, previewAsset, body);

    if (!type) return {
        error: "Submission content is required",
        result: { type }
    }

    if (type === "video" && !previewAsset) {
        errorArr.push("Video thumbnail is required");
    }

    const bodyResult = validateBody(body);
    if (bodyResult?.error) errorArr.push(bodyResult.error)

    const error = errorArr.length > 0 ? errorArr.join(", ") : undefined;

    return {
        error,
        result: {
            type,
            ...(videoAsset ? { videoAsset: videoAsset } : {}),
            ...(previewAsset ? { previewAsset: previewAsset } : {}),
            ...(bodyResult?.result ? { body: bodyResult.result } : {}),
        }
    }
}



const composeTwitterSubmission = (thread: {
    text?: string,
    previewAsset?: string,
    videoAsset?: string,
    assetType?: string,
    assetSize?: string
}[]) => {

    const errorArr: string[] = [];

    const createTemplateType = (videoAsset, previewAsset, text) => {
        if (videoAsset) return "video";
        else if (previewAsset) return "image";
        else if (text.trim()) return "text";
        else return null;
    }

    const cleanedThread = thread.map(({ text, previewAsset, videoAsset, assetType, assetSize }, index) => {

        const type = createTemplateType(videoAsset, previewAsset, text);

        if (!type) errorArr.push(`content required for thread item index ${index}`)

        if (type === "video" && !previewAsset) {
            errorArr.push("Video thumbnail is required");
        }

        if (text) {
            if (text.length > 280) errorArr.push(`text must be less than 280 characters for thread item index ${index}`)
        }

        return {
            ...(assetType ? { assetType } : {}),
            ...(assetSize ? { assetSize } : {}),
            ...(videoAsset ? { videoAsset } : {}),
            ...(previewAsset ? { previewAsset } : {}),
            ...(text ? { text } : {}),
        }

    })


    const error = errorArr.length > 0 ? errorArr.join(", ") : undefined;

    return {
        error,
        result: {
            thread: cleanedThread
        }
    }

}

const validateSubmissionPayload = async (
    payload: {
        title: string,
        previewAsset?: string,
        videoAsset?: string,
        body?: EditorOutputData
    }) => {
    const { title, previewAsset, videoAsset, body } = payload;

    const titleResult = validateTitle(title);
    const contentResult = composeSubmission(previewAsset, videoAsset, body);

    const errors = {
        ...(titleResult.error ? { title: titleResult.error } : {}),
        ...(contentResult.error ? { content: contentResult.error } : {}),
    }

    const isSuccess = Object.keys(errors).length === 0;
    const errorString = Object.values(errors).join(", ") || null;

    return {
        success: isSuccess,
        errors: errorString,
        cleanPayload: {
            title: titleResult.result,
            ...contentResult.result
        }
    }
}



const validateTwitterSubmissionPayload = async (payload: {
    title: string,
    thread: {
        text?: string,
        previewAsset?: string,
        videoAsset?: string,
        assetType?: string,
        assetSize?: string
    }[]
}) => {
    const { title, thread } = payload;

    const titleResult = validateTitle(title);
    const contentResult = composeTwitterSubmission(thread);

    const errors = {
        ...(titleResult.error ? { title: titleResult.error } : {}),
        ...(contentResult.error ? { content: contentResult.error } : {}),
    }

    const isSuccess = Object.keys(errors).length === 0;
    const errorString = Object.values(errors).join(", ") || null;

    return {
        success: isSuccess,
        errors: errorString,
        cleanPayload: {
            title: titleResult.result,
            ...contentResult.result
        }
    }

}

export {
    validateTitle,
    validateBody,
    composeSubmission,
    validateSubmissionPayload,
    validateTwitterSubmissionPayload
}

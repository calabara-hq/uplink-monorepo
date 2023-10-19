import { PromptData, PromptDataSchema } from "@/types/contest";
import { z } from "zod";


const fetchPromptData = async (promptUrl: string): Promise<PromptData> => {
    const data = await fetch(promptUrl).then(res => res.json())
    const result = PromptDataSchema.safeParse(data)
    if (!result.success) {
        console.error("invalid prompt data", data, promptUrl, result.error)
        return {} as PromptData
    }
    else {
        return data
    }
}

export default fetchPromptData;
import { BaseSubmission, Submission } from "@/types/submission";


const fetchSingleSubmission = async (submissionId: string): Promise<Submission> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/singleLegacyContestSubmission?id=${submissionId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },

        next: { tags: [`submission/${submissionId}`] },

    })
        .then(res => res.json())
        .then(async (res: BaseSubmission) => {
            const data = await fetch(res.url).then((res) => res.json());
            return { ...res, data: data };
        })
}

export default fetchSingleSubmission;
import { BaseSubmission, Submission } from "@/types/submission";
import handleNotFound from "../handleNotFound";

const fetchSingleSubmission = async (submissionId: string): Promise<Submission> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        body: JSON.stringify({
            query: `
                query submission($submissionId: ID!){
                    submission(submissionId: $submissionId) {
                        id
                        contestId
                        created
                        rank
                        totalVotes
                        type
                        url
                        version
                        author {
                            id
                            address
                            profileAvatar
                            userName
                            displayName
                          }
                        nftDrop {
                            chainId
                            contractAddress
                            dropConfig
                        }
                    }
                }`,
            variables: {
                submissionId,
            },
        }),
        next: { tags: [`submission/${submissionId}`], revalidate: 60 },
    })
        .then((res) => res.json())
        .then((res) => res.data.submission)
        .then(handleNotFound)
        .then(async (res: BaseSubmission) => {
            const data = await fetch(res.url).then((res) => res.json());
            return { ...res, data: data };
        })

    return data;
};

export default fetchSingleSubmission;
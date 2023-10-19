import { ApiContestSchema } from "@/types/contest";
import handleNotFound from "../handleNotFound";
import fetchPromptData from "./fetchContestPromptData";
import { z } from "zod";

export const SingleSpaceContestResponseSchema = ApiContestSchema.pick({
    id: true,
    tweetId: true,
    promptUrl: true,
    deadlines: true,
    metadata: true,
    //promptData: true
})

export const FetchSpaceContestsResponseSchema = z.array(SingleSpaceContestResponseSchema)

export type FetchSpaceContestsResponse = z.infer<typeof FetchSpaceContestsResponseSchema>;
export type SingleSpaceContestResponse = z.infer<typeof SingleSpaceContestResponseSchema>;
const fetchSpaceContests = async (spaceName: string): Promise<FetchSpaceContestsResponse | never> => {
    
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        body: JSON.stringify({
            query: `
                query space($name: String!){
                  space(name: $name) {
                    contests {
                        id
                        tweetId
                        promptUrl
                        deadlines {
                          endTime
                          snapshot
                          startTime
                          voteTime
                        }
                        metadata {
                          category
                          type
                        }
                    }
                  }
              }`,
            variables: {
                name: spaceName,
            },
        }),
        next: { tags: [`space/${spaceName}/contests`], revalidate: 60 },
    })
        .then((res) => res.json())
        .then(res => res.data.space)
        .then(handleNotFound)
        .then((res) => res.contests)
        .then(data => {
            const result = FetchSpaceContestsResponseSchema.safeParse(data);
            if (!result.success) {
                console.error("invalid data", result.error);
                return [];
            }
            else {
                return data;
            }
        })
        .then(async contests => {
            return await Promise.all(
                contests.map(async (contest: SingleSpaceContestResponse) => {
                    // fetch prompt url
                    const promptData = await fetchPromptData(contest.promptUrl);
                    return {
                        ...contest,
                        promptData,
                    };
                })
            );
        })
}

export default fetchSpaceContests;
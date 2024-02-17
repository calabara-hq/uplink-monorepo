
import { ContestPromptData, ReadableContest } from "@/types/contest";
import { Space } from "@/types/space";

export type ActiveContest = {
  id: string;
  tweetId: string | null;
  promptUrl: string;
  deadlines: ReadableContest["deadlines"];
  metadata: ReadableContest["metadata"];
  space: Pick<Space, "logoUrl" | "displayName" | "name">;
  promptData: ContestPromptData;
}

const fetchActiveContests = async (): Promise<Array<ActiveContest>> => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-TOKEN": process.env.API_SECRET!,
    },
    body: JSON.stringify({
      query: `
            query ActiveContests {
              activeContests {
                id
                tweetId
                promptUrl
                deadlines {
                  startTime
                  voteTime
                  endTime
                  snapshot
                }
                metadata {
                  type
                  category
                }
                space {
                  logoUrl
                  displayName
                  name
                }
              }
            }`,
    }),
    next: { revalidate: 60, tags: ["activeContests"] },
  })
    .then((res) => res.json())
    .then((res) => res.data.activeContests)
    .then(async (contests) => {
      return Promise.all(
        contests.map(async (contest: Omit<ActiveContest, "promptData">) => {
          const promptData = await fetch(contest.promptUrl).then((res) => res.json());
          return { ...contest, promptData: promptData };
        })
      )
    })

  return data;
};

export default fetchActiveContests;
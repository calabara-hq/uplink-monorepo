import { ApiContestSchema } from "@/types/contest";
import { z } from "zod";

export const ActiveContestsSchema = z.array(z.intersection(ApiContestSchema.pick({
  id: true,
  tweetId: true,
  promptUrl: true,
  deadlines: true,
  metadata: true,
}), z.object({
  space: z.object({
    logoUrl: z.string(),
    displayName: z.string(),
    name: z.string(),
  })
})))

export type ActiveContests = z.infer<typeof ActiveContestsSchema>;

const fetchActiveContests = async (): Promise<ActiveContests[]> => {
  return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
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
    .then(data => {
      const { success } = ActiveContestsSchema.safeParse(data);
      if (!success) {
        console.error("invalid data", data);
        return []; // bail out with empty array if data is invalid
      }
      return data;
    })
};

export default fetchActiveContests;
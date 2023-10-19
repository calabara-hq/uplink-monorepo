import { ApiContestSchema } from "@/types/contest";
import handleNotFound from "../handleNotFound";
import { z } from "zod";
import { EditorOutputSchema } from "@/types/editor";

// schemas

export const FetchContestResponseSchema = z.intersection(ApiContestSchema, z.object({
  spaceId: z.string(),
  created: z.string(),
  space: z.object({
    id: z.string(),
    name: z.string(),
    displayName: z.string(),
    logoUrl: z.string(),
    admins: z.array(z.object({
      address: z.string(),
    }))
  })
}))

// types 

export type FetchContestResponse = z.infer<typeof FetchContestResponseSchema>;

const fetchContest = async (contestId: string): Promise<FetchContestResponse | never> => {
  return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-TOKEN": process.env.API_SECRET!,
    },
    body: JSON.stringify({
      query: `
        query Contest($contestId: ID!) {
          contest(contestId: $contestId) {
            id
            spaceId
            created
            promptUrl
            tweetId
            space {
              id
              name
              displayName
              logoUrl
              admins {
                address
              }
            }
            metadata {
              category
              type
            }
            deadlines {
              startTime
              voteTime
              endTime
              snapshot
            }
            submitterRestrictions {
              restrictionType
              tokenRestriction {
                threshold
                token {
                  address
                  decimals
                  symbol
                  tokenHash
                  tokenId
                  type
                }
              }
            }
            submitterRewards {
              rank
              tokenReward {
                amount
                token {
                  tokenHash
                  symbol
                  decimals
                  address
                  tokenId
                  type
                }
              }
            }
            voterRewards {
              rank
              tokenReward {
                amount
                token {
                  tokenHash
                  type
                  address
                  symbol
                  decimals
                  tokenId
                }
              }
            }
            votingPolicy {
              strategyType
              arcadeVotingStrategy {
                token {
                  tokenHash
                  type
                  address
                  symbol
                  decimals
                  tokenId
                }
                votingPower
              }
              weightedVotingStrategy {
                token {
                  tokenHash
                  type
                  address
                  symbol
                  decimals
                  tokenId
                }
              }
            }
          }
        }`,
      variables: {
        contestId,
      },
    }),
    next: { tags: [`contest/${contestId}`], revalidate: 60 },
  })
    .then((res) => res.json())
    .then((res) => res.data.contest)
    .then(data => {
      const { success } = FetchContestResponseSchema.safeParse(data);
      if (!success) {
        console.error("invalid data", data);
        return null; // pass response to the notFound handler
      }
      return data;
    })
    .then(handleNotFound)
};

export default fetchContest;
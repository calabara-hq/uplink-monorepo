import { ReadableContest } from "@/types/contest";
import handleNotFound from "../handleNotFound";


export type FetchSingleContestResponse = ReadableContest & {
  space: {
    id: string;
    name: string;
    displayName: string;
    logoUrl: string;
    admins: Array<{
      address: string;
    }>;
  };
}


const fetchContest = async (contestId: string): Promise<FetchSingleContestResponse> => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
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
            votingPolicy {
              ... on ArcadeVotingStrategyOption {
                strategyType
                arcadeVotingStrategy {
                  token {
                    tokenHash
                    type
                    symbol
                    decimals
                    address
                    tokenId
                  }
                  votingPower
                }
              }
              ... on WeightedVotingStrategyOption {
                strategyType
                weightedVotingStrategy {
                  token {
                    tokenHash
                    type
                    symbol
                    decimals
                    address
                    tokenId
                  }
                }
              }
            }
            submitterRewards {
              rank
              reward {
                ... on SubmitterTokenReward {
                  tokenReward {
                    ... on FungibleReward {
                      token {
                        tokenHash
                        type
                        symbol
                        decimals
                        address
                        tokenId
                      }
                      amount
                    }
                    ... on NonFungibleReward {
                      token {
                        tokenHash
                        type
                        symbol
                        decimals
                        address
                        tokenId
                      }
                      tokenId
                    }
                  }
                }
              }
            }
            voterRewards {
              rank
              reward {
                ... on VoterTokenReward {
                  tokenReward {
                    ... on FungibleReward {
                      amount
                      token {
                        tokenHash
                        type
                        symbol
                        decimals
                        address
                        tokenId
                      }
                    }
                  }
                }
              }
            }
            submitterRestrictions {
              ... on TokenRestrictionOption {
                restrictionType
                tokenRestriction {
                  threshold
                  token {
                    tokenHash
                    type
                    symbol
                    decimals
                    address
                    tokenId
                  }
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
    .then(handleNotFound)
  return data;
};

export default fetchContest;
import "server-only"
import handleNotFound from "../handleNotFound";

const fetchContest = async (contestId: string) => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-TOKEN": process.env.API_SECRET,
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
                tokenId
              }
            }
            voterRewards {
              rank
              tokenReward {
                amount
                tokenId
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
    .then(handleNotFound)
  return data;
};

export default fetchContest;
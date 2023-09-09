export const getContestById = async (contestId: string) => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
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
            submissions {
              id
              contestId
              author
              created
              type
              url
              version
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
              arcadeVotingPolicy {
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
              weightedVotingPolicy {
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
        next: { tags: [`contest/${contestId}`] },
    })
        .then((res) => res.json())
        .then((res) => res.data.contest);
    return data;
};


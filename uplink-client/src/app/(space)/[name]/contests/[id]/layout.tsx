import { ContestStateProvider } from "@/providers/ContestStateProvider";
import { VoteProposalProvider } from "@/providers/VoteProposalProvider";

const getContestById = async (contestId: string) => {
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
    cache: "no-store",
    next: { tags: [`contest/${contestId}`] /*revalidate: 60 */ },
  })
    .then((res) => res.json())
    .then((res) => res.data.contest);
  return data;
};

export default async function Layout({
  children,
  params,
  modal,
}: {
  children: React.ReactNode;
  params: { name: string; id: string };
  modal: React.ReactNode;
}) {
  console.log(params)
  const contest = await getContestById(params.id);
  console.log(contest)
  const { deadlines, metadata } = contest
  return (
    <div className="w-full lg:w-11/12 flex flex-col items-center p-4">
      <div className="flex justify-center gap-6 m-auto w-full lg:py-6">
        <ContestStateProvider deadlines={deadlines} metadata={metadata}>
          <VoteProposalProvider contestId={params.id}>
            {children}
          </VoteProposalProvider>
        </ContestStateProvider>
        {modal}
      </div>
    </div>
  );
}

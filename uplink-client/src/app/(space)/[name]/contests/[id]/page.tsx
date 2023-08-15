import Prompt from "@/ui/Contests/ContestPrompt";
import SubmissionDisplay from "@/ui/Contests/SubmissionDisplay";
import { getContestById } from "@/lib/fetch/contest";
import { Suspense } from "react";
import { SubmissionDisplaySkeleton } from "@/ui/Contests/SubmissionDisplay";
import ContestSidebar from "@/ui/Contests/ContestSidebar";
import { SWRConfig } from "swr";
import SwrProvider from "@/providers/SwrProvider";

const getContest = async (contestId: string) => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query Query($contestId: ID!){
        contest(contestId: $contestId){
            id
            space{
                id
                name
                displayName
                logoUrl
            }
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
    next: { tags: [`contest/${contestId}`] }, // always cache the contest data
  })
    .then((res) => res.json())
    .then((res) => res.data.contest);
  return data;
};

// get the submissions by contestID:

const getSubmissions = async (contestId: string) => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query Query($contestId: ID!){
        contest(contestId: $contestId){
            submissions {
                id
                contestId
                author
                created
                type
                url
                version
            }
        }
    }`,
      variables: {
        contestId,
      },
    }),
    next: { tags: [`submissions/${contestId}`], revalidate: 60 }, // cache submissions for 60 seconds
  })
    .then((res) => res.json())
    .then((res) => res.data.contest.submissions);
  return data;
};

const getTweetQueueStatus = async (contestId: string) => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query Query($contestId: ID!) {
        isContestTweetQueued(contestId: $contestId)
      }`,
      variables: {
        contestId,
      },
    }),
  })
    .then((res) => res.json())
    .then((res) => res.data);
  return data;
};

const fetchSubmission = async (url: string) => {
  return fetch(url).then((res) => res.json()); // cache every submission request as we don't yet allow editing
};

export default async function Page({
  params,
}: {
  params: { id: string; name: string };
}) {
  const [
    {
      metadata,
      deadlines,
      promptUrl,
      space,
      submitterRewards,
      voterRewards,
      votingPolicy,
      tweetId,
    },
    submissions,
    isContestTweetQueued,
  ] = await Promise.all([
    getContest(params.id),
    getSubmissions(params.id),
    getTweetQueueStatus(params.id),
  ]);

  const resolvedSubmissions = await Promise.all(
    submissions.map(async (submission, idx) => {
      const data = await fetchSubmission(submission.url);
      return { ...submission, data: data };
    })
  );

  const promptData = await fetch(promptUrl).then((res) => res.json());

  const fallback = {
    [`/ipfs/submissions/${params.id}`]: resolvedSubmissions,
  };

  return (
    <>
      <div className="flex flex-col w-full gap-4">
        {/*@ts-expect-error*/}
        <Prompt
          space={space}
          contestId={params.id}
          metadata={metadata}
          deadlines={deadlines}
          promptUrl={promptUrl}
          tweetId={tweetId}
        />
        <SwrProvider fallback={fallback}>
          <SubmissionDisplay contestId={params.id} />
        </SwrProvider>
      </div>
      <ContestSidebar
        contestId={params.id}
        spaceName={params.name}
        spaceId={space.id}
        startTime={deadlines.startTime}
        prompt={promptData}
        submitterRewards={submitterRewards}
        voterRewards={voterRewards}
        votingPolicy={votingPolicy}
      />
    </>
  );
}

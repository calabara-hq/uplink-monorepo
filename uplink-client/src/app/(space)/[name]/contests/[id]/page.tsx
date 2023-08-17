import Prompt from "@/ui/Contests/ContestPrompt";
import SubmissionDisplay from "@/ui/Contests/SubmissionDisplay";
import { Suspense } from "react";
import { SubmissionDisplaySkeleton } from "@/ui/Contests/SubmissionDisplay";
import ContestSidebar from "@/ui/Contests/ContestSidebar";
import SwrProvider from "@/providers/SwrProvider";
import { getContestById } from "./fetchContest";

export default async function Page({
  params,
}: {
  params: { id: string; name: string };
}) {
  const {
    metadata,
    deadlines,
    promptUrl,
    space,
    submitterRewards,
    voterRewards,
    votingPolicy,
    tweetId,
  } = await getContestById(params.id);

  const promptData = await fetch(promptUrl).then((res) => res.json());

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
        <SubmissionDisplay contestId={params.id} />
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

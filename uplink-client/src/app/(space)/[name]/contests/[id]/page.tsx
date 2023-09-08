import SubmissionDisplay from "@/ui/Contests/SubmissionDisplay";
import ContestSidebar from "@/ui/Contests/ContestSidebar";
import { getContestById } from "./fetchContest";
import MobileActions from "@/ui/Contests/MobileActions";
import ContestHeading from "@/ui/Contests/ContestHeading";

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
        <ContestHeading
          space={space}
          metadata={metadata}
          deadlines={deadlines}
          prompt={promptData}
          tweetId={tweetId}
        />
        <MobileActions contestId={params.id} spaceName={params.name} />
        <SubmissionDisplay contestId={params.id} spaceName={params.name} />
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

import { VoteTab } from "@/ui/Contests/Vote";
import { getContestById } from "../fetchContest";

// this page offers an expanded view of the voting process for a given contest.
// it's mainly used for mobile devices only, but can be called from desktop as well.

export default async function Page({
  params,
}: {
  params: { id: string };
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

  return (
    <div className="w-full sm:w-8/12 flex flex-col justify-center border-2 border-border rounded-lg">
      <VoteTab contestId={params.id} votingPolicy={votingPolicy} />
    </div>
  );
}

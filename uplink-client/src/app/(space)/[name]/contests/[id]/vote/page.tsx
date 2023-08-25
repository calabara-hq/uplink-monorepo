import { VoteTab } from "@/ui/Contests/Vote";
import { getContestById } from "../fetchContest";
import { HiArrowNarrowLeft } from "react-icons/hi";

// this page offers an expanded view of the voting process for a given contest.
// it's mainly used for mobile devices only, but can be called from desktop as well.

export default async function Page({
  children,
  params,
}: {
  children: React.ReactNode;
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


  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 ">
      <button className="btn btn-ghost mr-auto">
        <HiArrowNarrowLeft className="h-6 w-6 mr-1" />
        <a href={`/${params.name}/contests/${params.id}`}>Back to Contest</a>
      </button>

      <div className=" w-full md:w-3/4 lg:w-2/5 flex flex-col items-center justify-center border-2 border-border rounded-lg">
        <VoteTab contestId={params.id} votingPolicy={votingPolicy} />
      </div>
    </div>
  );
}

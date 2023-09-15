import Link from "next/link";
import { VoteTab } from "@/ui/Contests/Vote";
import { HiArrowNarrowLeft } from "react-icons/hi";

// this page offers an expanded view of the voting process for a given contest.
// it's mainly used for mobile devices only, but can be called from desktop as well.

export default async function Page({
  params,
}: {
  params: { name: string; id: string };
}) {

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 ">
      <Link
        className="btn btn-ghost mr-auto"
        href={`/${params.name}/contest/${params.id}`}
      >
        <HiArrowNarrowLeft className="h-6 w-6 mr-1" />
        Back to Contest
      </Link>

      <div className=" w-full md:w-3/4 lg:w-2/5 flex flex-col items-center justify-center border-2 border-border rounded-lg">
        <h2 className="text-xl font-semibold text-t1">My Selections</h2>
        <VoteTab contestId={params.id} />
      </div>
    </div>
  );
}

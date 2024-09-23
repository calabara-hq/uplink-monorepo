import Link from "next/link";
import { VoteTab } from "@/ui/Vote/Vote";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { Button } from "@/ui/DesignKit/Button";

// this page offers an expanded view of the voting process for a given contest.
// it's mainly used for mobile devices only, but can be called from desktop as well.

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 ">
      <Link
        className="mr-auto flex items-center gap-1"
        passHref
        draggable={false}
        href={`/contest/${params.id}`}
      >
        <Button variant="link">
          <HiArrowNarrowLeft className="h-6 w-6 mr-1" />
          Back to Contest
        </Button>
      </Link>

      <div className=" w-full md:w-3/4 lg:w-2/5 flex flex-col items-center justify-center border-2 border-border rounded-lg">
        <h2 className="text-xl font-semibold text-t2 self-start p-2">My Selections</h2>
        <VoteTab contestId={params.id} />
      </div>
    </div>
  );
}

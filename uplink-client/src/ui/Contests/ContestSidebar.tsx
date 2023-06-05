"use client";
import { useContestState } from "@/providers/ContestStateProvider";
import Link from "next/link";

/**
 *
 * the standard sidebar for the main contest view
 *
 */

const Pending = () => {
  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <div className="flex flex-col justify-between bg-base-100 rounded-lg w-full">
        <div className="bg-neutral text-lg px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
          Pending
        </div>
        <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
          <p className="font-bold">
            This contest hasn't started yet. Check back soon!
          </p>
        </div>
      </div>
    </div>
  );
};

const Closed = () => {
  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <div className="flex flex-col justify-between bg-base-100 rounded-lg w-full">
        <div className="bg-neutral text-lg px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
          Contest Closed
        </div>
        <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
          <button className="btn btn-outline">Download Winners</button>
        </div>
      </div>
    </div>
  );
};

const Submitting = ({
  spaceName,
  contestId,
}: {
  spaceName: string;
  contestId: number;
}) => {
  const { stateRemainingTime } = useContestState();

  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <div className="sticky top-3 right-0 flex flex-col justify-center gap-4 w-full rounded-xl">
        <div className="flex flex-row items-center justify-between bg-base-100 rounded-lg gap-2 h-fit w-full">
          <Link
            href={`${spaceName}/contests/${contestId}/studio`}
            className="btn btn-accent flex flex-1"
          >
            Submit
          </Link>
          <p className="mx-2 p-2 text-center">{stateRemainingTime}</p>
        </div>
      </div>
    </div>
  );
};

const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;

const SidebarSkeleton = () => {
  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <div className="flex flex-col justify-between bg-base-100  rounded-lg w-full">
        <div className="space-y-2 p-4">
          <div className={`h-6 w-1/3 mb-4 rounded-lg bg-neutral ${shimmer}`} />
          <div className={`h-4 w-1/2 rounded-lg bg-neutral ${shimmer}`} />
          <div className={`h-4 w-1/2 rounded-lg bg-neutral ${shimmer}`} />
        </div>
      </div>
    </div>
  );
};

const ContestSidebar = ({
  spaceName,
  contestId,
}: {
  spaceName: string;
  contestId: number;
}) => {
  const { contestState } = useContestState();


  if (contestState === "pending") return <Pending />;
  else if (contestState === "submitting")
    return <Submitting spaceName={spaceName} contestId={contestId} />;
  else if (contestState === "voting") return <Closed />;
  else if (contestState === "end") return <Closed />;
  else return <SidebarSkeleton />;
};

export default ContestSidebar;

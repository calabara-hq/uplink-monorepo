import { getContestById } from "@/lib/fetch/contest";
import Link from "next/link";

const calculateContestState = (deadlines: any) => {
  const { startTime, voteTime, endTime } = deadlines;
  const now = new Date().toISOString();
  if (now < startTime) return "pending";
  else if (now < voteTime) return "submitting";
  else if (now < endTime) return "voting";
  else return "closed";
};

const Pending = () => {
  return (
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
  );
};

const Closed = () => {
  return (
    <div className="flex flex-col justify-between bg-base-100 rounded-lg w-full">
      <div className="bg-neutral text-lg px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
        Contest Closed
      </div>
      <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
        <button className="btn btn-outline">Download Winners</button>
      </div>
    </div>
  );
};

const Submitting = ({
  children,
  contestId,
}: {
  contestId: number;
  children: React.ReactNode;
}) => {
  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <div className="sticky top-3 right-0 flex flex-col justify-center gap-4 w-full rounded-xl">
        <div className="flex flex-row items-center justify-between bg-base-100 rounded-lg gap-2 h-fit w-full">
          <p>hello from the main submitting component</p>
          {children}
        </div>
      </div>
    </div>
  );
};

const Sidebar = async ({
  contestId,
  spaceName,
  children,
}: {
  contestId: number;
  children: React.ReactNode;
  spaceName?: string;
}) => {
  const contest = await getContestById(contestId);
  const { metadata, deadlines, promptUrl } = contest.data.contest;

  const contestState = calculateContestState(deadlines);

  if (contestState === "pending") return <Pending />;
  else if (contestState === "submitting")
    return <Submitting contestId={contestId}>{children}</Submitting>;
  else return <Closed />;
};

export default Sidebar;

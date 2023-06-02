import { getContestById } from "@/lib/fetch/contest";
import Link from "next/link";

/**
 *
 * the standard sidebar for the main contest view
 *
 */

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
  spaceName,
  contestId,
}: {
  spaceName: string;
  contestId: number;
}) => {
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
          <p className="mx-2 p-2 text-center">4 days</p>
        </div>
      </div>
    </div>
  );
};

export default async function Page({
  params,
}: {
  params: { name: string; id: string };
}) {
  const { name: spaceName, id: contestId } = params;

  const contest = await getContestById(parseInt(contestId));
  const { metadata, deadlines, promptUrl } = contest.data.contest;

  const contestState = calculateContestState(deadlines);

  if (contestState === "pending") return <Pending />;
  else if (contestState === "submitting")
    return <Submitting spaceName={spaceName} contestId={parseInt(params.id)} />;
  else return <Closed />;
}

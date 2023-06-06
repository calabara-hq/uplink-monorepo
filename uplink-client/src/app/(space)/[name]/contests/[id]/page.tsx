import Prompt from "@/ui/Contests/ContestPrompt";
import SubmissionDisplay from "@/ui/Contests/SubmissionDisplay";
import { getContestById } from "@/lib/fetch/contest";
import { Suspense } from "react";
import { SubmissionDisplaySkeleton } from "@/ui/Contests/SubmissionDisplay";
import ContestSidebar from "@/ui/Contests/ContestSidebar";

export default async function Page({
  params,
}: {
  params: { id: string; name: string };
}) {
  const contest = await getContestById(parseInt(params.id));
  const { contestId, metadata, deadlines, promptUrl, submissions } =
    contest.data.contest;

  return (
    <>
      <div className="flex flex-col w-full lg:w-3/4 gap-4">
        {/*@ts-expect-error*/}
        <Prompt
          contestId={contestId}
          metadata={metadata}
          deadlines={deadlines}
          promptUrl={promptUrl}
        />
        <Suspense fallback={<SubmissionDisplaySkeleton />}>
          {/*@ts-expect-error*/}
          <SubmissionDisplay contestId={parseInt(params.id)} />
        </Suspense>
      </div>
      <ContestSidebar contestId={parseInt(params.id)} spaceName={params.name} />
    </>
  );
}

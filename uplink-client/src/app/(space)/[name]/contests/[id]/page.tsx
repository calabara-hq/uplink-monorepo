import Prompt from "@/ui/Contests/ContestPrompt";
import SubmissionDisplay from "@/ui/Contests/SubmissionDisplay";
import { getContestById } from "@/lib/fetch/contest";
import { Suspense } from "react";
import { SubmissionDisplaySkeleton } from "@/ui/Contests/SubmissionDisplay";
import ContestSidebar from "@/ui/Contests/ContestSidebar";
import { SWRConfig } from "swr";
import SwrProvider from "@/providers/SwrProvider";

const fetchSubmission = async (url: string) => {
  console.log("fetching submission from", url);
  return fetch(url, { cache: "no-store" }).then((res) => res.json());
};


export default async function Page({
  params,
}: {
  params: { id: string; name: string };
}) {
  const contest = await getContestById(parseInt(params.id));
  const { contestId, metadata, deadlines, promptUrl, submissions } =contest.data.contest;

  
  const resolvedSubmissions = await Promise.all(submissions.map(async (submission, idx) => {
    const data = await fetchSubmission(submission.url)
    return { ...submission, data: data }
  }))

  const fallback = {
    [`/ipfs/submissions/${params.id}`]: resolvedSubmissions
  }

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
        <SwrProvider fallback={fallback}>
          <SubmissionDisplay contestId={parseInt(params.id)}/>
        </SwrProvider>
      </div>
      <ContestSidebar contestId={parseInt(params.id)} spaceName={params.name} />
    </>
  );
}

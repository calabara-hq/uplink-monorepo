import SubmissionDisplay, {
  SubmissionDisplaySkeleton,
} from "@/ui/Submission/SubmissionDisplay";
import ContestHeading, {
  ContestHeadingSkeleton,
} from "@/ui/ContestHeading/ContestHeading";
import ContestDetails, {
  DetailsSkeleton,
} from "@/ui/ContestDetails/ContestDetails";
import SidebarVote from "@/ui/Vote/Vote";
import MobileContestActions from "@/ui/MobileContestActions/MobileContestActions";
import { Suspense } from "react";
import fetchContest from "@/lib/fetch/fetchContest";
import fetchSubmissions from "@/lib/fetch/fetchSubmissions";
import SwrProvider from "@/providers/SwrProvider";

// TODO: dynamic metadata

const SubmissionDisplayWrapper = async ({
  submissionPromise,
  contestId,
  children,
}: {
  submissionPromise: Promise<any>;
  contestId: string;
  children: string;
}) => {
  const submissions = await submissionPromise;
  const fallback = {
    [`submissions/${contestId}`]: submissions,
  };
  return <SwrProvider fallback={fallback}>{children}</SwrProvider>;
};

export default async function Page({
  params,
}: {
  params: { id: string; name: string };
}) {
  const contestId = params.id;
  const spaceName = params.name;
  const contestPromise = fetchContest(contestId);
  const submissionPromise = fetchSubmissions(contestId);

  return (
    <div className="flex gap-6 m-auto w-full lg:w-[90vw]">
      <div className="flex w-full gap-6 ">
        <div className="hidden xl:block w-1/4 max-w-[300px] h-fit flex-shrink-0 border border-border rounded-lg">
          <Suspense fallback={<DetailsSkeleton />}>
            {/*@ts-expect-error*/}
            <ContestDetails contestId={contestId} contest={contestPromise} />
          </Suspense>
        </div>
        <div className="w-[60%] flex-grow ">
          <div className="flex flex-col w-full gap-4 transition-all duration-200 ease-in-out">
            <Suspense fallback={<ContestHeadingSkeleton />}>
              {/*@ts-expect-error*/}
              <ContestHeading contest={contestPromise} contestId={contestId}/>
            </Suspense>
            <MobileContestActions
              contestId={contestId}
              spaceName={spaceName}
              detailChildren={
                // @ts-expect-error
                <ContestDetails contestId={contestId} contest={contestPromise} />
              }
            />
            <Suspense fallback={<SubmissionDisplaySkeleton />}>
              {/*@ts-expect-error*/}
              <SubmissionDisplayWrapper
                submissionPromise={submissionPromise}
                contestId={contestId}
              >
                <SubmissionDisplay
                  contestId={contestId}
                  spaceName={spaceName}
                />
              </SubmissionDisplayWrapper>
            </Suspense>
          </div>
        </div>
      </div>
      <SidebarVote contestId={contestId} />
    </div>
  );
}

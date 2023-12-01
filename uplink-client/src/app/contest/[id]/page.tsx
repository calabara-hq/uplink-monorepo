import {
    LiveSubmissionDisplay,
    SubmissionDisplaySkeleton,
} from "@/ui/Submission/SubmissionDisplay";
import ContestHeading, {
    ContestHeadingSkeleton,
} from "@/ui/ContestHeading/ContestHeading";
import ContestDetails, { DetailsSkeleton } from "@/ui/ContestDetails/ContestDetails";
import SidebarVote from "@/ui/Vote/Vote";
import MobileContestActions from "@/ui/MobileContestActions/MobileContestActions";
import { Suspense } from "react";
import fetchContest from "@/lib/fetch/fetchContest";
import fetchSubmissions from "@/lib/fetch/fetchSubmissions";
import SwrProvider from "@/providers/SwrProvider";
import { Submission } from "@/types/submission";

const SubmissionDisplayWrapper = async ({
    contestId,
    children,
}: {
    contestId: string;
    children: string;
}) => {
    const submissions = await fetchSubmissions(contestId);
    const fallback = {
        [`submissions/${contestId}`]: submissions,
    };
    return <SwrProvider fallback={fallback}>{children}</SwrProvider>;
};



export default async function Page({ params }: { params: { id: string } }) {

    const contestId = params.id;

    return (
        <div className="flex gap-6 m-auto w-full lg:w-[90vw]">
            <div className="flex w-full gap-6 ">
                <div className="hidden xl:block w-1/4 max-w-[300px] h-fit flex-shrink-0 border border-border rounded-lg">
                    <Suspense fallback={<DetailsSkeleton />}>
                        {/*@ts-expect-error*/}
                        <ContestDetails contestId={contestId} />
                    </Suspense>
                </div>
                <div className="w-[60%] flex-grow ">
                    <div className="flex flex-col w-full gap-4 transition-all duration-200 ease-in-out">
                        <Suspense fallback={<ContestHeadingSkeleton />}>
                            {/*@ts-expect-error*/}
                            <ContestHeading contestId={contestId} />
                        </Suspense>
                        <MobileContestActions
                            contestId={contestId}
                            detailChildren={
                                // @ts-expect-error
                                <ContestDetails contestId={contestId}
                                />
                            }
                        />
                        <Suspense fallback={<SubmissionDisplaySkeleton />}>
                            {/*@ts-expect-error*/}
                            <SubmissionDisplayWrapper contestId={contestId}>
                                <LiveSubmissionDisplay contestId={contestId} />
                            </SubmissionDisplayWrapper>
                        </Suspense>
                    </div>
                </div>
            </div>
            <SidebarVote contestId={contestId} />
        </div>
    );
}
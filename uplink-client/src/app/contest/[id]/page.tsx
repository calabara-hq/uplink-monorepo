import {
    LiveSubmissionDisplay,
    SubmissionDisplaySkeleton,
} from "@/ui/Submission/SubmissionDisplay";
import ContestHeading, {
    ContestHeadingSkeleton,
} from "@/ui/ContestHeading/ContestHeading";
import ContestDetails, { DetailsSkeleton } from "@/ui/ContestDetails/ContestDetails";
import { VoteTab } from "@/ui/Vote/Vote";
import MobileContestActions from "@/ui/MobileContestActions/MobileContestActions";
import { Suspense } from "react";
import fetchSubmissions from "@/lib/fetch/fetchSubmissions";
import SwrProvider from "@/providers/SwrProvider";
import dynamic from "next/dynamic";

const ContestSidebar = dynamic(
    () => import("@/ui/ContestSidebar/ContestSidebar"),
    {
        ssr: false,
        loading: () => <div className="flex flex-col gap-2 border border-border rounded-lg"><DetailsSkeleton /></div>
    }
)

const SubmissionDisplayWrapper = async ({
    contestId,
    children,
}: {
    contestId: string;
    children: React.ReactNode;
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
            <div className="w-full ">
                <div className="flex flex-col w-full gap-4 transition-all duration-200 ease-in-out">
                    <Suspense fallback={<ContestHeadingSkeleton />}>
                        <ContestHeading contestId={contestId} />
                    </Suspense>
                    <MobileContestActions
                        contestId={contestId}
                        detailChildren={
                            <ContestDetails contestId={contestId}
                            />
                        }
                    />
                    <Suspense fallback={<SubmissionDisplaySkeleton />}>
                        <SubmissionDisplayWrapper contestId={contestId}>
                            <LiveSubmissionDisplay contestId={contestId} />
                        </SubmissionDisplayWrapper>
                    </Suspense>
                </div>
            </div>
            <div className="sticky top-3 right-0 hidden xl:block w-[30%] max-w-[450px] flex-shrink-0 h-full ">
                <ContestSidebar
                    detailsChild={<Suspense fallback={<DetailsSkeleton />}><ContestDetails contestId={contestId} /></Suspense>}
                    voteChild={<VoteTab contestId={contestId} />}
                />
            </div>
        </div>
    );
}
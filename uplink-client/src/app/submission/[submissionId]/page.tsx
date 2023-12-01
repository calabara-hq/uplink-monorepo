import fetchSingleSubmission from "@/lib/fetch/fetchSingleSubmission"
import ExpandedSubmission from "@/ui/Submission/ExpandedSubmission"
import { Suspense } from "react";
import { BackButton, HeaderButtons, MintButton, ShareButton } from "./client";


const ExpandedSubmissionSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="w-64 h-8 bg-base-100 shimmer rounded-lg" />
                <div className="flex flex-row items-center h-8">
                    <div className="flex gap-2 items-center">
                        <div className="w-6 h-6 bg-base-100 shimmer rounded-xl" />
                        <div className="w-16 h-4 bg-base-100 shimmer rounded-lg" />
                    </div>
                </div>
            </div>
            <div className="w-full h-0.5 bg-base-200" />
            <div className="w-96 m-auto h-96 bg-base-100 shimmer rounded-lg" />
        </div>
    );
};




// extract this out so we can suspend it
const PageContent = async ({ submissionId, referrer, context }: { submissionId: string, referrer: string | null, context: string | null }) => {
    const submission = await fetchSingleSubmission(submissionId);
    return <ExpandedSubmission submission={submission} headerChildren={<HeaderButtons submission={submission} referrer={referrer} context={context} />} />;
};

export default async function Page({
    params,
    searchParams,
}: {
    params: { submissionId: string };
    searchParams: { [key: string]: string | undefined }
}) {

    return (
        <div className="grid grid-cols-1 w-full gap-6 sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 m-auto h-full mt-4 p-4">
            <BackButton context={searchParams?.context ?? null} />
            <Suspense fallback={<ExpandedSubmissionSkeleton />}>
                {/*@ts-expect-error*/}
                <PageContent submissionId={params.submissionId} referrer={searchParams?.referrer ?? null} context={searchParams?.context ?? null} />
            </Suspense>
        </div>
    );
}
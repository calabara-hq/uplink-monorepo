import { BackButton, HeaderButtons, RenderClientSubmission } from "./client";
import fetchSingleSubmission from "@/lib/fetch/fetchSingleSubmission";
import ExpandedSubmission from "@/ui/Submission/ExpandedSubmission";
import { Suspense } from "react";



export default async function Page({
    params,
    searchParams,
}: {
    params: { submissionId: string };
    searchParams: { [key: string]: string | undefined }
}) {
    const context = searchParams?.context ?? null;

    return <RenderClientSubmission submissionId={params.submissionId} context={context} />


    //return (
    // <div className="absolute top-0 left-0 w-full h-full bg-base">
    //     <div className="grid grid-cols-1 w-full gap-6 sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 m-auto h-full mt-4 p-4">
    //         <BackButton />
    //         <Suspense fallback={<ExpandedSubmissionSkeleton />}>
    //             {/*@ts-expect-error*/}
    //             <PageContent submissionId={params.submissionId} referrer={searchParams?.referrer ?? null} context={searchParams?.context ?? null} />
    //         </Suspense>
    //     </div>
    // </div>
    //);
}
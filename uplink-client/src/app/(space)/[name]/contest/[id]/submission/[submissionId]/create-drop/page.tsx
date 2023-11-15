"use client";
import useLiveSubmissions from "@/hooks/useLiveSubmissions";
import { Submission, isNftSubmission, isStandardSubmission, isTwitterSubmission } from "@/types/submission";
import { notFound } from "next/navigation";
import CreateEdition from "@/ui/Zora/CreateEdition";
import uplinkLoadingGif from "@/../public/uplink-loading.gif"
import Image from "next/image";
const LoadingDialog = () => {
    return (
        <div
            className="animate-springUp flex flex-col gap-2 w-full h-[50vh] items-center justify-center" >
            <p className="text-lg text-t1 font-semibold">Getting ready ...</p>
            <div
                className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
            />
        </div >
    );
};

export default function Page({
    params,
}: {
    params: { name: string; id: string, submissionId: string };
}) {

    const { liveSubmissions, areSubmissionsLoading, isSubmissionError } = useLiveSubmissions(params.id);
    const submission = liveSubmissions ? liveSubmissions.find(el => el.id === params.submissionId) : null;
    console.log(submission)

    const calcImageURI = (submission: Submission) => {
        if (isStandardSubmission(submission)) {
            return submission.data.previewAsset
        }
        if (isTwitterSubmission(submission)) {
            return submission.data.thread[0].previewAsset
        }
        return ""
    }

    const calcAnimationURI = (submission: Submission) => {
        if (isStandardSubmission(submission)) {
            return submission.data?.videoAsset ?? ""
        }
        if (isTwitterSubmission(submission)) {
            return submission.data?.thread[0]?.videoAsset ?? ""
        }
        return ""
    }


    if (isSubmissionError) throw notFound();
    if (areSubmissionsLoading) return <LoadingDialog />
    if (liveSubmissions && !submission) throw notFound();
    if (isNftSubmission(submission)) {
        return (
            <div className="w-full h-[95vh] flex flex-col items-center justify-center">
                <p className="text-t1 font-bold text-2xl text-center">A drop has already been created for this submission.</p>
                <Image src={uplinkLoadingGif} alt="loading" width={250} height={250} sizes="20vw" />
            </div>
        )
    }

    return (
        <div className="w-8/12 m-auto animate-fadeIn duration-300 mt-4 mb-16">
            <CreateEdition
                contestId={params.id}
                submissionId={params.submissionId}
                name={submission.data.title}
                imageURI={calcImageURI(submission)}
                animationURI={calcAnimationURI(submission)}
                routeOnSuccess={`/${params.name}/contest/${params.id}`}
            />
        </div>
    )

}
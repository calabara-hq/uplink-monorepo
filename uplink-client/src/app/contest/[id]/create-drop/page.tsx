"use client";
import { Submission, isNftSubmission, isStandardSubmission, isTwitterSubmission } from "@/types/submission";
import { notFound } from "next/navigation";
import CreateEdition from "@/ui/Zora/CreateEdition";
import uplinkLoadingGif from "@/../public/uplink-loading.gif"
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import useMe from "@/hooks/useMe";
import { useSession } from "@/providers/SessionProvider";
import { useContestState } from "@/providers/ContestStateProvider";
import UplinkImage from "@/lib/UplinkImage"

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
    searchParams,
}: {
    params: { id: string };
    searchParams: { [key: string]: string | undefined }
}) {
    const contestId = params.id;
    const submissionId = searchParams?.sid ?? null
    if (!submissionId) throw notFound();

    const { data: session, status } = useSession();
    const { me, isMeLoading, isUserAuthorized, isMeError } = useMe(session?.user?.address);
    const { chainId } = useContestState();
    const submission = me?.submissions ? me?.submissions.find(el => el.id === submissionId) : null;

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


    if (isMeError) throw notFound();
    if (status === 'loading' || isMeLoading) return <LoadingDialog />
    if (me && !submission) {
        return (
            <div className="w-full h-[95vh] flex flex-col items-center justify-center animate-fadeIn">
                <p className="text-t1 font-bold text-2xl text-center">You are not the owner of this content.</p>
                <UplinkImage src={uplinkLoadingGif} alt="loading" width={250} height={250} sizes="20vw" />
            </div>
        )
    }
    if (submission && isNftSubmission(submission)) {
        return (
            <div className="w-full h-[95vh] flex flex-col items-center justify-center animate-fadeIn">
                <p className="text-t1 font-bold text-2xl text-center">A drop has already been created for this submission.</p>
                <UplinkImage src={uplinkLoadingGif} alt="loading" width={250} height={250} sizes="20vw" />
            </div>
        )
    }

    if (status !== 'authenticated') {
        return (
            <div className="w-8/12 m-auto animate-fadeIn duration-300 mt-4 mb-16 flex gap-2 items-center justify-center h-[80vh]">
                <p>please sign in</p>
                <WalletConnectButton />
            </div>

        )
    }

    return (
        <div className="w-10/12 md:w-8/12 m-auto animate-fadeIn duration-300 mt-4 mb-16">
            <CreateEdition
                contestId={params.id}
                chainId={chainId}
                submissionId={submissionId}
                name={submission.data.title}
                imageURI={calcImageURI(submission)}
                animationURI={calcAnimationURI(submission)}
                routeOnSuccess={`/contest/${contestId}`}
            />
        </div>
    )

}
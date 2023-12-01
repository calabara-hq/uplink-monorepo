"use client";

import { useState } from "react";
import Modal from "../Modal/Modal";
import { useContestState } from "@/providers/ContestStateProvider";
import { SectionSkeleton } from "./ContestDetails";
import test from "node:test";
import { BiTime } from "react-icons/bi";
import Link from "next/link";
import { StatusLabel } from "../ContestLabels/ContestLabels";
import { HiInformationCircle, HiOutlineLockClosed, HiPlusCircle } from "react-icons/hi2";
import { useContestInteractionApi } from "@/hooks/useContestInteractionAPI";
import { useSession } from "@/providers/SessionProvider";
import useTweetQueueStatus from "@/hooks/useTweetQueueStatus";
import { IoWarningOutline } from "react-icons/io5";
import type { OutputData } from "@editorjs/editorjs";
import toast from "react-hot-toast";
import { mutate } from "swr";
import CreateContestTweet from "../ContestForm/CreateContestTweet";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";

const DialogWrapper = ({
    bannerText,
    icon,
    children,
}: {
    bannerText: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) => {
    return (
        <div className="flex flex-col gap-2 justify-center items-center bg-base-100 rounded-lg w-full p-4">
            <div className="flex items-center gap-2 ">
                {icon}
                <p className="text-center text-t1 text-lg font-semibold">
                    {bannerText}
                </p>
            </div>
            {children}
        </div>
    );
};

const RenderRemainingTime = () => {
    const { stateRemainingTime } = useContestState();
    return <>{stateRemainingTime}</>;
};

export const ExpandSection = ({
    data,
    label,
    children,
}: {
    data: any[];
    label: string;
    children: React.ReactNode;
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div>
            {data.length > 3 && (
                <a
                    className="hover:underline text-blue-500 cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    {label}
                </a>
            )}
            <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {children}
            </Modal>
        </div>
    );
};

export const RenderStateSpecificDialog = ({
    startTime,
    prompt,
    contestId,
    spaceId,
}: {
    startTime: string;
    prompt: {
        title: string;
        body: OutputData | null;
        coverUrl?: string;
    };
    contestId: string;
    spaceId: string;
}) => {
    const { contestState, type, tweetId } = useContestState();
    if (!contestState) return <SectionSkeleton />
    else if (contestState === 'pending') { // TODO
        if (type === 'twitter' && !tweetId) {
            return <AdminsRequired startTime={startTime} prompt={prompt} contestId={contestId} spaceId={spaceId} />
        } else {
            return <Pending />
        }
    }
    else if (contestState === 'submitting') {
        return <Submit contestId={contestId} />
    }
    else if (contestState === 'voting') {
        return <Vote />
    }
    else if (contestState === 'closed') {
        return <Closed contestId={contestId} />
    }
    return null;
}

const Pending = () => {
    return (
        <DialogWrapper
            bannerText="Pending"
            icon={<BiTime className="w-16 h-16 text-purple-500" />}
        >
            <p className="text-t2 text-center">
                {`This contest hasn't started yet. Check back soon!`}
            </p>
        </DialogWrapper>
    );
};

const Submit = ({ contestId }: { contestId: string }) => {
    return (
        <div className="sticky top-3 right-0 flex flex-col justify-center gap-4 w-full rounded-xl">
            <div className="flex flex-row items-center justify-between bg-base-100 rounded-lg gap-2 h-fit w-full">
                <Link
                    href={`/contest/${contestId}/studio`}
                    className="btn btn-primary normal-case flex flex-1"
                    draggable={false}
                >
                    Submit
                </Link>
                <p className="mx-2 p-2 text-center text-t2">
                    <RenderRemainingTime />
                </p>
            </div>
        </div>
    );
};

const Vote = () => {
    return (
        <div className="flex gap-2 items-center">
            <StatusLabel status={"voting"} />
            <p className="text-t2">
                <RenderRemainingTime />
            </p>
        </div>
    );
};

const Closed = ({ contestId }: { contestId: string }) => {
    const { downloadGnosisResults } = useContestInteractionApi(contestId);
    return (
        <DialogWrapper
            bannerText="Contest Closed"
            icon={<HiOutlineLockClosed className="w-6 h-6 text-orange-500" />}
        >
            <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
                <button
                    className="btn btn-primary normal-case"
                    onClick={downloadGnosisResults}
                >
                    Download Winners
                </button>
            </div>
        </DialogWrapper>
    );
};

const AdminsRequired = ({
    startTime,
    prompt,
    contestId,
    spaceId,
}: {
    startTime: string;
    prompt: {
        title: string;
        body: OutputData | null;
        coverUrl?: string;
    };
    contestId: string;
    spaceId: string;
}) => {
    const { data: session, status } = useSession();
    const { contestAdmins } = useContestState();
    const { isTweetQueued, isLoading: isQueueStatusLoading } = useTweetQueueStatus(contestId);

    const isAdmin = contestAdmins.includes(session?.user?.address ?? "");


    if (status === "loading") return <SectionSkeleton />
    else if (isAdmin) {
        if (isQueueStatusLoading) return <SectionSkeleton />
        else if (isTweetQueued) return <TweetQueuedDialog />
        else return <TweetNotQueuedDialog startTime={startTime} prompt={prompt} contestId={contestId} spaceId={spaceId} />
    } else return <AdminRequiredDialog />
}


const AdminRequiredDialog = () => {
    const { status } = useSession();
    return (
        <DialogWrapper
            bannerText="Admins Required"
            icon={<IoWarningOutline className="w-6 h-6 text-warning" />}
        >
            <div className="flex flex-col items-center justify-evenly gap-2 w-full text-t2">
                <p className="text-center ">{`Hang tight! A space admin is needed to launch the contest.`}</p>
                <div className="flex flex-row items-center justify-start gap-2  xl:ml-auto text-t1">
                    {status !== "authenticated" ? (
                        <>
                            <p className="text-t1 text-sm">Are you an admin?</p>
                            <WalletConnectButton styleOverride="btn-sm btn-ghost" />
                        </>
                    ) : null}
                </div>
            </div>
        </DialogWrapper>
    );
};

const TweetQueuedDialog = () => {
    return (
        <DialogWrapper
            bannerText="Tweet Queued"
            icon={<HiInformationCircle className="w-6 h-6 text-primary" />}
        >
            <div className="flex flex-col items-center justify-evenly gap-2 w-full">
                <p className="font-[500] text-t2">{`The announcement tweet is queued. It will be tweeted within 5 minutes of the contest start time.`}</p>
            </div>
        </DialogWrapper>
    );
};

const TweetNotQueuedDialog = ({
    startTime,
    prompt,
    contestId,
    spaceId,
}: {
    startTime: string;
    prompt: {
        title: string;
        body: OutputData | null;
        coverUrl?: string;
    };
    contestId: string;
    spaceId: string;
}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleSuccess = () => {
        toast.success("Successfully scheduled your tweet");
        mutate(`/api/tweetQueueStatus/${contestId}`);
    };



    const customDecorators: {
        type: "text";
        data: string;
        title: string;
        icon: React.ReactNode;
    }[] = [
            {
                type: "text",
                data: `\nbegins ${new Date(startTime).toLocaleString("en-US", {
                    hour12: false,
                    timeZone: "UTC",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })} UTC`,
                title: "start time",
                icon: <HiPlusCircle className="w-5 h-5 text-t2" />,
            },
            {
                type: "text",
                data: `\n${prompt.title}`,
                title: "prompt title",
                icon: <HiPlusCircle className="w-5 h-5 text-t2" />,
            },
            {
                type: "text",
                data: `\nhttps://uplink.wtf/contest/${contestId}`,
                title: "contest url",
                icon: <HiPlusCircle className="w-5 h-5 text-t2" />,
            },
        ];

    return (
        <DialogWrapper
            bannerText="Tweet Required"
            icon={<IoWarningOutline className="w-6 h-6 text-warning" />}
        >
            <div className="flex flex-col items-center justify-evenly gap-2 w-full text-t2">
                <p className="text-center ">{`This contest requires an announcement tweet before it can begin.`}</p>
                <button
                    className="btn btn-primary btn-outline normal-case ml-auto"
                    onClick={() => setIsModalOpen(true)}
                >
                    Tweet
                </button>
            </div>
            <CreateContestTweet
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                contestId={contestId}
                spaceId={spaceId}
                customDecorators={customDecorators}
                onSuccess={handleSuccess}
                onError={() => { }}
            />
        </DialogWrapper>
    );
};
"use client";;
import { useState } from "react";
import { Modal } from "../Modal/Modal";
import { useContestState } from "@/providers/ContestStateProvider";
import { SectionSkeleton } from "./ContestDetails";
import { BiTime } from "react-icons/bi";
import Link from "next/link";
import { StatusLabel } from "../ContestLabels/ContestLabels";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { useContestInteractionApi } from "@/hooks/useContestInteractionAPI";
import type { OutputData } from "@editorjs/editorjs";
import { Button } from "@/ui/DesignKit/Button";

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
    else if (contestState === 'pending') {
        return <Pending />
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
                    className="flex flex-1"
                    draggable={false}
                    passHref
                >
                    <Button className="flex flex-1">
                        Submit
                    </Button>
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
                <Button
                    onClick={downloadGnosisResults}
                >
                    Download Winners
                </Button>
            </div>
        </DialogWrapper>
    );
};

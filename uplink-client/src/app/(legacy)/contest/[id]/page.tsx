import {
    ContestHeadingSkeleton,
} from "@/ui/ContestHeading/ContestHeading";
import { Suspense } from "react";
import fetchLegacyContest from "@/lib/fetch/fetchLegacyContest";
import Link from "next/link";
import OptimizedImage from "@/lib/OptimizedImage";
import { ChannelStateLabel } from "@/ui/ChannelSidebar/SidebarUtils";
import ExpandableTextSection from "@/ui/ExpandableTextSection/ExpandableTextSection";
import ParseBlocks from "@/lib/blockParser";
import { ImageWrapper } from "@/app/(legacy)/contest/components/MediaWrapper";
import { LiveSubmissionDisplay, SubmissionDisplaySkeleton } from "@/app/(legacy)/contest/components/SubmissionDisplay";
import { DetailsSkeleton } from "@/ui/ChannelSidebar/ContestDetailsV2";
import ContestDetails from "@/app/(legacy)/contest/components/ContestDetails";

const SubmissionWrapper = async ({
    contestId,
}: {
    contestId: string;
}) => {
    const contest = await fetchLegacyContest(contestId);

    return <LiveSubmissionDisplay contestId={contestId} submissions={contest.submissions} />

};


const LegacyContestHeading = async ({ contestId }: { contestId: string }) => {


    const contest = await fetchLegacyContest(contestId).then(async (res) => {
        const promptData = await fetch(res.promptUrl).then((res) => res.json());
        return { ...res, prompt: promptData };
    })

    const { prompt, space, metadata } = contest;

    return (
        <div className="grid grid-cols-1 w-full gap-2">
            <div className="w-full ml-auto ">
                <div className="grid grid-cols-1 sm:grid-cols-[auto_25%] gap-6 w-full p-4">
                    <div className="flex flex-col gap-2 break-words">
                        <h2 className="lg:text-3xl text-xl font-[600] text-t1">
                            {prompt.title}
                        </h2>
                        <div className="flex flex-row gap-2 items-center">
                            <Link
                                className="relative w-8 h-8 flex flex-col"
                                href={`/${space.name}`}
                                draggable={false}
                            >
                                <OptimizedImage
                                    src={space.logoUrl}
                                    alt="Org Avatar"
                                    fill
                                    className="rounded-full object-cover"
                                />
                            </Link>
                            <Link
                                className="text-sm text-t2 hover:underline hover:text-t1"
                                href={`/${space.name}`}
                                draggable={false}
                            >
                                {space.displayName}
                            </Link>
                            <ChannelStateLabel channelState="complete" />

                        </div>
                        <div className="grid grid-cols-1">
                            <ExpandableTextSection>
                                <ParseBlocks data={prompt.body} omitImages={false} />
                            </ExpandableTextSection>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 items-start w-full gap-2">
                        {prompt.coverUrl && (
                            <ImageWrapper>
                                <OptimizedImage
                                    src={prompt.coverUrl}
                                    alt="contest image"
                                    sizes="20vw"
                                    fill
                                    className="object-contain rounded-xl"
                                />
                            </ImageWrapper>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full h-0.5 bg-base-100" />
        </div>
    );
};




export default async function Page({ params }: { params: { id: string } }) {

    const contestId = params.id;

    return (
        <div className="flex gap-6 m-auto w-full lg:w-[90vw]">
            <div className="flex flex-col w-full gap-4 transition-all duration-200 ease-in-out">
                <Suspense fallback={<ContestHeadingSkeleton />}>
                    <LegacyContestHeading contestId={contestId} />
                </Suspense>

                <Suspense fallback={<SubmissionDisplaySkeleton />}>
                    <SubmissionWrapper contestId={contestId} />
                </Suspense>
            </div>
            <div className="hidden lg:block sticky top-3 right-0 w-full max-w-[450px] flex-grow h-full">
                <div className="flex flex-col gap-2 w-full border border-border bg-base-100 rounded-lg">
                    <Suspense fallback={<DetailsSkeleton />}>
                        <ContestDetails contestId={contestId} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}


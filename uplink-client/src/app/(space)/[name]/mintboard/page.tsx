import { Boundary } from "@/ui/Boundary/Boundary";
import UplinkImage from "@/lib/UplinkImage"
import Link from "next/link";
import { Suspense } from "react";
import SwrProvider from "@/providers/SwrProvider";
import { PostSkeleton, RenderPosts } from "./renderPosts";
import { HiTrash } from "react-icons/hi2";
import { MdOutlineCancelPresentation } from "react-icons/md";
import fetchMintBoard from "@/lib/fetch/fetchMintBoard";


const BoardInfoSkeleton = () => {
    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="h-6 w-1/3 bg-base-200 shimmer rounded-lg" />
            <div className="flex gap-2 items-center">
                <div className="rounded-full w-8 h-8 shimmer bg-base-200" />
                <div className="rounded-lg w-16 h-5 shimmer bg-base-200" />
            </div>
            <div className="shimmer h-4 w-80 bg-base-200 rounded-lg" />
            <div className="shimmer h-4 w-80 bg-base-200 rounded-lg" />
            <div className="shimmer h-4 w-80 bg-base-200 rounded-lg" />
        </div>
    )
}

const BoardInfo = async ({ spaceName }: { spaceName: string }) => {
    const mintBoard = await fetchMintBoard(spaceName);

    return (
        <div className="flex flex-col gap-2 ">
            <h1 className="font-bold text-3xl text-t1">{mintBoard.boardTitle}</h1>
            <div className="flex flex-row gap-2 items-center">
                <Link
                    className="relative w-8 h-8 flex flex-col"
                    href={`/${spaceName}`}
                    draggable={false}
                >
                    <UplinkImage
                        src={mintBoard.space.logoUrl}
                        alt="Org Avatar"
                        fill
                        className="rounded-full object-cover"
                    />
                </Link>
                <Link
                    className="card-title text-sm text-t2 hover:underline hover:text-t1"
                    href={`/${spaceName}`}
                    draggable={false}
                >
                    {mintBoard.space.displayName}
                </Link>
            </div>
            <p className="text-t2 whitespace-pre-line">{mintBoard.boardDescription}</p>
        </div>
    )
}

const PageFilter = ({ spaceName, isLatest, isPopular }: { spaceName: string, isLatest: boolean, isPopular: boolean, }) => {
    return (
        <div className="flex ml-auto gap-2">
            <div className="flex flex-col gap-1 w-fit">
                <Link
                    href={`/${spaceName}/mintboard`}
                    className={`hover:text-t1 ${isLatest ? "text-t1" : "text-t2"}`}
                    scroll={false}
                    draggable={false}
                >
                    Latest
                </Link>
                {isLatest && <div className={`bg-t1 w-full h-0.5 animate-scrollInX`} />}
            </div>
            <div className="flex flex-col gap-1">
                <Link
                    href={`/${spaceName}/mintboard?popular=true`}
                    className={`hover:text-t1 ${isPopular ? "text-t1" : "text-t2"}`}
                    scroll={false}
                    draggable={false}
                >
                    Popular
                </Link>
                {isPopular && <div className={`bg-t1 w-full h-0.5 animate-scrollInX`} />}
            </div>
        </div>
    )
}


const CreatePostButton = async ({ spaceName }: { spaceName: string }) => {
    const mintBoard = await fetchMintBoard(spaceName);

    return (
        <Boundary size="small">
            <div className="flex flex-col gap-4 h-full justify-between">
                <ol className="text-t2 list-disc space-y-2">
                    <li className="text-sm text-t2">Share posts to earn referral rewards.</li>
                    <li className="text-sm text-t2">Earn 0.000333 ETH for every mint your post receives!</li>
                    <li className="text-sm text-t2">0.000111 ETH from every mint goes to the {mintBoard.space.displayName} treasury.</li>
                </ol>
                <Link href={`/${spaceName}/mintboard/studio`} className="btn btn-primary normal-case">Post</Link>
            </div>
        </Boundary>

    )
}

const CreatePostSkeleton = () => {
    return (
        <Boundary size="small">
            <div className="flex flex-col gap-4 h-full justify-between">
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-3/4 bg-base-200 shimmer rounded-lg" />
                    <div className="h-4 w-3/4 bg-base-200 shimmer rounded-lg" />
                    <div className="h-4 w-3/4 bg-base-200 shimmer rounded-lg" />
                </div>
                <div className="bg-base-100 w-full h-12 shimmer rounded-lg" />
            </div>
        </Boundary>
    )
}

const Posts = async ({ spaceName, isPopular }: { spaceName: string, isPopular: boolean }) => {
    const mintBoard = await fetchMintBoard(spaceName);

    const fallback = {
        [`/mintBoard/${spaceName}`]: mintBoard,
    };

    return (
        <SwrProvider fallback={fallback}>
            <RenderPosts spaceName={spaceName} isPopular={isPopular} />
        </SwrProvider>
    )
}

export default async function Page({ params, searchParams }: { params: { name: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
    const spaceName = params.name;
    const isPopular = searchParams?.popular === "true"
    const isLatest = !isPopular

    return (
        <div className=" flex flex-col gap-6 w-full md:w-10/12 xl:w-9/12 m-auto mt-4 mb-16 p-4">
            <div className="grid grid-cols-1 md:grid-cols-[auto_35%] gap-8 w-full p-4">
                <Suspense fallback={<BoardInfoSkeleton />}>
                    <BoardInfo spaceName={spaceName} />
                </Suspense>
                <Suspense fallback={<CreatePostSkeleton />}>
                    <CreatePostButton spaceName={spaceName} />
                </Suspense>

            </div>
            <div className="flex flex-col gap-1">
                <PageFilter spaceName={spaceName} isLatest={isLatest} isPopular={isPopular} />
                <div className="w-full bg-base-200 h-0.5" />
            </div>
            <div className="flex flex-col gap-4">
                <Suspense fallback={<PostSkeleton />}>
                    <Posts spaceName={spaceName} isPopular={isPopular} />
                </Suspense>
            </div>
        </div>
    )
}
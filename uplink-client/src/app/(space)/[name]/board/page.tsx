import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";
import { Boundary } from "@/ui/Boundary/Boundary";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import SwrProvider from "@/providers/SwrProvider";
import { RenderPosts } from "./renderPosts";
import { HiTrash } from "react-icons/hi2";
import { MdOutlineCancelPresentation } from "react-icons/md";


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
            {/* <p className="text-t2">{space.mintBoard.boardDescription}</p> */}
        </div>
    )
}

const BoardInfo = async ({ spaceName }: { spaceName: string }) => {
    const space = await fetchSingleSpace(spaceName);

    return (
        <div className="flex flex-col gap-2 ">
            <h1 className="font-bold text-3xl text-t1">{space.mintBoard.boardTitle}</h1>
            <div className="flex flex-row gap-2 items-center">
                <Link
                    className="relative w-8 h-8 flex flex-col"
                    href={`/${space.name}`}
                    draggable={false}
                >
                    <Image
                        src={space.logoUrl}
                        alt="Org Avatar"
                        fill
                        className="rounded-full object-cover"
                    />
                </Link>
                <Link
                    className="card-title text-sm text-t2 hover:underline hover:text-t1"
                    href={`/${space.name}`}
                    draggable={false}
                >
                    {space.displayName}
                </Link>
            </div>
            <p className="text-t2">{space.mintBoard.boardDescription}</p>
        </div>
    )
}

const PageFilter = ({ spaceName, isLatest, isPopular }: { spaceName: string, isLatest: boolean, isPopular: boolean, }) => {
    return (
        <div className="flex ml-auto gap-2">
            <div className="flex flex-col gap-1 w-fit">
                <Link
                    href={`/${spaceName}/board`}
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
                    href={`/${spaceName}/board?popular=true`}
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


const CreatePostButton = ({ spaceName }: { spaceName: string }) => {
    return (
        <Boundary labels={['Create Post']}>
            <div className="flex flex-col gap-2 h-full justify-between">
                <p className="text-sm text-t2">Earn 0.000333 ETH for every mint your post receives!</p>
                <Link href={`/${spaceName}/board/studio`} className="btn btn-primary  normal-case">Post</Link>
            </div>
        </Boundary>

    )
}


export default async function Page({ params, searchParams }: { params: { name: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
    const spaceName = params.name;
    const space = await fetchSingleSpace(spaceName);
    const isPopular = searchParams?.popular === "true"
    const isLatest = !isPopular

    const fallback = {
        [`mintBoard/${spaceName}`]: space,
    };

    return (
        <div className=" flex flex-col gap-6 w-full md:w-10/12 xl:w-9/12 m-auto mt-4 mb-16 p-4">
            <div className="grid grid-cols-1 md:grid-cols-[auto_35%] gap-8 w-full p-4">
                <Suspense fallback={<BoardInfoSkeleton />}>
                    {/*@ts-expect-error*/}
                    <BoardInfo spaceName={spaceName} />
                </Suspense>

                <CreatePostButton spaceName={spaceName} />

            </div>
            <div className="flex flex-col gap-1">
                <PageFilter spaceName={spaceName} isLatest={isLatest} isPopular={isPopular} />
                <div className="w-full bg-base-200 h-0.5" />
            </div>
            <div className="flex flex-col gap-4">
                <SwrProvider fallback={fallback}>
                    <RenderPosts spaceName={spaceName} />
                </SwrProvider>
            </div>
        </div>
    )
}
import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const BoardInfo = async ({ spaceName }: { spaceName: string }) => {
    const space = await fetchSingleSpace(spaceName);

    return (
        <div className="flex flex-col gap-2 ">
            <h1 className="font-bold text-3xl text-t1">Title</h1>
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
            <p className="text-t2">{`is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`}</p>
        </div>
    )
}


const CreatePost = ({ spaceName }: { spaceName: string }) => {
    return (
        <div className="flex flex-col ">
            <Link href={`/${spaceName}/board/studio`} className="btn btn-primary w-full h-full normal-case">Post</Link>
        </div>
    )
}


const PageFilter = ({ spaceName, isAll, isPopular, isUnminted }: { spaceName: string, isAll: boolean, isPopular: boolean, isUnminted: boolean }) => {
    return (
        <div className="flex ml-auto gap-2">
            <div className="flex flex-col gap-1 w-fit">
                <Link
                    href={`/${spaceName}/board`}
                    className={`hover:text-t1 ${isAll && "text-t1 "}`}
                    scroll={false}
                    draggable={false}
                >
                    All
                </Link>
                {isAll && <div className={`bg-t1 w-full h-0.5 animate-scrollInX`} />}
            </div>
            <div className="flex flex-col gap-1">
                <Link
                    href={`/${spaceName}/board?popular=true`}
                    className={`hover:text-t1 ${isPopular && "text-t1 "}`}
                    scroll={false}
                    draggable={false}
                >
                    Popular
                </Link>
                {isPopular && <div className={`bg-t1 w-full h-0.5 animate-scrollInX`} />}
            </div>
            <div className="flex flex-col gap-1">
                <Link
                    href={`/${spaceName}/board?unminted=true`}
                    className={`hover:text-t1 ${isUnminted && "text-t1 "}`}
                    scroll={false}
                    draggable={false}
                >
                    Un-Minted
                </Link>
                {isUnminted && <div className={`bg-t1 w-full h-0.5 animate-scrollInX`} />}
            </div>
        </div>
    )
}


export default async function Page({ params, searchParams }: { params: { name: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
    const spaceName = params.name;
    const space = await fetchSingleSpace(spaceName);
    const isPopular = searchParams?.popular === "true"
    const isUnminted = searchParams?.unminted === "true"
    const isAll = !isPopular && !isUnminted

    return (
        <div className=" flex flex-col gap-6 w-full md:w-10/12 m-auto mt-4 mb-16 p-4">
            <div className="grid grid-cols-1 md:grid-cols-[auto_25%] gap-6 w-full p-4">
                <Suspense fallback={<p>loading</p>}>
                    {/*@ts-expect-error*/}
                    <BoardInfo spaceName={spaceName} />
                </Suspense>
                <CreatePost spaceName={spaceName} />
            </div>
            <div className="flex flex-col">
                <PageFilter spaceName={spaceName} isAll={isAll} isPopular={isPopular} isUnminted={isUnminted} />
                <div className="w-full bg-base-200 h-0.5" />
            </div>
        </div>
    )
}
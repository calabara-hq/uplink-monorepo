import fetchChannel from "@/lib/fetch/fetchChannel";
import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";
import { fetchTokensV2 } from "@/lib/fetch/fetchTokensV2";
import { parseIpfsUrl } from "@/lib/ipfs";
import UplinkImage from "@/lib/UplinkImage";
import SwrProvider from "@/providers/SwrProvider";
import { ContractID } from "@/types/channel";
import { VoteCart } from "@/ui/ChannelSidebar/VoteCart";
import { MintTokenSwitch } from "@/ui/Token/MintToken";
import Link from "next/link";
import { Suspense } from "react";
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";


const ExpandedPostSkeleton = () => {
    return <p>loading</p>
}


const Post = async ({ spaceName, contractId, postId, searchParams }: { spaceName: string, contractId: ContractID, postId: string, searchParams: { [key: string]: string | undefined } }) => {

    const [
        channel,
        tokens
    ] = await Promise.all([
        fetchChannel(contractId),
        //fetchSingleTokenV2(contractId, postId)
        fetchTokensV2(contractId, 100, 0) // +1 because order is reversed
    ])

    // return <pre>{JSON.stringify(tokens, null, 2)}</pre>

    return <MintTokenSwitch
        referral={searchParams.referral}
        contractAddress={channel.id}
        channel={channel}
        token={tokens.data.find(token => token.tokenId === postId)}
        display="contest-expanded"
        backwardsNavUrl={``}
    />
}

const ChannelDetails = async ({ spaceName, contractId }: { spaceName: string, contractId: ContractID }) => {

    const channel = await fetchChannel(contractId)

    const space = await fetchSingleSpace(spaceName)

    return (
        <div className="flex flex-col gap-2 rounded-lg w-full">
            <h2 className="lg:text-xl text-xl font-[600] text-t1">
                {channel.name}
            </h2>
            <div className="flex flex-row gap-2 items-center">
                <Link
                    className="relative w-8 h-8 flex flex-col"
                    href={`/${space.name}`}
                    draggable={false}
                >
                    <UplinkImage
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
            <div className="h-0.5 bg-base-100 w-full" />
        </div>
    )
}


const Sidebar = async ({ spaceName, contractId, postId, searchParams }: { spaceName: string, contractId: ContractID, postId: string, searchParams: { [key: string]: string | undefined } }) => {

    const [
        channel,
        tokens
    ] = await Promise.all([
        fetchChannel(contractId),
        //fetchSingleTokenV2(contractId, postId)
        fetchTokensV2(contractId, 100, 0) // +1 because order is reversed 
    ])

    const fallback = {
        [`/swrChannel/${contractId}`]: channel,
    }

    const prevToken = tokens.data.find(token => Number(token.tokenId) === Number(postId) - 1)
    const nextToken = tokens.data.find(token => Number(token.tokenId) === Number(postId) + 1)

    return (
        <div className="flex flex-col gap-2 border border-border bg-base-100 rounded-lg w-full p-4">
            <div className="flex flex-row w-full gap-2">
                {prevToken && (
                    <Link href={`/${spaceName}/contest/${contractId}/post/${prevToken.tokenId}`} className="bg-base-200 rounded-lg p-2 flex flex-col gap-2 items-left w-full max-w-[50%]">
                        <div className="flex flex-row gap-2 items-center text-t2">
                            <HiArrowNarrowLeft className="w-6 h-6" />
                            <p>Previous post</p>
                        </div>
                        <p className="font-bold line-clamp-1">{prevToken.metadata.name} {prevToken.metadata.name} {prevToken.metadata.name} {prevToken.metadata.name} {prevToken.metadata.name}</p>
                    </Link>
                )}
                {nextToken && (
                    <Link href={`/${spaceName}/contest/${contractId}/post/${nextToken.tokenId}`} className="bg-base-200 rounded-lg p-2 flex flex-col gap-2 items-center ml-auto w-full max-w-[50%]">
                        <div className="flex flex-row gap-2 text-t2 mr-auto items-center">
                            <p>Next post</p>
                            <HiArrowNarrowRight className="w-6 h-6" />
                        </div>
                        <p className="font-bold line-clamp-1">{nextToken.metadata.name} {nextToken.metadata.name} {nextToken.metadata.name} {nextToken.metadata.name} {nextToken.metadata.name}</p>
                    </Link>
                )}
            </div>
            <div className="h-0.5 bg-base-200 w-full" />

            <SwrProvider fallback={fallback} >
                <VoteCart contractId={contractId} />
            </SwrProvider>

        </div>
    )
}

export default function Page({ params, searchParams }: { params: { name: string, contractId: ContractID, postId: string }, searchParams: { [key: string]: string | undefined } }) {

    return (

        <div className="flex gap-6 m-auto w-full lg:w-[90vw] ">
            <div className="flex flex-col w-5/12 ml-auto gap-4 transition-all duration-200 ease-in-out">
                <Suspense fallback={<ExpandedPostSkeleton />}>
                    {/* <ChannelDetails spaceName={params.name} contractId={params.contractId} /> */}
                    <Post spaceName={params.name} contractId={params.contractId} postId={params.postId} searchParams={searchParams} />
                </Suspense>
            </div>
            <div className="hidden lg:block sticky top-3 right-0 w-full max-w-[450px] flex-grow h-full">
                <Suspense fallback={<ExpandedPostSkeleton />}>
                    <Sidebar spaceName={params.name} contractId={params.contractId} postId={params.postId} searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    )

    return (
        <div className="grid grid-cols-[70%_30%] gap-6 w-9/12 m-auto h-full mt-4 p-4">
            <Suspense fallback={<ExpandedPostSkeleton />}>
                <Post spaceName={params.name} contractId={params.contractId} postId={params.postId} searchParams={searchParams} />
            </Suspense>
            <Suspense fallback={<ExpandedPostSkeleton />}>
                <Sidebar spaceName={params.name} contractId={params.contractId} postId={params.postId} searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
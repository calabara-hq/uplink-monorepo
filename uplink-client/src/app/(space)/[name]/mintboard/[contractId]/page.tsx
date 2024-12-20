import fetchChannel from '@/lib/fetch/fetchChannel';
import fetchSingleSpace from '@/lib/fetch/fetchSingleSpace';
import { fetchPopularTokens, fetchTokenIntents, fetchTokensV1, fetchTokensV2 } from '@/lib/fetch/fetchTokensV2';
import { parseIpfsUrl } from '@/lib/ipfs';
import OptimizedImage from '@/lib/OptimizedImage';
import SwrProvider from '@/providers/SwrProvider';
import { Boundary } from '@/ui/Boundary/Boundary';
import Link from 'next/link';
import React, { Suspense } from 'react';
import { unstable_serialize } from 'swr';
import { ChannelUpgrades, MintFeeDonut, PostSkeleton, RenderDefaultTokens, RenderPopularTokens, RenderTokenIntents, WhatsNew } from './client';
import { ContractID, doesChannelHaveFees, splitContractID } from '@/types/channel';
import { notFound } from 'next/navigation';
import { MdNewReleases } from 'react-icons/md';
import { AdminWrapper } from '@/lib/AdminWrapper';
import { Button } from '@/ui/DesignKit/Button';

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
    );
};

const BoardInfo = async ({ spaceName, contractId }: { spaceName: string, contractId: ContractID }) => {
    const channel_promise = fetchChannel(contractId)
    const space_promise = fetchSingleSpace(spaceName)

    const [channel, space] = await Promise.all([channel_promise, space_promise])
    const ipfsData = await fetch(parseIpfsUrl(channel.uri).gateway).then(res => res.json())

    const fallback = {
        [`/swrChannel/${contractId}`]: channel,
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-[auto_40%] gap-6 w-full">
            <SwrProvider fallback={fallback}>
                <div className="flex flex-col gap-2 ">
                    <h1 className="font-bold text-3xl text-t1">{channel.name}</h1>
                    <div className="flex flex-row gap-2 items-center">
                        <Link
                            className="relative w-8 h-8 flex flex-col"
                            href={`/${spaceName}`}
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
                            href={`/${spaceName}`}
                            draggable={false}
                        >
                            {space.displayName}
                        </Link>
                    </div>
                    <p className="text-t2 whitespace-pre-line">
                        {ipfsData.description}
                    </p>
                </div>
            </SwrProvider>
            <div className="flex flex-col gap-4 h-full w-full md:max-w-[320px] ml-auto">
                <AdminWrapper admins={space.admins}>
                    <Boundary size="small" labels={["Admin"]}>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row justify-between items-center text-t1">
                                Manage settings
                                <Link href={`/${spaceName}/mintboard/${contractId}/edit`} passHref>
                                    <Button variant="outline">
                                        Edit
                                    </Button>
                                </Link>
                            </div>
                            <ChannelUpgrades contractId={contractId} />
                        </div>
                    </Boundary>
                </AdminWrapper>
                {doesChannelHaveFees(channel) && (

                    <MintFeeDonut channelFees={channel.fees} chainId={channel.chainId} spaceName={space.displayName} />

                )}
                <Link
                    href={`/${spaceName}/mintboard/${contractId}/studio`}
                    className="w-full ml-auto"
                    passHref
                >
                    <Button className="ml-auto w-full">
                        Post
                    </Button>
                </Link>
            </div>
        </div>
    );
};


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
    );
};


const PageFilter = ({
    spaceName,
    contractId,
    tab
}: {
    spaceName: string;
    contractId: ContractID;
    tab: "default" | "popular" | "intent";
}) => {

    return (
        <div className="flex ml-auto gap-2">
            <div className="flex flex-col gap-1 w-fit">
                <Link
                    href={`/${spaceName}/mintboard/${contractId}`}
                    className={`hover:text-t1 ${tab === "default" ? "text-t1" : "text-t2"}`}
                    scroll={false}
                    draggable={false}
                >
                    Latest
                </Link>
                {tab === "default" && <div className={`bg-t1 w-full h-0.5 animate-scrollInX`} />}
            </div>
            <div className="flex flex-col gap-1">
                <Link
                    href={`/${spaceName}/mintboard/${contractId}?popular=true`}
                    className={`hover:text-t1 ${tab === "popular" ? "text-t1" : "text-t2"}`}
                    scroll={false}
                    draggable={false}
                >
                    Popular
                </Link>
                {tab === "popular" && (
                    <div className={`bg-t1 w-full h-0.5 animate-scrollInX`} />
                )}
            </div>
            <div className="relative flex flex-col gap-1">
                <Link
                    href={`/${spaceName}/mintboard/${contractId}?intent=true`}
                    className={` hover:text-t1 ${tab === "intent" ? "text-t1" : "text-t2"}`}
                    scroll={false}
                    draggable={false}
                >
                    Intents
                </Link>
                <MdNewReleases className="absolute -top-2 -right-3 text-primary" />
                {tab === "intent" && (
                    <div className={`bg-t1 w-full h-0.5 animate-scrollInX`} />
                )}
            </div>
        </div>
    );
};



const Posts = async ({
    spaceName,
    contractId,
    tab
}: {
    spaceName: string;
    contractId: ContractID;
    tab: "default" | "popular" | "intent";
}) => {

    const [
        firstPageV2Tokens,
        firstPageV1Tokens,
        firstPageIntents,
        popularTokens,
        channel

    ] = await Promise.all([
        fetchTokensV2(contractId, 50, 0),
        fetchTokensV1(contractId, 50, 0),
        fetchTokenIntents(contractId, 50, 0),
        fetchPopularTokens(contractId, 50, 0),
        fetchChannel(contractId)
    ])

    const fallback = {
        [unstable_serialize(() => ['mintBoard', contractId, 'posts', 50, 0])]: [firstPageV2Tokens],
        [unstable_serialize(() => ['mintBoard', contractId, 'postsV1', 50, 0])]: [firstPageV1Tokens],
        [unstable_serialize(() => ['mintBoard', contractId, 'intents', 50, 0])]: [firstPageIntents],
        [unstable_serialize(() => ['mintBoard', contractId, 'popular', 50, 0])]: [popularTokens],
        [`/swrChannel/${contractId}`]: channel,
    }

    return (
        <SwrProvider fallback={fallback}>
            {tab === "default" && <RenderDefaultTokens spaceName={spaceName} contractId={contractId} />}
            {tab === "popular" && <RenderPopularTokens spaceName={spaceName} contractId={contractId} />}
            {tab === "intent" && (
                <React.Fragment>
                    <WhatsNew />
                    <RenderTokenIntents spaceName={spaceName} contractId={contractId} />
                </React.Fragment>
            )}
        </SwrProvider>
    );
};

export default async function Page({
    params,
    searchParams,
}: {
    params: { name: string, contractId: ContractID };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const spaceName = params.name;
    const contractId = params.contractId;
    const tab = searchParams.popular === "true" ? "popular" : searchParams.intent === "true" ? "intent" : "default";

    const { contractAddress, chainId } = splitContractID(contractId);

    if (!contractAddress || !chainId) return notFound();

    return (
        <div className="grid grid-cols-1 gap-6 w-full md:w-10/12 xl:w-9/12 m-auto mt-4 mb-16 p-4 md:p-0">

            <Suspense fallback={<BoardInfoSkeleton />}>
                <BoardInfo spaceName={spaceName} contractId={contractId} />
            </Suspense>
            <div className="flex flex-col gap-1">
                <PageFilter
                    spaceName={spaceName}
                    contractId={contractId}
                    tab={tab}
                />
                <div className="w-full bg-base-200 h-0.5" />
            </div>
            <div className="flex flex-col gap-4">
                <Suspense fallback={<PostSkeleton />}>
                    <Posts spaceName={spaceName} contractId={contractId} tab={tab} />
                </Suspense>
            </div>
        </div>
    );
}

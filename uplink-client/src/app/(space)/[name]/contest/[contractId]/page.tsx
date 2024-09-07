import fetchChannel from '@/lib/fetch/fetchChannel';
import { ContractID } from '@/types/channel';
import { ContestHeadingV2 } from '@/ui/ContestHeading/ContestHeading';
import { Suspense } from 'react';
import { fetchFiniteChannelTokensV2 } from '@/lib/fetch/fetchTokensV2';
import { unstable_serialize } from 'swr';
import SwrProvider from '@/providers/SwrProvider';
import { PostSkeleton } from '../../mintboard/[contractId]/client';
import { RenderV2Tokens } from './client';
import fetchSingleSpace from '@/lib/fetch/fetchSingleSpace';

const Posts = async ({
    spaceName,
    contractId,
}: {
    spaceName: string;
    contractId: ContractID;
}) => {

    const [
        firstPageV2Tokens,
        channel

    ] = await Promise.all([
        fetchFiniteChannelTokensV2(contractId, 50, 0),
        fetchChannel(contractId)
    ])

    const fallback = {
        [unstable_serialize(() => ['contest', contractId, 'posts', 50, 0])]: [firstPageV2Tokens],
        [`/swrChannel/${contractId}`]: channel,
    }

    return (
        <SwrProvider fallback={fallback}>
            <RenderV2Tokens spaceName={spaceName} contractId={contractId} />
        </SwrProvider>
    );
};

export default async function Page({
    params,
}: {
    params: { name: string, contractId: ContractID }
}) {

    const [channel, space] = await Promise.all([
        fetchChannel(params.contractId),
        fetchSingleSpace(params.name)
    ])

    return (
        <div className="flex flex-col w-full gap-4 transition-all duration-200 ease-in-out">
            <ContestHeadingV2 space={space} contractId={params.contractId} contestMetadata={{ ...channel.tokens[0].metadata, type: 'uplink-v2' }} />
            <Suspense fallback={<PostSkeleton />}>
                <Posts spaceName={params.name} contractId={params.contractId} />
                <div className="h-screen bg-blue-800" />
                <div className="h-screen bg-blue-800" />
                <div className="h-screen bg-blue-800" />
            </Suspense>
        </div>
    );
}
import fetchChannel from '@/lib/fetch/fetchChannel';
import { ContractID } from '@/types/channel';
import { ContestHeadingV2 } from '@/ui/ContestHeading/ContestHeading';
import dynamic from "next/dynamic";
import { Suspense } from 'react';
import ContestDetailsV2, { DetailsSkeleton } from '@/ui/ChannelSidebar/ContestDetailsV2';
import { IFiniteTransportConfig } from '@tx-kit/sdk/subgraph';
import { fetchTokensV2 } from '@/lib/fetch/fetchTokensV2';
import { unstable_serialize } from 'swr';
import SwrProvider from '@/providers/SwrProvider';
import { PostSkeleton } from '../../mintboard/[contractId]/client';
import { RenderV2Tokens } from './client';
import { VoteCart } from '@/ui/ChannelSidebar/VoteCart';
import ContestSidebar from '@/ui/ContestSidebar/ContestSidebarV2';

// const ContestSidebar = dynamic(
//     () => import("@/ui/ContestSidebar/ContestSidebarV2"),
//     {
//         ssr: false,
//         loading: () => <div className="flex flex-col gap-2 border border-border rounded-lg w-full"><DetailsSkeleton /></div>
//     }
// )


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
        fetchTokensV2(contractId, 50, 0),
        fetchChannel(contractId)
    ])

    const fallback = {
        [unstable_serialize(() => ['mintBoard', contractId, 'posts', 50, 0])]: [firstPageV2Tokens],
        [`/swrChannel/${contractId}`]: channel,
    }

    return (
        <SwrProvider fallback={fallback}>

            <RenderV2Tokens spaceName={spaceName} contractId={contractId} />
            {/* {tab === "default" && <RenderDefaultTokens spaceName={spaceName} contractId={contractId} />}
            {tab === "popular" && <RenderPopularTokens spaceName={spaceName} contractId={contractId} />}
            {tab === "intent" && (
                <React.Fragment>
                    <WhatsNew />
                    <RenderTokenIntents spaceName={spaceName} contractId={contractId} />
                </React.Fragment>
            )} */}
        </SwrProvider>
    );
};

const StateSpecificSidebar = async ({ contractId }: { contractId: ContractID }) => {

    const channel = await fetchChannel(contractId)

    const fallback = {
        [`/swrChannel/${contractId}`]: channel,
    }

    return (
        <SwrProvider fallback={fallback}>
            <ContestSidebar
                detailsChild={
                    <ContestDetailsV2
                        contractId={contractId}
                        transportConfig={channel.transportLayer.transportConfig as IFiniteTransportConfig}
                        creatorLogic={channel.creatorLogic}
                        minterLogic={channel.minterLogic}
                    />
                }
                voteChild={<VoteCart contractId={contractId} />}
            />
        </SwrProvider>
    )
}


export default async function Page({
    params,
}: {
    params: { name: string, contractId: ContractID }
}) {

    const channel = await fetchChannel(params.contractId);

    return (
        <div className="flex gap-6 m-auto w-full lg:w-[90vw]">
            <div className="flex flex-col w-full gap-4 transition-all duration-200 ease-in-out">
                <ContestHeadingV2 contestMetadata={{ ...channel.tokens[0].metadata, type: 'uplink-v2' }} />
                {/* submission display */}
                <Suspense fallback={<PostSkeleton />}>
                    <Posts spaceName={params.name} contractId={params.contractId} />
                </Suspense>
            </div>
            <div className="hidden lg:block sticky top-3 right-0 w-full max-w-[450px] flex-grow h-full">
                <Suspense fallback={<DetailsSkeleton />}>
                    <StateSpecificSidebar contractId={params.contractId} />
                </Suspense>
            </div>
        </div>
    );


}
import fetchChannel from "@/lib/fetch/fetchChannel"
import { IFiniteTransportConfig } from "@tx-kit/sdk/subgraph"
import { ContractID } from '@/types/channel';
import dynamic from "next/dynamic";
import { Suspense } from 'react';
import ContestDetailsV2, { DetailsSkeleton } from '@/ui/ChannelSidebar/ContestDetailsV2';
import SwrProvider from '@/providers/SwrProvider';
import ContestSidebar from '@/ui/ChannelSidebar/ContestSidebarV2';

const VoteCart = dynamic(
    () => import("@/ui/ChannelSidebar/VoteCart"),
    {
        ssr: false,
        loading: () => <div className="flex flex-col gap-2 rounded-lg w-full"><DetailsSkeleton /></div>
    }
)

const StateSpecificSidebar = async ({ spaceName, contractId }: { spaceName: string, contractId: ContractID }) => {

    const channel = await fetchChannel(contractId)

    const fallback = {
        [`/swrChannel/${contractId}`]: channel,
    }

    return (
        <SwrProvider fallback={fallback}>
            <ContestSidebar
                contractId={contractId}
                detailsChild={
                    <ContestDetailsV2
                        spaceName={spaceName}
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


export default function Layout({ params, children }: { params: { name: string, contractId: ContractID }, children: React.ReactNode }) {

    return (
        <div className="hidden lg:block sticky top-3 right-0 w-full max-w-[450px] flex-grow h-full">
            <div className="flex flex-col gap-2">
                {children}
                <Suspense fallback={<div className="flex flex-col gap-2 rounded-lg w-full"><DetailsSkeleton /></div>}>
                    <StateSpecificSidebar spaceName={params.name} contractId={params.contractId} />
                </Suspense>
            </div>
        </div>
    )
}

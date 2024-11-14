"use client";
import { useState, useEffect } from "react";
import { DetailsSkeleton } from "@/app/(legacy)/contest/components/ContestDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../DesignKit/Tabs";
import { useFiniteTransportLayerState } from "@/hooks/useFiniteTransportLayerState";
import { ContractID } from "@/types/channel";


const ContestSidebar = ({
    contractId,
    detailsChild,
    voteChild
}: {
    contractId: ContractID,
    detailsChild: React.ReactNode,
    voteChild: React.ReactNode
}) => {

    const { channelState } = useFiniteTransportLayerState(contractId);

    const [isVoting, setIsVoting] = useState(false);

    useEffect(() => {
        if (channelState) {
            if (channelState === "voting") {
                setIsVoting(true);
            }
            else {
                setIsVoting(false);
            }
        }
    }, [channelState])

    if (!channelState) return (
        <div className="flex flex-col gap-2 border border-border rounded-lg w-full">
            <DetailsSkeleton />
        </div>
    )
    return (
        <div className="flex flex-col gap-2 w-full border border-border bg-base-100 rounded-lg">
            {isVoting ?
                <Tabs defaultValue="vote">
                    <TabsList className="w-full h-12 flex gap-0.5">
                        <TabsTrigger value="details" className="w-11/12 h-10">Details</TabsTrigger>
                        <TabsTrigger value="vote" className="w-11/12 h-10">Vote</TabsTrigger>
                    </TabsList>
                    <div>
                        <TabsContent value="details">{detailsChild}</TabsContent>
                        <TabsContent value="vote">{voteChild}</TabsContent>
                    </div>
                </Tabs>
                : (
                    <div>
                        {detailsChild}
                    </div>
                )}

        </div>
    )
}

export default ContestSidebar;
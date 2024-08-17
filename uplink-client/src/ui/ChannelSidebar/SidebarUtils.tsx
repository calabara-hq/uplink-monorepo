import { ChannelState, useFiniteTransportLayerState } from "@/hooks/useFiniteTransportLayerState";
import { ContractID } from "@/types/channel";
import React from "react";
import { TbLoader2 } from "react-icons/tb";


export const RenderStatefulChildAndRemainingTime = React.memo(({ contractId, childStateWindow, children }: { contractId: ContractID, childStateWindow: ChannelState, children: React.ReactNode }) => {
    const { stateRemainingTime, channelState } = useFiniteTransportLayerState(contractId);


    if (!channelState) return (
        <div className="grid grid-cols-[25%_75%] items-center justify-between gap-2 h-fit m-2">
            <div className="bg-base-100 shimmer h-12 rounded-xl p-2 flex items-center justify-center" />
            <div className="bg-base-100 shimmer w-full h-12 rounded-xl" />
        </div>
    )

    if (channelState === childStateWindow) {
        return (
            <div className="grid grid-cols-[25%_75%] items-center justify-between rounded-lg gap-2 h-fit m-2">
                <div className="bg-base-100 h-full rounded-xl p-2 flex items-center justify-center">
                    <p className="text-center text-t1 ">{
                        channelState ? stateRemainingTime : <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                    }</p>
                </div>
                {children}
            </div>
        )
    }

    else return (
        <div className="flex gap-2">
            <p>{channelState}</p>
            <p>{stateRemainingTime}</p>
        </div>
    )
});

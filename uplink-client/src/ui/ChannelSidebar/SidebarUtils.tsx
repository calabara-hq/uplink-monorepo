"use client";
import { ChannelState, StateRemainingTime, useFiniteTransportLayerState } from "@/hooks/useFiniteTransportLayerState";
import { cn } from "@/lib/shadcn";
import { ContractID } from "@/types/channel";
import React from "react";
import { TbLoader2 } from "react-icons/tb";


const getColorsFromState = (state: ChannelState) => {
    switch (state) {
        case 'pre-submit':
            return "bg-blue-100 text-blue-500";
        case 'submitting':
            return "bg-green-100 text-green-500";
        case 'voting':
            return "bg-yellow-100 text-yellow-500";
        case 'complete':
            return "bg-primary8 text-primary11";
        case 'settled':
            return "bg-gray-100 text-gray-500";
    }
}

export const RemainingTimeLabel = ({ channelState, remainingTime }: { channelState: ChannelState, remainingTime: StateRemainingTime }) => {
    if (!remainingTime) return null;
    return (
        <div className={cn(
            "rounded-xl pl-2 pr-2 font-normal bg-opacity-10 text-sm",
            getColorsFromState(channelState)
        )}>
            {remainingTime}
        </div>
    )
}

export const ChannelStateLabel = ({ channelState }: { channelState: ChannelState }) => {

    return (
        <div className={cn(
            "rounded-xl pl-2 pr-2 font-normal text-sm bg-opacity-10",
            getColorsFromState(channelState)
        )}>
            {channelState}
        </div>
    )
}


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
                <div className="bg-base-200 h-full rounded-xl p-2 flex items-center justify-center">
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
            <ChannelStateLabel channelState={channelState} />
            <RemainingTimeLabel channelState={channelState} remainingTime={stateRemainingTime} />
        </div>
    )
});

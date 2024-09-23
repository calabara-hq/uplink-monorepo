"use client";;
import { ChannelState, StateRemainingTime, useFiniteTransportLayerState } from "@/hooks/useFiniteTransportLayerState";
import { cn } from "@/lib/shadcn";
import { ContractID } from "@/types/channel";
import React from "react";


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

export const RenderTransportLayerState = React.memo(({
    contractId,
    children
}: {
    contractId: ContractID,
    children: (state: { isLoading: boolean, channelState: ChannelState | undefined, stateRemainingTime: string | null }) => React.ReactNode
}) => {
    const { stateRemainingTime, channelState } = useFiniteTransportLayerState(contractId);

    if (!channelState) {
        return (
            children({ isLoading: true, channelState, stateRemainingTime })
        );
    }

    if (channelState) {
        return (
            children({ isLoading: false, channelState, stateRemainingTime })
        );
    }

    return null;
});

RenderTransportLayerState.displayName = "RenderTransportLayerState";
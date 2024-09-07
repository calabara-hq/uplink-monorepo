"use client"
import { IFiniteTransportConfig } from "@tx-kit/sdk/subgraph"
import { useState } from "react";
import { useTicks } from "./useTicks";
import { ContractID } from "@/types/channel";
import { useChannel } from "./useChannel";

export type ChannelState = 'pre-submit' | 'submitting' | 'voting' | 'complete' | 'settled'
export type StateRemainingTime = string | null;

export const calculateChannelState = (createStart: string, mintStart: string, mintEnd: string, settled: boolean): { channelState: ChannelState, stateRemainingTime: StateRemainingTime } => {

    const start = Number(createStart);
    const vote = Number(mintStart);
    const end = Number(mintEnd);

    const now = Math.floor(Date.now() / 1000);

    let channelState: ChannelState = null;
    let remainingTime: StateRemainingTime = null;

    let nextDeadline = end;

    if (settled) {
        channelState = 'settled';
    }

    else if (now < start) {
        channelState = 'pre-submit';
        nextDeadline = start;
    }

    else if (now < vote) {
        channelState = 'submitting';
        nextDeadline = vote;
    }

    else if (now < end) {
        channelState = 'voting';
    }

    else {
        channelState = 'complete';
    }

    const seconds = nextDeadline - now;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        remainingTime = `${days} days`;
    } else if (hours > 0) {
        remainingTime = `${hours} hrs`;
    } else if (minutes > 0) {
        remainingTime = `${minutes} mins`;
    } else {
        remainingTime = seconds > 0 ? `${seconds} s` : null;
    }

    return {
        channelState,
        stateRemainingTime: remainingTime,
    }
}


export const useFiniteTransportLayerState = (contractId: ContractID) => {

    const { channel } = useChannel(contractId);

    const [channelState, setChannelState] = useState<ChannelState>(undefined);
    const [stateRemainingTime, setStateRemainingTime] = useState<string | null>(null);

    const update = () => {
        if (channel) {
            const { createStart, mintStart, mintEnd, settled } = channel.transportLayer.transportConfig as IFiniteTransportConfig;
            const { channelState: v1, stateRemainingTime: v2 } = calculateChannelState(createStart, mintStart, mintEnd, settled);
            setChannelState(v1);
            setStateRemainingTime(v2)
        }
    }

    useTicks(() => update())

    return {
        channelState,
        stateRemainingTime,
    }
}
import { IFiniteTransportConfig } from "@tx-kit/sdk/subgraph"
import { useState } from "react";
import { useTicks } from "./useTicks";
import { ContractID } from "@/types/channel";
import { useChannel } from "./useChannel";


export type ChannelState = 'pre-submit' | 'submitting' | 'voting' | 'complete' | 'settled'
export type StateRemainingTime = string | null;

const calculateChannelState = (createStart: string, mintStart: string, mintEnd: string, now: number): { channelState: ChannelState, stateRemainingTime: StateRemainingTime } => {

    const start = Number(createStart);
    const vote = Number(mintStart);
    const end = Number(mintEnd);

    let channelState = null;
    let remainingTime = null;

    let nextDeadline = end;

    if (now < start) {
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

    const { createStart, mintStart, mintEnd } = channel.transportLayer.transportConfig as IFiniteTransportConfig;
    const now = Math.floor(Date.now() / 1000);

    const update = () => {
        const { channelState: v1, stateRemainingTime: v2 } = calculateChannelState(createStart, mintStart, mintEnd, now);
        setChannelState(v1);
        setStateRemainingTime(v2)
    }

    useTicks(() => update())

    return {
        channelState,
        stateRemainingTime,
    }


}
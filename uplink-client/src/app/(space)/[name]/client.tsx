"use client";

import { calculateChannelState } from "@/hooks/useFiniteTransportLayerState";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { ChainId } from "@/types/chains";
import { SpaceStats } from "@/types/spaceStats";
import { ChannelStateLabel } from "@/ui/ChannelSidebar/SidebarUtils";
import { Address, formatUnits, parseEther, parseUnits } from "viem";
const compact_formatter = new Intl.NumberFormat('en', { notation: 'compact' })

export const ContestStatusLabel = ({ createStart, mintStart, mintEnd }: { createStart: string, mintStart: string, mintEnd: string }) => {
    const { channelState, stateRemainingTime } = calculateChannelState(createStart, mintStart, mintEnd, false);

    return (
        <div className="w-fit">
            <ChannelStateLabel channelState={channelState} />
        </div>
    )
}



export const FormatTokenStatistic = ({ tokenAddress, amount, chainId }: { tokenAddress: Address, amount: bigint, chainId: ChainId }) => {
    const { symbol, decimals, tokenType, error, isLoading } = useTokenInfo(tokenAddress, chainId);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-row gap-2 items-center justify-between text-t2">
            <p>{symbol}</p>
            <p className="text-t1 font-bold">{compact_formatter.format(Number(formatUnits(amount, decimals)))}</p>
        </div>
    )

}
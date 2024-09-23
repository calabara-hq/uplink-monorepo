"use client";

import { calculateChannelState } from "@/hooks/useFiniteTransportLayerState";
import { ChannelStateLabel } from "@/ui/ChannelSidebar/SidebarUtils";

export const ContestStatusLabel = ({ createStart, mintStart, mintEnd }: { createStart: string, mintStart: string, mintEnd: string }) => {
    const { channelState, stateRemainingTime } = calculateChannelState(createStart, mintStart, mintEnd, false);

    return (
        <div className="w-fit">
            <ChannelStateLabel channelState={channelState} />
        </div>
    )
}
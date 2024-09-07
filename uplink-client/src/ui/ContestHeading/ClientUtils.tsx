"use client"
import { ContractID, splitContractID } from "@/types/channel";
import { RenderTransportLayerState } from "../ChannelSidebar/SidebarUtils";
import { DetailSectionWrapper, LogicDisplay } from "../ChannelSidebar/ContestDetailsV2";
import { useChannel } from "@/hooks/useChannel";
import { Button } from "../DesignKit/Button";
import { useEffect, useRef, useState } from "react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { TbLoader2 } from "react-icons/tb";
import { useVoteCart } from "@/hooks/useVoteCart";
import { FaVoteYea } from "react-icons/fa";
import { VoteOrOpenDrawer } from "../ChannelSidebar/VoteCart";
import { useInView } from "react-intersection-observer";


const Skeleton = () => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="shimmer h-4 w-full bg-base-200 rounded-lg" />
        </div>
    )
}

const StickyContainer = ({ children, shouldStick }: { children: React.ReactNode, shouldStick: boolean }) => {
    const [elementStyle, setElementStyle] = useState("relative");

    useScrollPosition(
        ({ prevPos, currPos }) => {
            //const shouldStick = true //currPos.y < -350;
            const shouldBeStyle = shouldStick
                ? "fixed top-0 left-0 bg-gradient-to-b from-[#121212] items h-32 sm:pl-[64px] p-4"
                : "relative";

            if (shouldBeStyle === elementStyle) return;

            setElementStyle(shouldBeStyle);
        },
        [elementStyle, shouldStick]
    );
    return (
        <div className={`${elementStyle} w-full flex flex-col z-10 m-auto`}>
            {children}
        </div>
    );
};


export const SmallScreenToolbar = ({ contractId }: { contractId: ContractID }) => {
    const { channel } = useChannel(contractId);
    const { chainId } = splitContractID(contractId);
    const { proposedVotes } = useVoteCart(contractId);
    const { ref: stickyRef, inView } = useInView({ threshold: 0 });

    useEffect(() => {
        console.log(inView)
    }, [inView])


    return (
        <RenderTransportLayerState contractId={contractId}>
            {({ isLoading, channelState, stateRemainingTime }) => {
                if (isLoading) return <Skeleton />
                else if (channelState === "pre-submit") return <div>Pre-submit</div>
                else if (channelState === "submitting") return <div>Submitting</div>
                else if (channelState === "voting") return (
                    <div className="flex flex-col gap-2">
                        <div className="bg-base-100 rounded-lg p-2 flex-col text-t2">
                            <p>This contest is in the voting phase for the next <b>{stateRemainingTime}</b>.</p>
                            <div className="-ml-2">
                                <LogicDisplay logicObject={channel.minterLogic} chainId={chainId} creditContextLabel="votes" />
                            </div>
                        </div>
                        <div ref={stickyRef} />
                        <StickyContainer shouldStick={!inView}>
                            <div className="grid grid-cols-[24.5%_1%_74.5%]">
                                {/* <div className="rounded-lg flex items-center justify-center bg-base-200 text-t2">
                                    {isLoading ? <TbLoader2 className="w-5 h-5 animate-spin" /> : stateRemainingTime}
                                </div> */}
                                <div className="rounded-lg flex items-center justify-center gap-2 bg-base-200 text-primary11 font-bold">
                                    <FaVoteYea className="w-5 h-5" />
                                    <div>{proposedVotes.length}</div>
                                </div>
                                <div />
                                <VoteOrOpenDrawer contractId={contractId}>
                                    <Button variant="default" disabled={proposedVotes.length === 0} className="w-full" size="lg"><b>Cast votes</b></Button>
                                </VoteOrOpenDrawer>

                            </div>
                        </StickyContainer>
                    </div>
                )
                else if (channelState === "complete") return <div>Post-submit</div>
                else return null;
            }}
        </RenderTransportLayerState >
    )
}
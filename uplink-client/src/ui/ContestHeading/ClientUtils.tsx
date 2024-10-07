"use client";
import { ContractID, splitContractID } from "@/types/channel";
import { RenderTransportLayerState } from "../ChannelSidebar/SidebarUtils";
import { LogicDisplay } from "../ChannelSidebar/ContestDetailsV2";
import { useChannel } from "@/hooks/useChannel";
import { Button } from "../DesignKit/Button";
import { useEffect, useRef, useState } from "react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { useVoteCart } from "@/hooks/useVoteCart";
import { FaVoteYea } from "react-icons/fa";
import { VoteOrOpenDrawer } from "../ChannelSidebar/VoteCart";
import Link from "next/link";
import { TbLoader2 } from "react-icons/tb";
import { useSettleFiniteChannel } from "@tx-kit/hooks";
import { useTransmissionsErrorHandler } from "@/hooks/useTransmissionsErrorHandler";
import toast from "react-hot-toast";


const Skeleton = () => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="shimmer h-16 w-full bg-base-200 rounded-lg" />
        </div>
    )
}

const StickyContainer = ({ children }: { children: React.ReactNode }) => {
    const [isSticky, setIsSticky] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);
    const [elementTop, setElementTop] = useState<number | null>(null);

    useEffect(() => {
        // Set the initial position of the element relative to the page when the component mounts
        if (elementRef.current) {
            const rect = elementRef.current.getBoundingClientRect();
            setElementTop(rect.top + window.scrollY);
        }
    }, []);

    useScrollPosition(
        ({ currPos }) => {
            if (elementTop !== null) {
                // Check if we have scrolled past the element's top position
                if (currPos.y < -elementTop + 4) {
                    setIsSticky(true);
                } else {
                    setIsSticky(false);
                }
            }
        },
        [elementTop]
    );

    return (
        <div
            ref={elementRef}
            className={`${isSticky ? "fixed top-0 left-0 bg-gradient-to-b from-[#121212] h-32 sm:pl-[80px] p-4 z-10" : "relative"} w-full flex flex-col m-auto`}
        >
            {children}
        </div>
    );
};

export const SmallScreenToolbar = ({ contractId }: { contractId: ContractID }) => {
    const { channel } = useChannel(contractId);
    const { contractAddress, chainId } = splitContractID(contractId);
    const { proposedVotes } = useVoteCart(contractId);
    const { settle, status, txHash, error } = useSettleFiniteChannel();
    const isSettling = status === "pendingApproval" || status === "txInProgress";
    const { mutateSwrChannel } = useChannel(contractId);
    useTransmissionsErrorHandler(error);

    useEffect(() => {
        console.log(error)
    }, [error])

    useEffect(() => {
        if (status === "complete") {
            mutateSwrChannel();
            toast.success("Channel settled successfully");
        }
    }, [status])

    const handleSettle = async () => {
        await settle({ channelAddress: contractAddress });
    }


    return (
        <RenderTransportLayerState contractId={contractId}>
            {({ isLoading, channelState, stateRemainingTime }) => {
                if (isLoading) return <Skeleton />
                else if (channelState === "pre-submit") return (
                    <div className="flex flex-col gap-2">
                        <div className="bg-base-100 rounded-lg p-2 flex-col text-t2">
                            <p>This contest will begin accepting submissions in <b>{stateRemainingTime}</b>.</p>
                            <div className="-ml-2">
                                <LogicDisplay logicObject={channel.creatorLogic} chainId={chainId} creditContextLabel="entries" />
                            </div>
                        </div>
                    </div>
                )
                else if (channelState === "submitting") return (
                    <div className="flex flex-col gap-2">
                        <div className="bg-base-100 rounded-lg p-2 flex-col text-t2">
                            <p>This contest is accepting submissions for the next <b>{stateRemainingTime}</b>.</p>
                            <div className="-ml-2">
                                <LogicDisplay logicObject={channel.creatorLogic} chainId={chainId} creditContextLabel="entries" />
                            </div>
                        </div>
                        <StickyContainer>
                            <Link href={`${contractId}/studio`} passHref>
                                <Button variant="default" className="w-full" size="lg"><b>Submit</b></Button>
                            </Link>
                        </StickyContainer>
                    </div>
                )
                else if (channelState === "voting") return (
                    <div className="flex flex-col gap-2">
                        <div className="bg-base-100 rounded-lg p-2 flex-col text-t2">
                            <p>This contest is in the voting phase for the next <b>{stateRemainingTime}</b>.</p>
                            <div className="-ml-2">
                                <LogicDisplay logicObject={channel.minterLogic} chainId={chainId} creditContextLabel="votes" />
                            </div>
                        </div>
                        <StickyContainer>
                            <div className="grid grid-cols-[24.5%_1%_74.5%]">
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
                else if (channelState === "complete") return (
                    <div className="flex flex-col gap-2">
                        <div className="bg-base-100 rounded-lg p-2 flex-col text-t2">
                            <p>This contest is complete and can be settled.</p>
                        </div>
                        <Button disabled={isSettling} onClick={handleSettle}>
                            {isSettling ? (
                                <div className="flex gap-2 items-center">
                                    <p>Settling</p>
                                    <TbLoader2 className="w-4 h-4 animate-spin" />
                                </div>
                            ) : "Settle"}
                        </Button>
                    </div>
                )
                else return null;
            }}
        </RenderTransportLayerState >
    );
};
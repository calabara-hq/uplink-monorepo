"use client"
import { Channel, ChannelToken, ChannelTokenIntent, ChannelTokenV1, ContractID, isTokenV1Onchain, splitContractID } from "@/types/channel";
import { usePaginatedFinitePosts } from "@/hooks/useTokens";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardFooter } from "@/ui/Token/Card";
import SubmissionModal from "@/ui/Submission/SubmissionModal";
import { MintTokenSwitch } from "@/ui/Token/MintToken";
import { useInView } from "react-intersection-observer";
import { ManageModalContent } from "@/ui/Token/MintUtils";
import { useChannel } from "@/hooks/useChannel";

import RenderIfVisible from "@/ui/Virtualization/RenderIfVisible";
import { ColorCards } from "@/ui/DesignKit/ColorCards";
import { parseIpfsUrl } from "@/lib/ipfs";
import Link from "next/link";
import { FaCrown } from "react-icons/fa";


export const PostSkeleton = () => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex w-full justify-evenly items-center">
                <div className="w-10/12 sm:w-full m-auto grid gap-4 submission-columns auto-rows-fr">
                    <div className="space-y-2 border-border border p-2 rounded-xl h-[318px] shimmer" />
                    <div className="space-y-2 lg:col-span-1 border-border border p-2 rounded-xl h-[318px] shimmer" />
                    <div className="space-y-2 lg:col-span-1 border-border border p-2 rounded-xl h-[318px] shimmer" />
                    <div className="space-y-2 lg:col-span-1 border-border border p-2 rounded-xl h-[318px] shimmer" />
                </div>
            </div>
        </div>
    );
}

const WinnerWrapper = ({ token, children }: { token: ChannelToken & { isWinner: boolean }, children: React.ReactNode }) => {
    return (
        <div className="relative">
            {token.isWinner && (
                <div className="absolute top-0 -right-0 z-10">
                    <FaCrown className="text-yellow-500 w-8 h-8" />
                </div>
            )}
            {children}
        </div>
    )
}


const MapTokens = React.memo(({
    tokens,
    channel,
    spaceName,
    contractId,
    handleMint,
    //handleShare,
    handleManage
}: {
    tokens: Array<ChannelToken & { isWinner: boolean }>,
    channel: Channel,
    spaceName: string,
    contractId: ContractID,
    handleMint: (event: any, token: ChannelToken) => void,
    // handleShare: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void,
    handleManage: (event: any, token: ChannelToken) => void
}) => {

    return tokens.map((token, index) => {
        return (
            <RenderIfVisible
                key={index}
                defaultHeight={400}
                visibleOffset={200}
                stayRendered={false}

            >
                <Link href={`/${spaceName}/contest/${contractId}/post/${token.tokenId}`}
                    className="cursor-pointer shadow-lg shadow-black hover:shadow-[#262626] no-select rounded-lg"
                >
                    <ColorCards imageUrl={parseIpfsUrl(token.metadata.image).gateway}>
                        <WinnerWrapper token={token}>
                            <Card
                                key={index}
                                token={token}
                                footer={
                                    <CardFooter
                                        token={token}
                                        channel={{ ...channel, managers: [...channel.managers, channel.admin] }}
                                        mintLabel="votes"
                                        handleManage={handleManage}
                                    />
                                }
                            />
                        </WinnerWrapper>
                    </ColorCards>
                </Link>
            </RenderIfVisible>
        )
    })

})

MapTokens.displayName = "MapTokens";


const useTokenModalControls = (contractId: ContractID) => {
    const [isMintModalOpen, setIsMintModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [focusedToken, setFocusedToken] = useState(null);

    const handleMint = useCallback((event, token) => {
        event.stopPropagation();
        event.preventDefault();
        setIsMintModalOpen(true);
        setFocusedToken(token);
    }, []);

    const handleManage = useCallback((event, token) => {
        event.stopPropagation();
        event.preventDefault();
        setIsManageModalOpen(true);
        setFocusedToken(token);
    }, []);

    const handleShare = useCallback((event, token) => {
        event.stopPropagation();
        event.preventDefault();
        setIsShareModalOpen(true);
        setFocusedToken(token);
    }, []);

    const handleModalClose = useCallback(() => {
        setIsMintModalOpen(false);
        setIsShareModalOpen(false);
        setIsManageModalOpen(false);
        setFocusedToken(null);
    }, []);


    return {
        isMintModalOpen,
        isShareModalOpen,
        isManageModalOpen,
        focusedToken,
        setIsMintModalOpen,
        setIsShareModalOpen,
        setIsManageModalOpen,
        setFocusedToken,
        handleMint,
        handleManage,
        handleShare,
        handleModalClose

    }
}


export const RenderV2Tokens = ({ spaceName, contractId }: { spaceName: string, contractId: ContractID }) => {
    const { data: onchainPages, setSize: setOnchainSize } = usePaginatedFinitePosts(contractId);
    const { channel } = useChannel(contractId);
    const { ref: loadMoreRef, inView } = useInView({ threshold: 0.1 });

    const { isMintModalOpen,
        isShareModalOpen,
        isManageModalOpen,
        focusedToken,
        setIsMintModalOpen,
        setIsShareModalOpen,
        setIsManageModalOpen,
        setFocusedToken,
        handleMint,
        handleManage,
        handleShare,
        handleModalClose
    } = useTokenModalControls(contractId);

    // Flatten the token lists and memoize the result
    const flatTokens = useMemo(() => {
        return onchainPages?.flatMap(page => page.data) || [];
    }, [onchainPages]);

    const hasNextPage = onchainPages && onchainPages.at(-1).pageInfo.hasNextPage

    useEffect(() => {
        if (inView) {
            if (hasNextPage) {
                setOnchainSize((prev) => prev + 1)
            }
        }
    }, [inView, setOnchainSize, hasNextPage])


    if (!onchainPages) return <PostSkeleton />


    return (

        <div className="flex flex-col gap-8">
            <div className="w-10/12 sm:w-full m-auto grid gap-4 xl:gap-8 submission-columns auto-rows-fr ">
                <MapTokens
                    tokens={flatTokens}
                    channel={channel}
                    spaceName={spaceName}
                    contractId={contractId}
                    handleMint={handleMint}
                    //  handleShare={handleShare}
                    handleManage={handleManage}
                />

            </div>
            <TokenModal
                spaceName={spaceName}
                contractId={contractId}
                channel={channel}
                isMintModalOpen={isMintModalOpen}
                isShareModalOpen={isShareModalOpen}
                isManageModalOpen={isManageModalOpen}
                focusedToken={focusedToken}
                setIsMintModalOpen={setIsMintModalOpen}
                setIsShareModalOpen={setIsShareModalOpen}
                setIsManageModalOpen={setIsManageModalOpen}
                setFocusedToken={setFocusedToken}
                handleModalClose={handleModalClose}
            />
            <div ref={loadMoreRef} className="m-auto" >
                {hasNextPage && (
                    <div
                        className="m-auto text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                    />
                )}
            </div>

        </div >
    )
}



export const TokenModal = ({
    spaceName,
    contractId,
    channel,
    isMintModalOpen,
    isShareModalOpen,
    isManageModalOpen,
    focusedToken,
    setIsMintModalOpen,
    setIsShareModalOpen,
    setIsManageModalOpen,
    setFocusedToken,
    handleModalClose
}: {
    spaceName: string,
    contractId: ContractID,
    channel: Channel,
    isMintModalOpen: boolean,
    isShareModalOpen: boolean,
    isManageModalOpen: boolean,
    focusedToken: ChannelToken | ChannelTokenV1 | ChannelTokenIntent,
    setIsMintModalOpen: (value: boolean) => void,
    setIsShareModalOpen: (value: boolean) => void,
    setIsManageModalOpen: (value: boolean) => void,
    setFocusedToken: (value: ChannelToken | ChannelTokenV1) => void,
    handleModalClose: () => void
}) => {

    const { contractAddress, chainId } = useMemo(() => splitContractID(contractId), [contractId]);

    return (
        <SubmissionModal isModalOpen={isMintModalOpen || isShareModalOpen || isManageModalOpen} mode={isMintModalOpen ? "mint" : isManageModalOpen ? "manage" : "share"} handleClose={handleModalClose} >
            {isMintModalOpen && focusedToken && (
                <MintTokenSwitch
                    contractAddress={contractAddress}
                    channel={channel}
                    token={focusedToken}
                    setIsModalOpen={setIsMintModalOpen}
                    referral=""
                    display="contest-modal"
                />
            )}
            {isManageModalOpen && focusedToken && !isTokenV1Onchain(focusedToken) && (
                <ManageModalContent
                    token={focusedToken as ChannelToken | ChannelTokenIntent}
                    contractId={contractId}
                    handleClose={handleModalClose}
                />
            )}
        </SubmissionModal>
    )
}

"use client"
import { Channel, ChannelToken, ChannelTokenIntent, ChannelTokenV1, ChannelUpgradePath, ContractID, isTokenV1Onchain, splitContractID } from "@/types/channel";
import { usePaginatedMintBoardIntents, usePaginatedMintBoardPosts, usePaginatedMintBoardPostsV1, usePaginatedPopularTokens } from "@/hooks/useTokens";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardFooter } from "@/ui/Token/Card";
import SubmissionModal from "@/ui/Submission/SubmissionModal";
import { MintTokenSwitch } from "@/ui/Token/MintToken";
import { useInView } from "react-intersection-observer";
import { ManageModalContent, ShareModalContent } from "@/ui/Token/MintUtils";
import { useChannel } from "@/hooks/useChannel";

import RenderIfVisible from "@/ui/Virtualization/RenderIfVisible";
import { Admin } from "@/types/space";
import Modal from "@/ui/Modal/Modal";
import Image from "next/image";
import OnchainButton from "@/ui/OnchainButton/OnchainButton";
import { TbLoader2 } from "react-icons/tb";
import { useUpgradeChannel } from "@tx-kit/hooks";
import toast from "react-hot-toast";
import useSWR from "swr";
import { Address } from "viem";
import { HiCheckBadge } from "react-icons/hi2";
import { handleV2Error } from "@/lib/fetch/handleV2Errors";
import { useMonitorChannelUpgrades } from "@/hooks/useMonitorChannelUpgrades";
import { ColorCards } from "@/ui/DesignKit/ColorCards";
import { parseIpfsUrl } from "@/lib/ipfs";


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



const MapTokens = React.memo(({
    tokens,
    channel,
    spaceName,
    contractId,
    handleMint,
    //handleShare,
    handleManage
}: {
    tokens: Array<ChannelToken | ChannelTokenV1 | ChannelTokenIntent>,
    channel: Channel,
    spaceName: string,
    contractId: ContractID,
    handleMint: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void,
    // handleShare: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void,
    handleManage: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void
}) => {

    return tokens.map((token, index) => {
        return (
            <RenderIfVisible
                key={index}
                defaultHeight={400}
                visibleOffset={200}
                stayRendered={false}

            >
                <div
                    className="cursor-pointer shadow-lg shadow-black hover:shadow-[#262626] no-select rounded-lg"
                    onClick={(event) => handleMint(event, token)}
                >
                    <ColorCards imageUrl={parseIpfsUrl(token.metadata.image).gateway}>
                        <Card
                            key={index}
                            token={token}
                            footer={
                                <CardFooter
                                    token={token}
                                    channel={channel}
                                    spaceName={spaceName}
                                    contractId={contractId}
                                    handleMint={handleMint}
                                    //handleShare={handleShare}
                                    handleManage={handleManage}
                                />
                            }
                        />
                    </ColorCards>
                </div>
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
    const { data: onchainPages, setSize: setOnchainSize } = usePaginatedMintBoardPosts(contractId);
    const { data: onchainPagesV1, setSize: setOnchainSizeV1 } = usePaginatedMintBoardPostsV1(contractId);
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
        const flatTokensV2 = onchainPages?.flatMap(page => page.data) || [];
        const flatTokensV1 = onchainPagesV1?.flatMap(page => page.data) || [];
        return [...flatTokensV2, ...flatTokensV1];
    }, [onchainPages, onchainPagesV1]);

    const v2HasNextPage = onchainPages && onchainPages.at(-1).pageInfo.hasNextPage
    const v1HasNextPage = onchainPagesV1 && onchainPagesV1.at(-1).pageInfo.hasNextPage
    const hasNextPage = v2HasNextPage || v1HasNextPage

    useEffect(() => {
        if (inView) {
            if (v2HasNextPage) {
                setOnchainSize((prev) => prev + 1)
            } else {
                setOnchainSizeV1((prev) => prev + 1)
            }

        }
    }, [inView, setOnchainSize, v2HasNextPage, setOnchainSizeV1])


    if (!onchainPages || !onchainPagesV1) return <PostSkeleton />

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

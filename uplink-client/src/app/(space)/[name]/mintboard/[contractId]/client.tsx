"use client"
import { Channel, ChannelToken, ChannelTokenIntent, ChannelTokenV1, ContractID, isTokenV1Onchain, splitContractID } from "@/types/channel";
import { usePaginatedMintBoardIntents, usePaginatedMintBoardPosts, usePaginatedMintBoardPostsV1, usePaginatedPopularTokens } from "@/hooks/useTokens";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardFooter } from "@/ui/Token/Card";
import SubmissionModal from "@/ui/Submission/SubmissionModal";
import { MintTokenSwitch } from "@/ui/Token/MintToken";
import { useInView } from "react-intersection-observer";
import { ManageModalContent, ShareModalContent } from "@/ui/Token/MintUtils";
import { useChannel } from "@/hooks/useChannel";

import RenderIfVisible from "@/ui/VIrtualization/RenderIfVisible";
import { Admin } from "@/types/space";


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
    handleShare,
    handleManage
}: {
    tokens: Array<ChannelToken | ChannelTokenV1 | ChannelTokenIntent>,
    channel: Channel,
    spaceName: string,
    contractId: ContractID,
    handleMint: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void,
    handleShare: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void,
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
                                handleShare={handleShare}
                                handleManage={handleManage}
                            />
                        }
                    />
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


export const RenderDefaultTokens = ({ spaceName, contractId }: { spaceName: string, contractId: ContractID }) => {
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
                    handleShare={handleShare}
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


export const RenderTokenIntents = ({ spaceName, contractId }: { spaceName: string, contractId: ContractID }) => {
    const { data: tokenIntents, setSize: setIntentSize } = usePaginatedMintBoardIntents(contractId);
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

    const hasNextPage = tokenIntents && tokenIntents.at(-1).pageInfo.hasNextPage

    useEffect(() => {
        if (inView) {
            if (hasNextPage) {
                setIntentSize((prev) => prev + 1)
            }

        }
    }, [inView, setIntentSize, tokenIntents, hasNextPage])


    // Flatten the token lists and memoize the result
    const flatTokens = useMemo(() => {
        return tokenIntents?.flatMap(page => page.data) || []
    }, [tokenIntents]);


    if (!tokenIntents) return <PostSkeleton />

    return (

        <div className="flex flex-col gap-8">
            <div className="w-10/12 sm:w-full m-auto grid gap-4 xl:gap-8 submission-columns auto-rows-fr ">

                <MapTokens
                    tokens={flatTokens}
                    channel={channel}
                    spaceName={spaceName}
                    contractId={contractId}
                    handleMint={handleMint}
                    handleShare={handleShare}
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
        </div>
    )
}

export const RenderPopularTokens = ({ spaceName, contractId }: { spaceName: string, contractId: ContractID }) => {
    const { data: popularTokens, setSize: setPopularSize } = usePaginatedPopularTokens(contractId);
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



    useEffect(() => {
        if (inView) {
            const hasNextPage = popularTokens && popularTokens.at(-1).pageInfo.hasNextPage
            if (hasNextPage) {
                setPopularSize((prev) => prev + 1)
            }

        }
    }, [inView, setPopularSize])

    // Flatten the token lists and memoize the result
    const flatTokens = useMemo(() => {
        return popularTokens?.flatMap(page => page.data) || [];
    }, [popularTokens]);


    if (!popularTokens) return <PostSkeleton />

    return (

        <div className="flex flex-col gap-8">
            <div className="w-10/12 sm:w-full m-auto grid gap-4 xl:gap-8 submission-columns auto-rows-fr ">

                <MapTokens
                    tokens={flatTokens}
                    channel={channel}
                    spaceName={spaceName}
                    contractId={contractId}
                    handleMint={handleMint}
                    handleShare={handleShare}
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
            <div ref={loadMoreRef} className="m-auto" />
        </div>
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
                    display="modal"
                />
            )}
            {isShareModalOpen && focusedToken && (
                <ShareModalContent spaceName={spaceName} contractId={contractId} token={focusedToken} handleClose={handleModalClose} />
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















// export const RenderTokens = ({ spaceName, contractId, tab }: { spaceName: string, contractId: ContractID, tab: "default" | "popular" | "intent" }) => {
//     console.log("re rendering")
//     const { data: onchainPages, setSize: setOnchainSize } = usePaginatedMintBoardPosts(contractId);
//     const { data: onchainPagesV1, setSize: setOnchainSizeV1 } = usePaginatedMintBoardPostsV1(contractId);
//     const { data: intentPages, setSize: setIntentSize } = usePaginatedMintBoardIntents(contractId);
//     const { data: popularPages, setSize: setPopularSize } = usePaginatedPopularTokens(contractId)
//     const { channel } = useChannel(contractId)

//     const [isMintModalOpen, setIsMintModalOpen] = useState(false);
//     const [isShareModalOpen, setIsShareModalOpen] = useState(false);
//     const [isManageModalOpen, setIsManageModalOpen] = useState(false);
//     const [focusedToken, setFocusedToken] = useState(null);
//     const { ref: loadMoreRef, inView, entry } = useInView({ threshold: 0.1 })

//     const { contractAddress, chainId } = useMemo(() => splitContractID(contractId), [contractId]);

//     useEffect(() => {
//         if (inView) {
//             if (tab === "default") {
//                 const v2HasNextPage = onchainPages && onchainPages.at(-1).pageInfo.hasNextPage
//                 if (v2HasNextPage) {
//                     setOnchainSize((prev) => prev + 1)
//                 } else {
//                     setOnchainSizeV1((prev) => prev + 1)
//                 }
//             }
//             if (tab === "intent") {
//                 setIntentSize((prev) => prev + 1)
//             }
//         }
//     }, [inView, setOnchainSize, setIntentSize, tab])


// const handleMint = useCallback((event, token) => {
//     event.stopPropagation();
//     event.preventDefault();
//     setIsMintModalOpen(true);
//     setFocusedToken(token);
// }, []);

// const handleManage = useCallback((event, token) => {
//     event.stopPropagation();
//     event.preventDefault();
//     setIsManageModalOpen(true);
//     setFocusedToken(token);
// }, []);

// const handleShare = useCallback((event, token) => {
//     event.stopPropagation();
//     event.preventDefault();
//     setIsShareModalOpen(true);
//     setFocusedToken(token);
// }, []);

// const handleModalClose = useCallback(() => {
//     setIsMintModalOpen(false);
//     setIsShareModalOpen(false);
//     setIsManageModalOpen(false);
//     setFocusedToken(null);
// }, []);

//     if (tab === "default" && !onchainPages || !onchainPagesV1) return <PostSkeleton />
//     if (tab === "intent" && !intentPages) return <PostSkeleton />
//     if (tab === "popular" && !popularPages) return <PostSkeleton />

//     return (
//         <div className="flex flex-col gap-8">
//             <div className="w-10/12 sm:w-full m-auto grid gap-4 xl:gap-8 submission-columns auto-rows-fr ">

//                 {tab === "default" &&
//                     <React.Fragment>
//                         <MapPages pages={onchainPages} spaceName={spaceName} contractId={contractId} handleMint={handleMint} handleShare={handleShare} handleManage={handleManage} />
//                         <MapPages pages={onchainPagesV1} spaceName={spaceName} contractId={contractId} handleMint={handleMint} handleShare={handleShare} handleManage={handleManage} />
//                     </React.Fragment>
//                 }

//                 {tab === "intent" && (intentPages[0].data.length > 0
//                     ? <MapPages pages={intentPages} spaceName={spaceName} contractId={contractId} handleMint={handleMint} handleShare={handleShare} handleManage={handleManage} />
//                     : <React.Fragment>
//                         <div className="bg-base-100 rounded-lg h-[250px] flex flex-col gap-6 w-full justify-center items-center">
//                             <h1 className="text-t1 text-2xl">Introducing intents</h1>
//                         </div>
//                         <div className="flex w-full justify-center items-center">
//                             <h1 className="text-t1 text-2xl">Intents allow users to post on the mintboard completely free, without gas.</h1>
//                         </div>
//                         <div className="bg-base-100 rounded-lg h-[250px] flex flex-col gap-6 w-full justify-center items-center">
//                             <h1 className="text-t1 text-2xl">Intents will show up here. </h1>
//                         </div>
//                         <div className="flex w-full justify-center items-center">
//                             <h1 className="text-t1 text-2xl">Sponsor them onchain to earn a reward on each mint</h1>
//                         </div>
//                     </React.Fragment>
//                 )}

//                 {tab === "popular" && <MapPages pages={popularPages} spaceName={spaceName} contractId={contractId} handleMint={handleMint} handleShare={handleShare} handleManage={handleManage} />}

//                 <SubmissionModal isModalOpen={isMintModalOpen || isShareModalOpen || isManageModalOpen} mode={isMintModalOpen ? "mint" : isManageModalOpen ? "manage" : "share"} handleClose={handleModalClose} >
//                     {isMintModalOpen && focusedToken && (
//                         <MintTokenSwitch
//                             contractAddress={contractAddress}
//                             channel={channel}
//                             token={focusedToken}
//                             setIsModalOpen={setIsMintModalOpen}
//                             referral=""
//                             display="modal"
//                         />
//                     )}
//                     {isShareModalOpen && focusedToken && (
//                         <ShareModalContent spaceName={spaceName} contractId={contractId} token={focusedToken} handleClose={handleModalClose} />
//                     )}

//                     {isManageModalOpen && focusedToken && !isTokenV1Onchain(focusedToken) && (
//                         <ManageModalContent
//                             token={focusedToken}
//                             contractId={contractId}
//                             handleClose={handleModalClose}
//                         />
//                     )}
//                 </SubmissionModal>
//             </div>
//             <div ref={loadMoreRef} className="m-auto" />
//         </div>
//     )
// }

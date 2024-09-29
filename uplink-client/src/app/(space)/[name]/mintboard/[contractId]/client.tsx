"use client";
import {
    Channel,
    ChannelToken,
    ChannelTokenIntent,
    ChannelTokenV1,
    ContractID,
    isTokenV1Onchain,
    splitContractID,
} from "@/types/channel";
import { usePaginatedMintBoardIntents, usePaginatedMintBoardPosts, usePaginatedMintBoardPostsV1, usePaginatedPopularTokens } from "@/hooks/useTokens";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TokenCard, TokenCardFooter } from "@/ui/Token/Card";
import { MintTokenSwitch } from "@/ui/Token/MintToken";
import { useInView } from "react-intersection-observer";
import { ManageModalContent } from "@/ui/Token/MintUtils";
import { useChannel } from "@/hooks/useChannel";
import RenderIfVisible from "@/ui/Virtualization/RenderIfVisible";
import { Modal } from "@/ui/Modal/Modal";
import OnchainButton from "@/ui/OnchainButton/OnchainButton";
import { TbLoader2 } from "react-icons/tb";
import { useUpgradeChannel } from "@tx-kit/hooks";
import toast from "react-hot-toast";
import { Address, formatEther, formatUnits } from "viem";
import { HiCheckBadge } from "react-icons/hi2";
import { useMonitorChannelUpgrades } from "@/hooks/useMonitorChannelUpgrades";
import { ColorCards } from "@/ui/DesignKit/ColorCards";
import { parseIpfsUrl } from "@/lib/ipfs";
import { Button } from "@/ui/DesignKit/Button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/ui/DesignKit/Dialog";
import { Bar, BarChart, CartesianGrid, Cell, Label, Pie, PieChart, PolarRadiusAxis, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/ui/DesignKit/Chart';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/ui/DesignKit/Card";
import { CardHeader } from "@/ui/DesignKit/Card";
import { crimsonDark } from '@radix-ui/colors'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/DesignKit/Tooltip";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { ChainId } from "@/types/chains";
import formatOrdinals from "@/lib/formatOrdinals";

const compact_formatter = new Intl.NumberFormat('en', { notation: 'compact' })

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


export const MintFeeDonut = ({ channelFees, chainId, spaceName }: { channelFees: Channel["fees"], chainId: ChainId, spaceName: string }) => {

    const normalizeRecipient = (recipient: string) => {
        return recipient
            .toLowerCase()
            .replace(/\s+/g, ''); // Lowercase and remove spaces to match keys in chartConfig
    };

    const { symbol, decimals } = useTokenInfo(channelFees.fees.erc20Contract, chainId)

    const chartData = [
        { recipient: "Creator", percentage: channelFees.fees.creatorPercentage, fill: crimsonDark.crimson12 },
        { recipient: "Referral", percentage: channelFees.fees.mintReferralPercentage, fill: crimsonDark.crimson11 },
        { recipient: "Sponsor", percentage: channelFees.fees.sponsorPercentage, fill: crimsonDark.crimson10 },
        { recipient: "Protocol", percentage: channelFees.fees.uplinkPercentage, fill: crimsonDark.crimson9 },
        { recipient: spaceName, percentage: channelFees.fees.channelPercentage, fill: crimsonDark.crimson8 },
    ];

    const formatErc20Amount = (amount: bigint) => {
        return formatUnits(amount, decimals)
    }


    return (
        <Card className="bg-base-100 p-2 lg:p-4">
            <CardHeader className="p-2">
                <CardTitle>Mint fee splits</CardTitle>
                <CardDescription className="text-t2">
                    {formatEther(channelFees.fees.ethMintPrice)} ETH
                    {symbol ? ` / ${formatErc20Amount(channelFees.fees.erc20MintPrice)} ${symbol}` : null}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-2">

                <div className="flex items-center gap-2 w-[500px] max-w-full">
                    {chartData.map((el, idx) => (
                        el.percentage > 0 && (
                            <TooltipProvider delayDuration={200} key={idx}>
                                <div
                                    className="h-6 md:h-12"
                                    style={{
                                        width: `${el.percentage * 5}px`,  // Dynamically set width based on percentage
                                        backgroundColor: el.fill,  // Use the fill color from your data
                                    }}
                                >
                                    <Tooltip key={idx}>
                                        <TooltipTrigger className="w-full h-full">
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="bg-base-300 border border-border rounded-lg p-4 font-bold">
                                                <p>{el.recipient}: {el.percentage}%</p>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </TooltipProvider>
                        )
                    ))}
                </div>
            </CardContent>
            <CardFooter className="p-2">

                <div className="flex items-center flex-wrap gap-2">
                    {chartData.map((el, idx) => {
                        return (
                            <div key={idx} className="flex items-center gap-1">
                                <div
                                    className="h-3 w-3"
                                    style={{ backgroundColor: el.fill }}
                                />
                                <p className="text-xs">{el.recipient}</p>
                            </div>
                        );
                    })}
                </div>
            </CardFooter>
        </Card>
    );

};

export const ChannelUpgrades = ({ contractId }: { contractId: ContractID }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { upgradeChannel, txHash, status, error } = useUpgradeChannel();
    const { chainId, contractAddress } = splitContractID(contractId)
    const { upgradePath, isLoading, mutate } = useMonitorChannelUpgrades(contractId);

    useEffect(() => {
        if (status === "complete") {
            toast.success("Upgrade successful")
            setIsModalOpen(false)
            mutate()
        }
    }, [status])

    useEffect(() => {
        console.log(error)
    }, [error])

    const handleSubmit = async () => {
        await upgradeChannel({
            channelAddress: contractAddress as Address,
            newImplementation: upgradePath.upgradeImpl as Address
        });

    }

    const UpgradeStatus = ({ isLoading, upgradePath }) => {

        if (isLoading) return (
            <div className="flex justify-between items-center">
                <p className="text-t1">Checking for contract upgrades</p>
                <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
            </div>
        )

        else if (!upgradePath && !isLoading) return (
            <div className="flex justify-between items-center">
                <p className="text-t1">Upgrade status</p>
                <span className="flex gap-1 items-center"><p>up to date</p><HiCheckBadge className="text-success h-5 w-5" /></span>
            </div>
        )

        else if (upgradePath && !isLoading) return (
            <div className="flex justify-between items-center">
                <p className="text-t1">An upgrade is available!</p>
                <Button size="sm" onClick={() => setIsModalOpen(true)}>Upgrade</Button>
            </div>
        )

        return null;
    }

    return (
        <div className="">
            <UpgradeStatus isLoading={isLoading} upgradePath={upgradePath} />
            {isModalOpen && (
                <Modal
                    isModalOpen={true}
                    onClose={() => { setIsModalOpen(false) }}
                    className="w-full max-w-[450px]"
                >
                    <DialogHeader>
                        <DialogTitle>
                            {`What's new?`}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4">
                        <h2 className="text-3xl text-t1 font-bold">
                            {"What's new?"}
                        </h2>
                        <div className="flex flex-col bg-base-200 gap-2 rounded-md p-2">
                            <p className="">An upgrade is available for improved coinbase smart wallet support.</p>
                            <p className="">Upgrading will make it easier and cheaper for your users to interact with the mintboard.</p>
                        </div>
                        <DialogFooter>
                            <div className="flex justify-between items-center">
                                <Button variant="ghost" className="w-fit" onClick={() => setIsModalOpen(false)}>Ignore</Button>
                                <div className="ml-auto">
                                    <OnchainButton
                                        chainId={chainId}
                                        title={"Upgrade"}
                                        onClick={handleSubmit}
                                        isLoading={status === 'pendingApproval' || status === 'txInProgress'}
                                        loadingChild={
                                            <Button disabled>
                                                <div className="flex gap-2 items-center">
                                                    <p className="text-sm">{
                                                        status === 'pendingApproval' ?
                                                            <span>Awaiting Signature</span>
                                                            :
                                                            <span>Processing</span>
                                                    }
                                                    </p>
                                                    <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                                                </div>
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>
                        </DialogFooter>
                    </div>
                </Modal >
            )}
        </div>
    )
}

const MapTokens = React.memo(({
    tokens,
    channel,
    spaceName,
    contractId,
    handleMint,
    handleManage
}: {
    tokens: Array<ChannelToken | ChannelTokenV1 | ChannelTokenIntent>,
    channel: Channel,
    spaceName: string,
    contractId: ContractID,
    handleMint: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void,
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
                        <TokenCard
                            key={index}
                            token={token}
                            footer={
                                <TokenCardFooter
                                    token={token}
                                    channel={channel}
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


export const WhatsNew = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const hasVisited = localStorage.getItem("mintboard-whatsnew");
        if (hasVisited) return;
        else {
            setIsModalOpen(true)
            localStorage.setItem("mintboard-whatsnew", "true")
        }
    }, [])


    if (isModalOpen) return (
        <Modal isModalOpen={true} onClose={() => { setIsModalOpen(false) }} className="w-full max-w-[450px]">
            <DialogHeader>
                <DialogTitle>
                    {`What's new?`}
                </DialogTitle>
                <DialogDescription>
                    Intents
                </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col bg-base-200 gap-2 rounded-md p-2">
                    <p className="text-lg">Intents are posts awaiting onchain sponsorship.</p>
                    <p className="text-lg">Be the first to mint any of these posts to bring them onchain.</p>
                    <p className="text-lg">{"In exchange, you'll receive a small reward on every future mint."}</p>
                </div>
            </div>
            <DialogFooter>
                <Button className="ml-auto w-fit" onClick={() => setIsModalOpen(false)}>Got it</Button>
            </DialogFooter>
        </Modal >
    )
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
                    // handleShare={handleShare}
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
                    // handleShare={handleShare}
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
        <Modal isModalOpen={isMintModalOpen || isShareModalOpen || isManageModalOpen} onClose={handleModalClose} className={`w-full overflow-y-auto ${isMintModalOpen ? 'max-w-[800px]' : 'max-w-[400px]'}`}>
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

            {isManageModalOpen && focusedToken && !isTokenV1Onchain(focusedToken) && (
                <ManageModalContent
                    token={focusedToken as ChannelToken | ChannelTokenIntent}
                    contractId={contractId}
                    handleClose={handleModalClose}
                />
            )}
        </Modal>
    )
}


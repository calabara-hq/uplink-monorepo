"use client";;
import { useDebounce } from "@/hooks/useDebounce";
import React, { useEffect, useState } from "react";
import { ChainLabel } from "../ChainLabel/ChainLabel";
import { HiCheckBadge } from "react-icons/hi2";
import { useAccount } from "wagmi";
import { getChainName } from "@/lib/chains/supportedChains";
import OnchainButton from "../OnchainButton/OnchainButton";
import { Address, formatEther, formatUnits, maxUint40, zeroAddress } from "viem";
import { format } from "date-fns";
import { TbLoader2 } from "react-icons/tb";
import { CounterInput, FeeStructure, getETHMintPrice, RenderFees, RenderMaxSupply, RenderMintMedia, RenderTotalMints, ShareButton } from "./MintUtils";
import { Boundary } from "../Boundary/Boundary";
import { AddressOrEns, Avatar } from "../AddressDisplay/AddressDisplay";
import { NATIVE_TOKEN } from "@tx-kit/sdk";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { useEthBalance, useErc20Balance } from "@/hooks/useTokenBalance";
import { HiArrowNarrowLeft } from "react-icons/hi";
import Link from "next/link";
import { useCapabilities } from 'wagmi/experimental'
import { useRouter } from "next/navigation";
import { ChannelToken, ChannelTokenIntent, ChannelTokenV1, concatContractID } from "@/types/channel";
import { useVoteCart } from "@/hooks/useVoteCart";
import { Button } from "../DesignKit/Button";
import { RenderMarkdown } from "../Markdown/RenderMarkdown";
import { VoteOrOpenDrawer } from "../ChannelSidebar/VoteCart";
import { ChainId } from "@/types/chains";
import { Modal } from "../Modal/Modal";

export type DisplayMode = "modal" | "expanded" | "contest-modal" | "contest-expanded"

export type DisplayProps = {
    token: ChannelTokenV1 | ChannelToken | ChannelTokenIntent,
    chainId: ChainId,
    creator: string,
    metadata: any, // todo type this
    fees: FeeStructure | null,
    mintToken: Address,
    setMintToken: (currency: Address) => void,
    isMintPeriodOver: boolean,
    saleEnd: number,
    totalMinted: string,
    maxSupply: string,
    handleSubmit: (quantity: number, mintToken: Address) => void,
    isTxPending: boolean,
    isTxSuccessful: boolean,
    txHash: string,
    txStatus: string,
    setIsModalOpen?: (open: boolean) => void
    handleShare: () => void
    backwardsNavUrl?: string
}


export const RenderDisplayWithProps = (props: DisplayProps & { displayMode: DisplayMode }) => {
    if (props.displayMode === "modal") return <MintModalDisplay {...props} />
    else if (props.displayMode === "expanded") return <MintExpandedDisplay {...props} />
    else if (props.displayMode === "contest-modal") return <MintContestDisplay {...props} />
    else if (props.displayMode === "contest-expanded") return <ContestExpandedDisplay {...props} />

    return null
}


const LinkRenderer = (props: any) => {
    return (
        <a href={props.href} target="_blank" rel="noopener noreferrer" className="no-underline text-primary12 hover:underline">
            {props.children}
        </a>
    )
}


export const MintContestDisplay = ({ token,
    chainId,
    creator,
    metadata,
    fees,
    mintToken,
    setMintToken,
    isMintPeriodOver,
    saleEnd,
    totalMinted,
    maxSupply,
    handleSubmit,
    isTxPending,
    isTxSuccessful,
    txHash,
    txStatus,
    setIsModalOpen,
    handleShare
}: DisplayProps) => {

    return null;

    // return (
    //     <React.Fragment>
    //         <div className="flex flex-col gap-2 relative">
    //             <div className="grid grid-cols-[85%_15%] items-start">
    //                 <p className="line-clamp-3 font-bold text-lg break-words ">{metadata.name}</p>
    //                 <Button variant="ghost" className="ml-auto" onClick={() => setIsModalOpen(false)}><MdOutlineCancelPresentation className="w-6 h-6 text-t2" /></Button>
    //             </div>
    //             <div className="flex flex-col gap-4 bg-black ">
    //                 <div className="flex gap-2 items-center">
    //                     <div className="flex gap-2 items-center text-sm text-t2 bg-base rounded-lg p-1 w-fit">
    //                         <Avatar address={creator} size={28} />
    //                         <AddressOrEns address={creator} />
    //                     </div>
    //                     <button className="btn btn-warning bg-opacity-40 text-warning btn-sm normal-case">Share</button>
    //                     <button className="btn btn-warning bg-opacity-40 text-warning btn-sm normal-case">Vote</button>
    //                 </div>
    //                 <div className="flex items-center justify-center rounded-lg p-1 relative w-full  m-auto">
    //                     <RenderMintMedia imageURI={metadata.image || ""} animationURI={metadata.animation || ""} />
    //                 </div>

    //                 <div className="prose">
    //                     <RenderMarkdown content={metadata.description} />
    //                 </div>
    //             </div>
    //         </div>

    //         {/* <div className="absolute w-[400px] h-[400px] right-0 top-0 bg-green-200">hey</div> */}
    //     </React.Fragment>
    // )
}



export const ContestExpandedDisplay = ({
    token,
    chainId,
    creator,
    metadata,
    fees,
    mintToken,
    setMintToken,
    isMintPeriodOver,
    saleEnd,
    totalMinted,
    maxSupply,
    handleSubmit,
    isTxPending,
    isTxSuccessful,
    txHash,
    txStatus,
    backwardsNavUrl,
    handleShare
}: DisplayProps) => {

    const contractId = concatContractID({ contractAddress: token.channelAddress, chainId })
    const { proposedVotes, addProposedVote, isTokenAlreadyProposed } = useVoteCart(contractId)

    const handleAddToList = () => {
        addProposedVote(token as ChannelToken)
    }

    return (
        <div className="flex flex-col gap-4 w-full max-w-[65ch]">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col w-full gap-2">
                    <p className="font-bold text-4xl break-words">{metadata.name}</p>
                    <div className="flex gap-2 items-center">
                        <div className="flex gap-2 items-center text-sm text-t2 bg-base-100 rounded-lg p-1 w-fit">
                            <Avatar address={creator} size={28} />
                            <AddressOrEns address={creator} />
                        </div>
                        <Button variant="outline" className="ml-auto" onClick={handleShare}>Share</Button>
                        <VoteOrOpenDrawer contractId={contractId}>
                            <Button variant="secondary" onClick={handleAddToList}>Vote</Button>
                        </VoteOrOpenDrawer>
                    </div>
                    <div className="w-full h-0.5 bg-base-100 rounded-lg" />
                    <div className="flex items-center justify-center rounded-lg p-1 w-full m-auto">
                        <RenderMintMedia imageURI={metadata.image || ""} animationURI={metadata.animation || ""} />
                    </div>
                    <RenderMarkdown content={metadata.description} />
                </div>
            </div>

        </div>
    )
}

export const MintModalDisplay = ({
    token,
    chainId,
    creator,
    metadata,
    fees,
    mintToken,
    setMintToken,
    isMintPeriodOver,
    saleEnd,
    totalMinted,
    maxSupply,
    handleSubmit,
    isTxPending,
    isTxSuccessful,
    txHash,
    txStatus,
    setIsModalOpen,
    handleShare
}: DisplayProps) => {

    const [mintQuantity, setMintQuantity] = useState<string>('1');
    const debouncedMintQuantity = useDebounce(mintQuantity);

    const availableEditions = BigInt(maxSupply) - BigInt(totalMinted);
    const areEditionsSoldOut = availableEditions <= 0;
    const [isMintFlowModalOpen, setIsMintFlowModalOpen] = useState(false);

    const handleButtonClick = () => {
        if ((fees?.erc20Contract ?? zeroAddress) === zeroAddress) {
            handleSubmit(parseInt(debouncedMintQuantity), mintToken)
            setIsMintFlowModalOpen(true)
        }
        else {
            setIsMintFlowModalOpen(true)
        }
    }


    return (
        <React.Fragment>
            {!isMintFlowModalOpen && (
                <div className="flex flex-col gap-2 relative">
                    <div className="p-2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-center justify-center rounded-lg p-1 ">
                            <RenderMintMedia imageURI={metadata.image || ""} animationURI={metadata.animation || ""} />
                        </div>
                        <div className="items-start flex flex-col gap-8 relative">
                            <div className="flex flex-col gap-2">
                                <p className="line-clamp-3 font-bold text-lg break-words">{metadata.name}</p>
                                <div className="flex gap-2 items-center">
                                    <div className="flex gap-2 items-center text-sm text-t2 bg-base-200 rounded-lg p-1 w-fit">
                                        <Avatar address={creator} size={28} />
                                        <AddressOrEns address={creator} />
                                    </div>

                                    <ShareButton displayMode="modal" token={token} onClick={handleShare} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="flex flex-col justify-start">
                                        <p className="text-t2">Network</p>
                                        <div className="flex gap-2 items-center">
                                            <p className="text-t1 font-bold">{getChainName(chainId)}</p>
                                            <ChainLabel chainId={chainId} px={16} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <p className="text-t2">{isMintPeriodOver ? "Ended" : "Until"}</p>
                                        <p className="font-bold text-t1">{saleEnd == Number(maxUint40) ? "Forever" : format(new Date(Number(saleEnd) * 1000), "MMM d, h:mm aa")}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-t2">Price</p>
                                        <p className="font-bold text-t1">{getETHMintPrice(fees ? fees.ethMintPrice : null)}</p>
                                    </div>
                                    <div className="flex flex-col justify-start">
                                        <p className="text-t2">Minted</p>
                                        <div className="flex gap-1">
                                            <RenderTotalMints totalMinted={totalMinted} />
                                            <p className="text-t1">/</p>
                                            <RenderMaxSupply maxSupply={maxSupply} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-1" />
                                <div className="w-full bg-base-100 h-[1px]" />

                                {!areEditionsSoldOut && !isMintPeriodOver &&
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col w-full ml-auto gap-2">
                                            <CounterInput count={mintQuantity} setCount={setMintQuantity} max={availableEditions.toString()} />
                                            <OnchainButton
                                                chainId={chainId}
                                                title={"Mint"}
                                                onClick={handleButtonClick}
                                                isLoading={false}
                                                loadingChild={<></>}
                                            />
                                        </div>
                                        <RenderFees fees={fees} quantity={debouncedMintQuantity} />
                                    </div>
                                }
                            </div>
                        </div>
                    </div >

                </div >
            )}
            <MintFlowModal
                isModalOpen={isMintFlowModalOpen}
                handleClose={() => setIsMintFlowModalOpen(false)}
                handleExitMint={() => setIsModalOpen(false)}
                flowProps={
                    {
                        fees: fees,
                        mintToken,
                        setMintToken,
                        erc20Contract: fees?.erc20Contract ?? zeroAddress,
                        debouncedMintQuantity,
                        handleSubmit,
                        chainId,
                        isTxPending,
                        isTxSuccessful,
                        txStatus,
                        txHash
                    }
                }
            />

        </React.Fragment>
    )
}


export const MintExpandedDisplay = ({
    token,
    chainId,
    creator,
    metadata,
    fees,
    mintToken,
    setMintToken,
    isMintPeriodOver,
    saleEnd,
    totalMinted,
    maxSupply,
    handleSubmit,
    isTxPending,
    isTxSuccessful,
    txHash,
    txStatus,
    backwardsNavUrl,
    handleShare
}: DisplayProps) => {

    const [mintQuantity, setMintQuantity] = useState<string>('1');
    const debouncedMintQuantity = useDebounce(mintQuantity);
    const router = useRouter();
    const availableEditions = BigInt(maxSupply) - BigInt(totalMinted);
    const areEditionsSoldOut = availableEditions <= 0;
    const [isMintFlowModalOpen, setIsMintFlowModalOpen] = useState(false);

    const handleButtonClick = () => {
        if ((fees?.erc20Contract ?? zeroAddress) === zeroAddress) {
            handleSubmit(parseInt(debouncedMintQuantity), mintToken)
            setIsMintFlowModalOpen(true)
        }
        else {
            setIsMintFlowModalOpen(true)
        }
    }

    return (
        <React.Fragment>
            <div className="flex flex-col gap-2 p-4 sm:p-0 ">
                <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6 w-full items-end">
                    <div className="flex flex-col gap-4 items-center justify-center flex-grow-0 m-auto w-full">
                        <RenderMintMedia imageURI={metadata.image || ""} animationURI={metadata.animation || ""} size="lg" />
                    </div>
                    <div className="flex flex-col gap-8 justify-start h-fit">
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex flex-col gap-2">
                                <p className="font-bold text-2xl break-words">{metadata.name}</p>
                                <div className="flex gap-2 items-center">
                                    <div className="flex gap-2 items-center text-sm text-t2 rounded-lg p-1 w-fit">
                                        <Avatar address={creator} size={32} />
                                        <AddressOrEns address={creator} />
                                    </div>
                                    <ShareButton displayMode="expanded" token={token} onClick={handleShare} className="h-8 p-2 border-none" />
                                </div>
                            </div>
                            {/* <div className="grid grid-cols-3 gap-2">
                                <div className="flex flex-col justify-start">
                                    <p className="text-t2">Network</p>
                                    <div className="flex gap-2 items-center">
                                        <p className="text-t1 font-bold">{getChainName(chainId)}</p>
                                        <ChainLabel chainId={chainId} px={16} />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-t2">{isMintPeriodOver ? "Ended" : "Until"}</p>
                                    <p className="font-bold text-t1">{saleEnd == Number(maxUint40) ? "Forever" : format(new Date(Number(saleEnd) * 1000), "MMM d, h:mm aa")}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-t2">Price</p>
                                    <p className="font-bold text-t1">{getETHMintPrice(fees ? fees.ethMintPrice : null)}</p>
                                </div>
                                <div className="flex flex-col justify-start">
                                    <p className="text-t2">Collected</p>
                                    <div className="flex gap-1">
                                        <RenderTotalMints totalMinted={totalMinted} />
                                        <p className="text-t1">/</p>
                                        <RenderMaxSupply maxSupply={maxSupply} />
                                    </div>
                                </div>
                            </div> */}
                            {!areEditionsSoldOut && !isMintPeriodOver &&
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="grid grid-cols-1 gap-2 w-full justify-between">
                                        <CounterInput count={mintQuantity} setCount={setMintQuantity} max={availableEditions.toString()} />
                                        <OnchainButton
                                            chainId={chainId}
                                            disabled={parseInt(mintQuantity) <= 0 || mintQuantity === "" || parseInt(mintQuantity) > availableEditions}
                                            title={"Mint"}
                                            onClick={handleButtonClick}
                                            isLoading={isTxPending}
                                            loadingChild={
                                                <Button disabled className="w-auto">
                                                    <div className="flex gap-2 items-center">
                                                        <p className="text-sm">{
                                                            txStatus === 'pendingApproval' ?
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
                                    <RenderFees fees={fees} quantity={debouncedMintQuantity} />
                                </div>
                            }
                        </div>
                    </div>
                </div >
            </div>

            <MintFlowModal
                isModalOpen={isMintFlowModalOpen}
                handleClose={() => setIsMintFlowModalOpen(false)}
                handleExitMint={() => router.push(backwardsNavUrl)}
                flowProps={
                    {
                        fees,
                        mintToken,
                        setMintToken,
                        erc20Contract: fees?.erc20Contract ?? zeroAddress,
                        debouncedMintQuantity,
                        handleSubmit,
                        chainId,
                        isTxPending,
                        isTxSuccessful,
                        txStatus,
                        txHash
                    }
                }
            />
        </React.Fragment >
    )
}


type FlowModalProps = {
    fees: FeeStructure | null
    mintToken: Address
    setMintToken: (token: Address) => void
    erc20Contract: Address
    debouncedMintQuantity: string
    handleSubmit: (quantity: number, mintToken: Address) => void
    chainId: ChainId
    isTxPending: boolean
    isTxSuccessful: boolean
    txStatus: string
    txHash: string
}

type CurrencyOptionProps = {
    erc20Symbol: string
    erc20Decimals: number
} & FlowModalProps


const MintCurrencyOptions = ({ props, handleClose }: { props: CurrencyOptionProps, handleClose: () => void }) => {

    const erc20AmountRequired = props.fees ? props.fees.erc20MintPrice * BigInt(props.debouncedMintQuantity) : BigInt(0);
    const ethAmountRequired = props.fees ? props.fees.ethMintPrice * BigInt(props.debouncedMintQuantity) : BigInt(0);

    const { balance: erc20Balance, isBalanceLoading: isErc20BalanceLoading } = useErc20Balance(props.mintToken, props.chainId);
    const { balance: ethBalance, isBalanceLoading: isEthBalanceLoading } = useEthBalance(props.chainId);

    const { data: capabilities } = useCapabilities()

    const areAuxiliaryFundsSupported = capabilities ? capabilities[props.chainId]?.auxiliaryFunds?.supported ?? false : false

    const isInsufficientErc20Balance = areAuxiliaryFundsSupported ? false : isErc20BalanceLoading ? false : erc20Balance < erc20AmountRequired
    const isInsufficientEthBalance = areAuxiliaryFundsSupported ? false : isEthBalanceLoading ? false : ethBalance < ethAmountRequired

    const mintButtonTitle = props.mintToken === NATIVE_TOKEN
        ? isInsufficientEthBalance ? `Insufficient balance` : "Mint"
        : isInsufficientErc20Balance ? `Insufficient ${props.erc20Symbol} balance` : "Approve & Mint"


    return (
        <div className="animate-fadeIn flex flex-col gap-6 relative">
            <Button variant="ghost" className="flex gap-2 normal-case mr-auto" onClick={handleClose}><HiArrowNarrowLeft className="w-6 h-6 text-t2" />Go Back</Button>

            <div className="flex flex-col w-full sm:w-3/4 m-auto gap-8 h-[50vh] justify-center">
                <div className="flex flex-col sm:flex-row gap-2">
                    <div
                        className={`text-lg text-center relative bg-base-100 border-2 hover:bg-base-200 cursor-pointer border-border ${props.mintToken === NATIVE_TOKEN && "border-purple-600 hover:border-purple-600"} normal-case rounded-lg grid h-24 md:h-36 flex-grow place-items-center`}
                        onClick={() => props.setMintToken(NATIVE_TOKEN)}
                    >
                        Mint with <br />{formatEther(ethAmountRequired)} ETH
                        <HiCheckBadge className={` absolute -top-3 -right-3 h-10 w-10 text-purple-600 ${props.mintToken === NATIVE_TOKEN ? "visible" : "invisible"}`} />

                    </div>
                    <div
                        className={`text-lg text-center relative bg-base-100 border-2 hover:bg-base-200 cursor-pointer border-border ${props.mintToken !== NATIVE_TOKEN && "border-primary hover:border-primary"} normal-case rounded-lg grid h-24 md:h-36 flex-grow place-items-center`}
                        onClick={() => props.setMintToken(props.erc20Contract)}
                    >
                        Mint with <br /> {formatUnits(erc20AmountRequired, props.erc20Decimals)} {props.erc20Symbol}
                        <HiCheckBadge className={` absolute -top-3 -right-3 h-10 w-10 text-primary ${props.mintToken !== NATIVE_TOKEN ? "visible" : "invisible"}`} />
                    </div>
                </div>
                <OnchainButton
                    chainId={props.chainId}
                    title={mintButtonTitle}
                    disabled={props.mintToken === NATIVE_TOKEN ? isInsufficientEthBalance : isInsufficientErc20Balance}
                    onClick={() => props.handleSubmit(parseInt(props.debouncedMintQuantity), props.mintToken)}
                    isLoading={false}
                    loadingChild={<></>}
                />
            </div>
        </div>
    )
}

const MintFlowModal = ({
    isModalOpen,
    handleClose,
    handleExitMint,
    flowProps

}: { isModalOpen: boolean, handleClose: () => void, handleExitMint: () => void, flowProps: FlowModalProps }) => {

    const { chain } = useAccount();
    const { symbol, decimals } = useTokenInfo(flowProps.erc20Contract, flowProps.chainId);


    useEffect(() => {

        // a hacky way to close the modal when mint with eth fails and we don't want to show the currency options (since erc20 is not an option)
        if ((flowProps.txStatus === "error" || flowProps.txStatus === undefined) && isModalOpen && flowProps.erc20Contract === zeroAddress) {
            handleClose()
        }
    }, [flowProps.txStatus])

    return (
        <Modal isModalOpen={isModalOpen} onClose={handleClose}>
            {!flowProps.isTxPending && !flowProps.isTxSuccessful && <MintCurrencyOptions props={{ ...flowProps, erc20Decimals: decimals, erc20Symbol: symbol }} handleClose={handleClose} />}
            {flowProps.isTxPending && (
                <div className="animate-fadeIn flex flex-col gap-2 w-full h-[50vh] items-center justify-center">
                    <p className="text-lg text-t1 font-semibold text-center">
                        {flowProps.txStatus === "erc20ApprovalInProgress" ? `Approving use of ${symbol}` : "Minting your NFT"}
                    </p>
                    <div className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                    />
                </div>
            )}
            {flowProps.isTxSuccessful && (
                <div className="animate-fadeIn flex flex-col gap-3 w-full h-[50vh] items-center justify-center">
                    <HiCheckBadge className="h-48 w-48 text-success" />
                    <h2 className="font-bold text-t1 text-xl">Got it.</h2>
                    <div className="flex gap-2 items-center">
                        <Link
                            href={`${chain?.blockExplorers?.default?.url ?? ''}/tx/${flowProps.txHash}`}
                            target="_blank"
                            rel="noopener norefferer"
                            passHref
                        >
                            <Button variant="ghost">
                                View Tx
                            </Button>
                        </Link>
                        <Button onClick={handleExitMint}>Close</Button>
                    </div>
                </div>
            )}
        </Modal>
    )
}

"use client"

import { useDebounce } from "@/hooks/useDebounce";
import React, { useState } from "react";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { ChainLabel } from "../ContestLabels/ContestLabels";
import { HiCheckBadge } from "react-icons/hi2";
import { useAccount } from "wagmi";
import { getChainName } from "@/lib/chains/supportedChains";
import OnchainButton from "../OnchainButton/OnchainButton";
import { maxUint40 } from "viem";
import { format } from "date-fns";
import { TbLoader2 } from "react-icons/tb";
import { CounterInput, FeeStructure, getETHMintPrice, RenderFees, RenderMaxSupply, RenderMintMedia, RenderTotalMints } from "./MintUtils";
import { Boundary } from "../Boundary/Boundary";
import { AddressOrEns, Avatar } from "../AddressDisplay/AddressDisplay";
import { usePathname, useRouter } from "next/navigation";
import { HiArrowNarrowLeft } from "react-icons/hi";


export type DisplayMode = "modal" | "expanded"

export type DisplayProps = {
    chainId: number,
    creator: string,
    metadata: any, // todo type this
    fees: FeeStructure | null,
    isMintPeriodOver: boolean,
    saleEnd: number,
    totalMinted: string,
    maxSupply: string,
    handleSubmit: (quantity: number) => void,
    isTxPending: boolean,
    isTxSuccessful: boolean,
    txHash: string,
    txStatus: string,
    setIsModalOpen?: (open: boolean) => void
}


export const RenderDisplayWithProps = ({
    displayMode,
    chainId,
    creator,
    metadata,
    fees,
    isMintPeriodOver,
    saleEnd,
    totalMinted,
    maxSupply,
    handleSubmit,
    isTxPending,
    isTxSuccessful,
    txHash,
    txStatus,
    setIsModalOpen
}: DisplayProps & { displayMode: DisplayMode }) => {


    const displayProps = {
        chainId,
        creator,
        metadata,
        fees,
        isMintPeriodOver,
        saleEnd,
        totalMinted,
        maxSupply,
        handleSubmit,
        isTxPending,
        isTxSuccessful,
        txHash,
        txStatus,
        setIsModalOpen
    }

    if (displayMode === "modal") return <MintModalDisplay {...displayProps} />
    else if (displayMode === "expanded") return <MintExpandedDisplay {...displayProps} />
    return null

}


export const MintModalDisplay = ({
    chainId,
    creator,
    metadata,
    fees,
    isMintPeriodOver,
    saleEnd,
    totalMinted,
    maxSupply,
    handleSubmit,
    isTxPending,
    isTxSuccessful,
    txHash,
    txStatus,
    setIsModalOpen
}: DisplayProps) => {

    const [mintQuantity, setMintQuantity] = useState<string>('1');
    const debouncedMintQuantity = useDebounce(mintQuantity);
    const { chain } = useAccount();
    const availableEditions = BigInt(maxSupply) - BigInt(totalMinted);
    const areEditionsSoldOut = availableEditions <= 0;


    return (
        <React.Fragment>
            {!isTxPending && !isTxSuccessful && (
                <div className="flex flex-col gap-2 relative">
                    <div className="flex">
                        <h2 className="text-t1 text-xl font-bold">Post</h2>
                        <button className="btn btn-ghost btn-sm  ml-auto" onClick={() => setIsModalOpen(false)}><MdOutlineCancelPresentation className="w-6 h-6 text-t2" /></button>
                    </div>
                    <div className="p-2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-black ">
                        <div className="items-center justify-center">
                            <RenderMintMedia imageURI={metadata.image || ""} animationURI={metadata.animation || ""} />
                        </div>
                        <div className="bg-black-200 items-start flex flex-col gap-8 relative">
                            <div className="flex flex-col gap-2">
                                <p className="line-clamp-3 font-bold text-lg break-all">{metadata.name}</p>
                                <div className="flex gap-2 items-center text-sm text-t2 bg-base rounded-lg p-1">
                                    <Avatar address={creator} size={28} />
                                    <AddressOrEns address={creator} />
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

                                {!areEditionsSoldOut && !isMintPeriodOver && <div className="flex flex-col w-full md:max-w-[250px] ml-auto gap-2">
                                    <CounterInput count={mintQuantity} setCount={setMintQuantity} max={availableEditions.toString()} />
                                    <RenderFees fees={fees} quantity={debouncedMintQuantity} />
                                    <OnchainButton
                                        chainId={chainId}
                                        title={"Mint"}
                                        onClick={() => handleSubmit(parseInt(debouncedMintQuantity))}
                                        isLoading={isTxPending}
                                        loadingChild={
                                            <button className="btn btn-disabled normal-case w-auto">
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
                                            </button>
                                        }
                                    />
                                </div>
                                }
                            </div>
                        </div>
                    </div >

                </div >
            )}

            <div className="p-2" />
            {isTxPending && (
                <div className="animate-springUp flex flex-col gap-2 w-full h-[50vh] items-center justify-center">
                    <p className="text-lg text-t1 font-semibold text-center">Minting your NFT</p>
                    <div className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                    />
                </div>
            )}
            {isTxSuccessful && (
                <div className="animate-springUp flex flex-col gap-3 w-full h-[50vh] items-center justify-center">
                    <HiCheckBadge className="h-48 w-48 text-success" />
                    <h2 className="font-bold text-t1 text-xl">Got it.</h2>
                    <div className="flex gap-2 items-center">
                        <a className="btn btn-ghost normal-case text-t2" href={`${chain.blockExplorers.default.url}/tx/${txHash}`} target="_blank" rel="noopener norefferer">View Tx</a>
                        <button className="btn normal-case btn-primary" onClick={() => setIsModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}

export const MintExpandedDisplay = ({
    chainId,
    creator,
    metadata,
    fees,
    isMintPeriodOver,
    saleEnd,
    totalMinted,
    maxSupply,
    handleSubmit,
    isTxPending,
    isTxSuccessful,
    txHash,
    txStatus,
    setIsModalOpen
}: DisplayProps) => {

    const [mintQuantity, setMintQuantity] = useState<string>('1');
    const debouncedMintQuantity = useDebounce(mintQuantity);
    const { chain } = useAccount();
    const availableEditions = BigInt(maxSupply) - BigInt(totalMinted);
    const areEditionsSoldOut = availableEditions <= 0;

    return (
        <React.Fragment>
            {!isTxPending && !isTxSuccessful && (
                <Boundary>
                    <div className="grid grid-cols-1 lg:grid-cols-[45%_50%] gap-2 md:gap-12 w-full">
                        <div className="flex flex-col gap-4 items-start justify-start">
                            <RenderMintMedia imageURI={metadata.image || ""} animationURI={metadata.animation || ""} styleOverrides="shadow-lg shadow-black" />
                        </div>
                        <div className="flex flex-col gap-8 justify-start ">
                            <div className="flex flex-col gap-4 w-full">
                                <div className="flex flex-col gap-2">
                                    <p className="line-clamp-3 font-bold text-xl break-all">{metadata.name}</p>
                                    <div className="flex gap-2 items-center text-sm text-t2 bg-base rounded-lg p-1">
                                        <Avatar address={creator} size={32} />
                                        <AddressOrEns address={creator} />
                                    </div>
                                </div>
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
                                        <p className="text-t2">Collected</p>
                                        <div className="flex gap-1">
                                            <RenderTotalMints totalMinted={totalMinted} />
                                            <p className="text-t1">/</p>
                                            <RenderMaxSupply maxSupply={maxSupply} />
                                        </div>
                                    </div>
                                </div>
                                {!areEditionsSoldOut && !isMintPeriodOver && <div className="flex flex-col gap-2 w-full">
                                    <div className="p-1" />
                                    <div className="w-full bg-base-100 h-[1px]" />
                                    <RenderFees fees={fees} quantity={debouncedMintQuantity} />
                                    <div className="grid grid-cols-1 xl:grid-cols-[50%_50%] gap-2 xl:gap-4 w-full">
                                        <CounterInput count={mintQuantity} setCount={setMintQuantity} max={availableEditions.toString()} />
                                        <OnchainButton
                                            chainId={chainId}
                                            disabled={parseInt(mintQuantity) <= 0 || mintQuantity === "" || parseInt(mintQuantity) > availableEditions}
                                            title={"Mint"}
                                            onClick={() => handleSubmit(parseInt(debouncedMintQuantity))}
                                            isLoading={isTxPending}
                                            loadingChild={
                                                <button className="btn btn-disabled normal-case w-auto">
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
                                                </button>
                                            }
                                        />
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                    </div >
                </Boundary>
            )}

            <div className="p-2" />
            {isTxPending && (
                <div className="animate-springUp flex flex-col gap-2 w-full h-[50vh] items-center justify-center">
                    <p className="text-lg text-t1 font-semibold text-center">Minting your NFT</p>
                    <div className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                    />
                </div>
            )}
            {isTxSuccessful && (
                <div className="animate-springUp flex flex-col gap-3 w-full h-[50vh] items-center justify-center">
                    <HiCheckBadge className="h-48 w-48 text-success" />
                    <h2 className="font-bold text-t1 text-xl">Got it.</h2>
                    <div className="flex gap-2 items-center">
                        <a className="btn btn-ghost normal-case text-t2" href={`${chain.blockExplorers.default.url}/tx/${txHash}`} target="_blank" rel="noopener norefferer">View Tx</a>
                        <button className="btn normal-case btn-primary" onClick={() => setIsModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </React.Fragment >
    )
}

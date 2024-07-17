"use client"

import { useSession } from "@/providers/SessionProvider";
import React, { useEffect, useState } from "react";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { HiCheckBadge } from "react-icons/hi2";
import { parseIpfsUrl } from "@/lib/ipfs";
import { RenderStandardVideoWithLoader } from "../VideoPlayer";
import { ImageWrapper } from "../Submission/MediaWrapper";
import UplinkImage from "@/lib/UplinkImage";
import { LuMinusSquare, LuPlusSquare } from "react-icons/lu";
import { formatEther, maxUint40 } from "viem";
import { PiInfinity } from "react-icons/pi";
import { Channel, ChannelToken, ChannelTokenIntent, ChannelTokenV1, ContractID, isTokenIntent, isTokenV1Onchain, isTokenV2Onchain } from "@/types/channel";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";
import { Boundary } from "../Boundary/Boundary";
import { useBanToken } from "@/hooks/useBanToken";
import { usePaginatedMintBoardIntents, usePaginatedMintBoardPosts } from "@/hooks/useTokens";
import { IInfiniteTransportConfig } from "@tx-kit/sdk";
import { useRouter } from "next/navigation";
import { HiArrowNarrowLeft } from "react-icons/hi";
import toast from "react-hot-toast";


export type FeeStructure = {
    creatorPercentage: number
    channelPercentage: number
    referralPercentage: number
    sponsorPercentage: number
    uplinkPercentage: number
    ethMintPrice: bigint
}


export const formatFeeKey = (key, value) => {
    switch (key) {
        case "uplinkPercentage":
            return "Uplink Reward";
        case "creatorPercentage":
            return "Creator Reward";
        case "channelPercentage":
            return "Space Reward";
        case "referralPercentage":
            return "Referral Reward";
        case "sponsorPercentage":
            return "Sponsor Reward";
        default:
            return null;
    }
}



export const getETHMintPrice = (price: bigint | null) => {
    if (!price) return "Free";
    return `${formatEther(price)} ETH`
}

const constructTokenUrl = ({ spaceName, contractId, referral, token }: { spaceName: string, contractId: ContractID, referral: string, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent }) => {
    if ((isTokenV1Onchain(token))) {
        return `${process.env.NEXT_PUBLIC_CLIENT_URL}/${spaceName}/mintboard/${contractId}/post/${token.id}/v1${referral ? `?${referral}` : ''}`
    } else if (isTokenV2Onchain(token)) {
        return `${process.env.NEXT_PUBLIC_CLIENT_URL}/${spaceName}/mintboard/${contractId}/post/${(token as ChannelToken).tokenId}/v2${referral ? `?${referral}` : ''}`
    } else if (isTokenIntent(token)) {
        return `${process.env.NEXT_PUBLIC_CLIENT_URL}/${spaceName}/mintboard/${contractId}/post/${token.id}/v2?intent=true&${referral}`
    }
}

export const calculateSaleEnd = (channel: Channel, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent): number => {


    const transportConfig = channel.transportLayer.transportConfig as IInfiniteTransportConfig;

    if (isTokenV1Onchain(token)) {
        const saleEnd = Number((token as ChannelTokenV1).publicSaleStart) + Number(transportConfig.saleDuration);
        return saleEnd >= Number(maxUint40) ? Number(maxUint40) : saleEnd;
    }
    else if (isTokenV2Onchain(token)) {
        const saleEnd = Number((token as ChannelToken).blockTimestamp) + Number(transportConfig.saleDuration);
        return saleEnd >= Number(maxUint40) ? Number(maxUint40) : saleEnd
    }
    else if (isTokenIntent(token)) {
        return Number(token.deadline);
    }

    return 1;
}

export const isMintPeriodOver = (saleEnd: number) => {
    return saleEnd <= Math.floor(Date.now() / 1000);
}

export const RenderMintMedia = ({ imageURI, animationURI, styleOverrides }: { imageURI: string; animationURI: string, styleOverrides?: string }) => {
    const gatewayImageURI = parseIpfsUrl(imageURI).gateway
    const gatewayAnimationURI = parseIpfsUrl(animationURI).gateway

    if (gatewayAnimationURI) {
        return (
            <RenderStandardVideoWithLoader videoUrl={gatewayAnimationURI} posterUrl={gatewayImageURI} />
        )

    }
    else if (gatewayImageURI) {
        return (
            <UplinkImage
                src={gatewayImageURI}
                alt="Picture of the author"
                sizes="30vw"
                className="w-full h-auto rounded-lg "
                width={500}
                height={300}
            />
        )
        // return (
        //     <ImageWrapper>
        //         <UplinkImage src={gatewayImageURI} fill sizes={"30vw"} alt="media" className={`w-full rounded-lg object-contain ${styleOverrides}`} />
        //     </ImageWrapper>
        // )
    }
}

export const asPositiveInt = (value: string) => {
    return value.trim() === "" ? "" : Math.abs(Math.round(Number(value))).toString();
}

export const CounterInput = ({ count, setCount, max }: { count: string, setCount: (count: string) => void, max: string }) => {

    const handleInputChange = (e) => {
        const asInteger = asPositiveInt(e.target.value)
        setCount(
            parseInt(asInteger) > parseInt(max)
                ?
                max
                :
                asInteger
        )
    }

    return (
        <div className="flex items-center w-full">
            <button className="btn bg-base disabled:bg-base disabled:border-base-100 rounded-r-none border-base-100 normal-case m-auto text-t1" disabled={count === '1' || count === ''} onClick={() => setCount((Number(count) - 1).toString())}><LuMinusSquare className="w-4 h-4" /></button>
            <div className="w-full">
                <input
                    type="number"
                    onWheel={(e) => e.currentTarget.blur()}
                    value={count}
                    onChange={handleInputChange}
                    className="input w-[1px] min-w-full rounded-none focus:ring-0 focus:border-none focus:outline-none text-center"
                />
            </div>
            <button className="btn rounded-l-none bg-base border-base-100 normal-case ml-auto text-t1" disabled={max ? Number(count) >= Number(max) : false} onClick={() => setCount((Number(count) + 1).toString())}><LuPlusSquare className="w-4 h-4" /></button>
        </div>
    )
}


export const RenderFees = ({ fees, quantity }: { fees: FeeStructure | null, quantity: string }) => {
    const [isFeeInfoOpen, setIsFeeInfoOpen] = useState<boolean>(false);

    if (!fees) return null;

    return (
        < div className="relative w-full" >
            <button className="flex items-center w-full"
                onClick={() => setIsFeeInfoOpen(!isFeeInfoOpen)}
            >
                <p className="text-t2">{`Price: ${getETHMintPrice(fees.ethMintPrice * BigInt(quantity))}`}</p>
                <span className="ml-auto">{isFeeInfoOpen ? <LuMinusSquare className="w-4 h-4" /> : <LuPlusSquare className="w-4 h-4" />}</span>
            </button>
            <div
                className={`w-full flex flex-col gap-2 ${isFeeInfoOpen ? "h-[200px]" : "h-0"} overflow-hidden transition-all duration-300 ease-in-out`}
            >
                {isFeeInfoOpen && <div className="w-full bg-base-100 h-[1px]" />}

                {isFeeInfoOpen && Object.entries(fees).map(([key, value], idx) => {
                    const formattedKey = formatFeeKey(key, value);
                    if (formattedKey) {
                        return (
                            <div className="flex" key={idx}>
                                <p className="text-t2 text-sm">{formattedKey}</p>
                                <p className="text-t2 ml-auto text-sm">{`${value} %`}</p>
                            </div>
                        )
                    }
                })}
            </div>
        </div >
    )

}


export const RenderTotalMints = ({ totalMinted }: { totalMinted: string }) => {
    // if (isTotalSupplyLoading) {
    //     return (
    //         <div className="inline-block h-3 w-3 animate-spin text-t2 rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
    //             role="status"
    //         />
    //     )
    // }
    // else {
    return (
        <p className="text-t1 font-bold">{totalMinted}</p>
    )
    //}
}
export const RenderMaxSupply = ({ maxSupply }: { maxSupply: string }) => {
    if (maxSupply >= maxUint40.toString()) {
        return (
            <PiInfinity className="w-6 h-6 text-t1" />
        )
    }
    else
        return (
            <p className="text-t1 font-bold">{maxSupply}</p>
        )
}

export const ShareModalContent = ({ spaceName, contractId, token, handleClose }: { spaceName: string, contractId: ContractID, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent, handleClose: () => void }) => {
    const { status, data: session } = useSession();
    const [success, setSuccess] = useState(false);

    const handleShare = () => {
        const referralLink = session?.user?.address ? `referrer=${session?.user?.address}` : ''
        const shareUrl = constructTokenUrl({ spaceName, contractId, referral: referralLink, token })
        navigator.clipboard.writeText(shareUrl);
        setSuccess(true)
        toast.success("Link Copied")
        handleClose();
    };

    useEffect(() => {
        if (status === 'authenticated') {
            handleShare();
        }
    }, [status])


    return (
        <div className="flex flex-col w-full gap-1 lg:gap-4 p-0">
            <div className="flex justify-between">
                <h2 className="text-t1 text-xl font-bold">Share</h2>
                <button className="btn btn-ghost btn-sm  ml-auto" onClick={handleClose}><MdOutlineCancelPresentation className="w-6 h-6 text-t2" /></button>
            </div>
            {status !== 'authenticated' && <p className="text-t2">Connect your wallet to earn referral rewards whenever someone mints with your link.</p>}
            <WalletConnectButton>
                {success && (
                    <div className="flex flex-col gap-2 items-center text-center animate-springUp">
                        <HiCheckBadge className="w-16 h-16 text-success" />
                        <p className="text-t1 text-lg font-bold">Link Copied!</p>
                    </div>
                )}
            </WalletConnectButton>
            {status !== 'authenticated' &&
                <>
                    <div className="w-full h-0.5 bg-base-200" />
                    <div className="flex flex-col gap-2">
                        <p className="text-t2">Or just copy link</p>
                        <button className="secondary-btn btn-sm" onClick={handleShare}>Copy Link</button>
                    </div>
                </>
            }
        </div>
    )
}


export const ShareButton = ({ spaceName, contractId, token, onClick, styleOverride }: { spaceName: string, contractId: ContractID, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent, onClick: (event?) => void, styleOverride?: string }) => {
    const { data: session, status } = useSession();
    const [shareText, setShareText] = useState("Share");

    const handleShare = (event, link) => {
        event.stopPropagation();
        event.preventDefault();
        setShareText("Copied");
        navigator.clipboard.writeText(link);
        setTimeout(() => {
            setShareText("Share");
        }, 2000);
    };
    const handleShareClick = (event) => {

        if (status === 'authenticated') {
            const referralLink = session?.user?.address ? `referrer=${session?.user?.address}` : ''
            handleShare(event, constructTokenUrl({ spaceName, contractId, referral: referralLink, token }))
        }
        else {
            onClick(event);
        }
    }

    return (
        <button
            className={styleOverride ?? "btn normal-case bg-t2 bg-opacity-5 border-none btn-sm hover:bg-opacity-20 text-t2 hover:text-t1"}
            onClick={handleShareClick}
        >
            {shareText}
        </button>
    )
}

export const ManageModalContent = ({ token, contractId, handleClose }: { token: ChannelToken | ChannelTokenIntent, contractId: ContractID, handleClose: () => void }) => {
    const { deletePaginatedPost: deleteToken } = usePaginatedMintBoardPosts(contractId);
    const { deletePaginatedPost: deleteIntent } = usePaginatedMintBoardIntents(contractId);

    const [confirmationText, setConfirmationText] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);
    const { data: session } = useSession();
    const { handleBanToken } = useBanToken(contractId);

    useEffect(() => {
        if (confirmationText === 'delete') {
            return setIsConfirmed(true)
        }
        setIsConfirmed(false)
    }, [confirmationText])


    const handleDelete = () => {
        handleBanToken({ token, csrfToken: session.csrfToken })
        handleClose();
        if (isTokenIntent(token)) {
            deleteIntent(token.id)
        } else {
            deleteToken(token.tokenId)
        }
    }


    return (
        <div className="flex flex-col w-full gap-1 lg:gap-4 p-0">
            <h2 className="text-t1 text-xl font-bold">Manage Post</h2>
            <Boundary size="small">
                <p>Once deleted, this post will be gone forever. Type <b>delete</b> if you understand</p>
            </Boundary>
            <div className="flex flex-row items-center">
                <input
                    className="input input-bordered w-1/3"
                    type="text"
                    autoComplete="off"
                    spellCheck="false"
                    value={confirmationText}
                    onChange={(e) => { setConfirmationText(e.target.value) }}
                />
                <button onClick={handleDelete} disabled={!isConfirmed} className="ml-auto btn btn-active w-fit hover:bg-error bg-opacity-30 hover:bg-opacity-30 text-error border-none normal-case">delete post</button>
            </div>
        </div>
    )
}

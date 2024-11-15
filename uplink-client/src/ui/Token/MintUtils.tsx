"use client";;
import { useSession } from "@/providers/SessionProvider";
import React, { useEffect, useState } from "react";
import { HiCheckBadge, HiChevronDown, HiChevronUp } from "react-icons/hi2";
import { parseIpfsUrl } from "@/lib/ipfs";
import { RenderStandardVideoWithLoader } from "../VideoPlayer";
import OptimizedImage from "@/lib/OptimizedImage";
import { LuMinusSquare, LuPlusSquare } from "react-icons/lu";
import { Address, formatEther, maxUint40 } from "viem";
import { PiInfinity } from "react-icons/pi";
import { Channel, ChannelToken, ChannelTokenIntent, ChannelTokenV1, ContractID, isTokenIntent, isTokenV1Onchain, isTokenV2Onchain } from "@/types/channel";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";
import { useBanToken } from "@/hooks/useBanToken";
import { usePaginatedMintBoardIntents, usePaginatedMintBoardPosts } from "@/hooks/useTokens";
import { IInfiniteTransportConfig } from "@tx-kit/sdk/subgraph";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { DisplayMode } from "./MintableTokenDisplay";
import { Button } from "../DesignKit/Button";
import { Input } from "../DesignKit/Input";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../DesignKit/Dialog";


export type FeeStructure = {
    creatorPercentage: number
    channelPercentage: number
    referralPercentage: number
    sponsorPercentage: number
    uplinkPercentage: number
    ethMintPrice: bigint
    erc20MintPrice: bigint
    erc20Contract: Address
}

export const isErc20Mintable = (fees: FeeStructure) => {
    return fees.erc20MintPrice > BigInt(0)
}

export const formatFeeKey = (key, value) => {
    switch (key) {
        case "uplinkPercentage":
            return "Protocol Reward";
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

const constructTokenUrl = ({ displayMode, pathname, referral, token }: { displayMode: DisplayMode, pathname: string, referral: string, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent }) => {


    // 2 possibilites (right now). either we're on the modal view or the expanded view

    // if modal view, we need to append the post route to the current route
    // if expanded view, we only need to append (or swap) the referral link

    if (displayMode === 'modal') {
        if (isTokenV1Onchain(token)) return `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}/post/${token.id}/v1${referral ? `?${referral}` : ''}`
        else if (isTokenV2Onchain(token)) return `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}/post/${(token as ChannelToken).tokenId}/v2${referral ? `?${referral}` : ''}`
        else if (isTokenIntent(token)) return `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}/post/${token.id}/v2?intent=true${referral ? `&${referral}` : ''}`
    } else {
        if (isTokenV1Onchain(token)) return `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}${referral ? `?${referral}` : ''}`
        else if (isTokenV2Onchain(token)) return `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}${referral ? `?${referral}` : ''}`
        else if (isTokenIntent(token)) return `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}?intent=true${referral ? `&${referral}` : ''}`
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

export const RenderMintMedia = ({ imageURI, animationURI, size = "sm" }: { imageURI: string; animationURI: string, size?: string }) => {
    const gatewayImageURI = parseIpfsUrl(imageURI).gateway
    const gatewayAnimationURI = parseIpfsUrl(animationURI).gateway

    const width = size === "sm" ? 500 : 1000;
    const height = size === "sm" ? 300 : 800;


    if (gatewayAnimationURI) {
        return (
            <RenderStandardVideoWithLoader videoUrl={gatewayAnimationURI} posterUrl={gatewayImageURI} />
        )

    }
    else if (gatewayImageURI) {
        return (
            <OptimizedImage
                src={gatewayImageURI}
                alt="post media"
                sizes={size === "sm" ? "30vw" : "50vw"}
                className={`w-full h-auto max-w-full ${size === "sm" ? "max-h-96" : "max-h-[700px]"} object-contain rounded-lg `}
                width={width}
                height={height}
            />
        )
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
        <div className="flex items-center w-full gap-1">
            <Button variant="ghost" className="m-auto text-t1" disabled={count === '1' || count === ''} onClick={() => setCount((Number(count) - 1).toString())}><LuMinusSquare className="w-4 h-4" /></Button>
            <div className="w-full">
                <Input
                    type="number"
                    className="text-center w-full max-w-full bg-transparent"
                    variant="default"
                    onWheel={(e) => e.currentTarget.blur()}
                    value={count}
                    onChange={handleInputChange}
                />
            </div>
            <Button variant="ghost" className="text-t1" disabled={max ? Number(count) >= Number(max) : false} onClick={() => setCount((Number(count) + 1).toString())}><LuPlusSquare className="w-4 h-4" /></Button>
        </div >
    )
}


export const RenderFees = ({ fees, quantity }: { fees: FeeStructure | null, quantity: string }) => {
    const [isFeeInfoOpen, setIsFeeInfoOpen] = useState<boolean>(false);

    if (!fees) return null;

    return (
        <div className="relative w-fit ml-auto" >
            <Button variant="ghost" className="flex items-center w-full gap-2 justify-end"
                onClick={() => setIsFeeInfoOpen(!isFeeInfoOpen)}
            >
                <p className="text-t2">{`Price: ${getETHMintPrice(fees.ethMintPrice * BigInt(quantity))}`}</p>
                <span className="">{isFeeInfoOpen ? <HiChevronUp className="w-4 h-4" /> : <HiChevronDown className="w-4 h-4" />}</span>
            </Button>
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
    return (
        <p className="text-t1 font-bold">{totalMinted}</p>
    )
}
export const RenderMaxSupply = ({ maxSupply }: { maxSupply: string }) => {
    if (parseInt(maxSupply) >= Number(maxUint40)) {
        return <PiInfinity className="w-6 h-6 text-t1" />
    }
    else return <p className="text-t1 font-bold">{maxSupply}</p>
}

export const ShareModalContent = ({ displayMode, token, handleClose }: { displayMode: DisplayMode, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent, handleClose: () => void }) => {
    const { status, data: session } = useSession();
    const pathname = usePathname();
    const [success, setSuccess] = useState(false);

    const handleShare = () => {
        const referralLink = session?.user?.address ? `referrer=${session?.user?.address}` : ''
        const shareUrl = constructTokenUrl({ displayMode, pathname, referral: referralLink, token })
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
        <div className="flex flex-col w-full gap-1 lg:gap-4 p-0 max-w-[350px]">
            <DialogHeader>
                <DialogTitle>Share Post</DialogTitle>
            </DialogHeader>
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
                <React.Fragment>
                    <div className="w-full h-0.5 bg-base-200" />
                    <div className="flex flex-col gap-2">
                        <p className="text-t2">Or just copy link</p>
                        <Button variant="secondary" onClick={handleShare}>Copy Link</Button>
                    </div>
                </React.Fragment>
            }
        </div>
    )
}


export const ShareButton = ({ displayMode, token, onClick, className }: { displayMode: DisplayMode, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent, onClick: (event?) => void, className?: string }) => {
    const { data: session, status } = useSession();
    const [shareText, setShareText] = useState("Share Post");
    const pathname = usePathname();

    const handleShare = (event, link) => {
        event.stopPropagation();
        event.preventDefault();
        setShareText("Link Copied");
        navigator.clipboard.writeText(link);
        setTimeout(() => {
            setShareText("Share Post");
        }, 2000);
    };
    const handleShareClick = (event) => {

        if (status === 'authenticated') {
            const referralLink = session?.user?.address ? `referrer=${session?.user?.address}` : ''
            handleShare(event, constructTokenUrl({ displayMode, pathname, referral: referralLink, token }))
        }
        else {
            onClick(event);
        }
    }

    return (
        <Button
            variant="outline"
            className={`${className}`}
            onClick={handleShareClick}
        >
            {shareText}
        </Button>
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
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Manage Post</DialogTitle>
                <DialogDescription>Once deleted, this post will be gone forever. Type <b>delete</b> if you understand</DialogDescription>
            </DialogHeader>
            <div className="flex flex-row items-center">
                <Input
                    variant="outline"
                    className="w-1/3"
                    type="text"
                    autoComplete="off"
                    spellCheck="false"
                    value={confirmationText}
                    onChange={(e) => { setConfirmationText(e.target.value) }}
                />
                <Button onClick={handleDelete} disabled={!isConfirmed} className="ml-auto" variant="destructive">delete post</Button>
            </div>
        </DialogContent>
    )

}

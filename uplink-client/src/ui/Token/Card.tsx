"use client"

import { ChannelToken, isTokenIntent, ChannelTokenIntent, TokenMetadata, ChannelTokenV1, isTokenV2Onchain, Channel, ContractID } from "@/types/channel"
import React, { useEffect, useState } from "react";
import { RenderInteractiveVideoWithLoader } from "../VideoPlayer";
import { parseIpfsUrl } from "@/lib/ipfs";
import { ImageWrapper } from "../Submission/MediaWrapper";
import UplinkImage from "@/lib/UplinkImage";
import { AddressOrEns, Avatar, UserAvatar } from "../AddressDisplay/AddressDisplay";
import { calculateSaleEnd, isMintPeriodOver, ShareButton } from "./MintUtils";
import { AdminWrapper } from "@/lib/AdminWrapper";
import { MdOutlineSettings } from "react-icons/md";

import { Admin } from "@/types/space";
import { isMobile } from "@/lib/isMobile";
import { useInView } from "react-intersection-observer";

const compact_formatter = new Intl.NumberFormat('en', { notation: 'compact' })

type CardProps = {
    author: string;
    totalMinted: string;
    metadata: TokenMetadata;
    isActive: boolean;
}

const CardRenderer = ({ cardProps }: { cardProps: CardProps }) => {

    return (
        <React.Fragment>
            {cardProps.metadata?.animation ? (
                <RenderInteractiveVideoWithLoader videoUrl={parseIpfsUrl(cardProps.metadata.animation).gateway} posterUrl={parseIpfsUrl(cardProps.metadata.image).gateway} isActive={cardProps.isActive} />

            ) : (
                <ImageWrapper >
                    <UplinkImage
                        src={parseIpfsUrl(cardProps.metadata.image).gateway}
                        draggable={false}
                        alt="submission image"
                        fill
                        sizes="30vw"
                        className="object-contain w-full h-full transition-transform duration-300 ease-in-out rounded-xl"
                    />
                </ImageWrapper>

            )}

            <p className="font-bold text-t1 line-clamp-1">{cardProps.metadata.name}</p>
        </React.Fragment>
    )

}

export const MintButton = ({ onClick, styleOverride }: { onClick: (event?) => void, styleOverride?: string }) => {
    return (
        <button
            className={styleOverride ?? "btn btn-md normal-case m-auto btn-ghost w-fit hover:bg-primary bg-gray-800 text-primary hover:text-black hover:rounded-xl rounded-3xl transition-all duration-300"}
            onClick={onClick}>
            Mint
        </button>
    )
}

export const CardFooter = ({
    token,
    channel,
    spaceName,
    contractId,
    handleMint,
    //handleShare,
    handleManage
}: {
    token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent,
    channel: Channel,
    spaceName: string,
    contractId: ContractID,
    handleMint: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void,
    //handleShare: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void,
    handleManage: (event: any, token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent) => void,

}) => {
    const saleEnd = calculateSaleEnd(channel, token);
    const isMintingOver = isMintPeriodOver(saleEnd)
    return (
        <div className="flex flex-col w-full">
            <div className="flex w-full items-center gap-2">
                {/* <div className="mr-auto">
                    <ShareButton spaceName={spaceName} contractId={contractId} token={token} onClick={(event) => handleShare(event, token)} />
                </div> */}
                {/* <div className="flex gap-2 items-center ml-auto ">

                    {!isMintingOver && <MintButton
                        styleOverride="btn btn-sm normal-case m-auto btn-ghost hover:bg-primary bg-gray-800 text-primary hover:text-black 
                                                                hover:rounded-xl rounded-3xl transition-all duration-300"
                        onClick={(event) => handleMint(event, token)}
                    />
                    }

                </div> */}

                <div className="w-full gap-2 flex flex-wrap items-center font-semibold text-sm text-t2">
                    <Avatar address={token.author} size={28} />
                    <AddressOrEns address={token.author} />
                    {parseInt(token.totalMinted) > 0 ? (
                        <span className="ml-auto text-t2 text-sm font-medium">
                            {compact_formatter.format(parseInt(token.totalMinted))} mints
                        </span>
                    ) : (
                        <span />
                    )}
                </div>

                <AdminWrapper admins={channel.managers.map(manager => { return { address: manager } })}>
                    <button onClick={(event) => handleManage(event, token)} className="btn btn-sm btn-ghost text-t2 w-fit ml-auto" >
                        <MdOutlineSettings className="h-6 w-6" />
                    </button>
                </AdminWrapper>


            </div>
        </div>
    )
}


export const Card = ({ token, footer, showTotalMints = true }: { token: ChannelToken | ChannelTokenV1 | ChannelTokenIntent, footer: React.ReactNode, showTotalMints?: boolean }) => {
    const [isActive, setIsActive] = useState(false);
    const isMobileDevice = isMobile();

    const { ref, inView } = useInView({
        threshold: 1,
    });

    useEffect(() => {
        if (inView && isMobileDevice) {
            setIsActive(true);
        }
    }, [inView, isMobileDevice]);

    return (
        <div ref={ref} className="relative flex flex-col gap-2 rounded-lg w-full p-2"
            onMouseEnter={() => !isMobileDevice && setIsActive(true)}
            onMouseLeave={() => !isMobileDevice && setIsActive(false)}
        >
            <CardRenderer cardProps={{
                author: token.author,
                totalMinted: showTotalMints ? token.totalMinted : '0',
                metadata: token.metadata,
                isActive: isActive
            }} />
            <div className="bg-base w-full h-0.5" />
            {footer}
        </div>

    )
}
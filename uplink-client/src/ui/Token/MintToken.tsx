"use client"

import { useSession } from "@/providers/SessionProvider";
import React, { useEffect } from "react";
import { Channel, ChannelToken, ChannelTokenIntent, ChannelTokenV1, concatContractID, doesChannelHaveFees, isTokenIntent, isTokenV2Onchain } from "@/types/channel";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { Address, maxUint40, parseEther } from "viem";
import { IInfiniteTransportConfig } from "@tx-kit/sdk";
import { useSponsorTokenWithETH, useMintTokenBatchWithETH } from "@tx-kit/hooks";
import { useMintTokenV1 } from "@/hooks/useMintTokenV1";
import { calculateSaleEnd, FeeStructure, isMintPeriodOver } from "./MintUtils";
import { DisplayMode, RenderDisplayWithProps } from "./MintableTokenDisplay";
import { usePaginatedMintBoardIntents, usePaginatedMintBoardPosts } from "@/hooks/useTokens";


export type MintTokenSwitchProps = {
    contractAddress: string,
    channel: Channel,
    token: ChannelToken | ChannelTokenIntent | ChannelTokenV1,
    referral: string,
    display: DisplayMode,
    setIsModalOpen?: (open: boolean) => void,
}


export const MintV1Onchain = ({
    contractAddress,
    channel,
    token,
    referral,
    setIsModalOpen,
    display
}: MintTokenSwitchProps) => {

    const _token = token as ChannelTokenV1

    const mintReferral = referral && referral.startsWith('0x') && referral.length === 42 ? referral : "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C";
    const { mintTokenV1, status: txStatus, txHash: txHash, error: txError } = useMintTokenV1(_token.contractAddress)
    const isTxPending = txStatus === "pendingApproval" || txStatus === "txInProgress";
    const isTxSuccessful = txStatus === "complete";
    const saleEnd = calculateSaleEnd(channel, _token)

    const fees: FeeStructure = {
        creatorPercentage: 43,
        channelPercentage: 14.25,
        referralPercentage: 14.25,
        sponsorPercentage: 14.25,
        uplinkPercentage: 14.25,
        ethMintPrice: _token.publicSalePrice === "0" ? parseEther("0.000777") : BigInt(_token.publicSalePrice)
    }

    const handleSubmit = (quantity: number) => {
        mintTokenV1({
            referral: mintReferral as Address,
            value: fees.ethMintPrice * BigInt(quantity),
            amount: BigInt(quantity)
        })
    }

    return <RenderDisplayWithProps
        displayMode={display}
        chainId={channel.chainId}
        creator={token.author}
        metadata={token.metadata} // todo type this
        fees={fees}
        isMintPeriodOver={isMintPeriodOver(saleEnd)}
        saleEnd={saleEnd}
        totalMinted={token.totalMinted}
        maxSupply={_token.maxSupply}
        handleSubmit={handleSubmit}
        isTxPending={isTxPending}
        isTxSuccessful={isTxSuccessful}
        txStatus={txStatus}
        txHash={txHash}
        setIsModalOpen={setIsModalOpen}
    />
}


export const MintV2Onchain = ({
    contractAddress,
    channel,
    token,
    referral,
    setIsModalOpen,
    display
}: MintTokenSwitchProps) => {

    const _token = token as ChannelToken

    const { data: session, status } = useSession();
    const mintReferral = referral && referral.startsWith('0x') && referral.length === 42 ? referral : "";
    const { mintPaginatedPost } = usePaginatedMintBoardPosts(concatContractID({ chainId: channel.chainId, contractAddress }))
    const { mintTokenBatchWithETH, status: txStatus, txHash: txHash, error: txError } = useMintTokenBatchWithETH()
    const isTxPending = txStatus === "pendingApproval" || txStatus === "txInProgress";
    const isTxSuccessful = txStatus === "complete";
    const saleEnd = calculateSaleEnd(channel, _token)

    const fees: FeeStructure = doesChannelHaveFees(channel) ? {
        creatorPercentage: channel.fees.fees.creatorPercentage,
        channelPercentage: channel.fees.fees.channelPercentage,
        referralPercentage: channel.fees.fees.mintReferralPercentage,
        sponsorPercentage: channel.fees.fees.sponsorPercentage,
        uplinkPercentage: channel.fees.fees.uplinkPercentage,
        ethMintPrice: BigInt(channel.fees.fees.ethMintPrice)
    } : null;

    const handleSubmit = async (quantity: number) => {
        await mintTokenBatchWithETH({
            channelAddress: contractAddress,
            to: session?.user?.address,
            tokenIds: [BigInt(_token.tokenId)],
            amounts: [quantity],
            mintReferral: mintReferral,
            data: "",
            ...(fees ? { transactionOverrides: { value: fees.ethMintPrice * BigInt(quantity) } } : {})
        })

        mintPaginatedPost(_token.tokenId, quantity.toString())
    }

    return <RenderDisplayWithProps
        displayMode={display}
        chainId={channel.chainId}
        creator={token.author}
        metadata={token.metadata} // todo type this
        fees={fees}
        isMintPeriodOver={isMintPeriodOver(saleEnd)}
        saleEnd={saleEnd}
        totalMinted={token.totalMinted}
        maxSupply={_token.maxSupply}
        handleSubmit={handleSubmit}
        isTxPending={isTxPending}
        isTxSuccessful={isTxSuccessful}
        txStatus={txStatus}
        txHash={txHash}
        setIsModalOpen={setIsModalOpen}
    />
}


export const MintV2Intent = ({
    contractAddress,
    channel,
    token,
    referral,
    setIsModalOpen,
    display
}: MintTokenSwitchProps) => {

    const _token = token as ChannelTokenIntent

    const { data: session, status } = useSession();
    const mintReferral = referral && referral.startsWith('0x') && referral.length === 42 ? referral : "";
    const contractId = concatContractID({ chainId: channel.chainId, contractAddress })
    const { triggerIntentSponsorship } = usePaginatedMintBoardIntents(contractId)
    const { receiveSponsorship } = usePaginatedMintBoardPosts(contractId)
    const { sponsorTokenWithETH, tokenId, status: txStatus, txHash: txHash, error: txError } = useSponsorTokenWithETH()
    const isTxPending = txStatus === "pendingApproval" || txStatus === "txInProgress";
    const isTxSuccessful = txStatus === "complete";



    useEffect(() => {
        if (isTxSuccessful && tokenId) {
            updateServerIntent(tokenId.toString())
        }
    }, [isTxSuccessful, tokenId])



    const saleEnd = calculateSaleEnd(channel, _token)

    const fees: FeeStructure = doesChannelHaveFees(channel) ? {
        creatorPercentage: channel.fees.fees.creatorPercentage,
        channelPercentage: channel.fees.fees.channelPercentage,
        referralPercentage: channel.fees.fees.mintReferralPercentage,
        sponsorPercentage: channel.fees.fees.sponsorPercentage,
        uplinkPercentage: channel.fees.fees.uplinkPercentage,
        ethMintPrice: BigInt(channel.fees.fees.ethMintPrice)
    } : null;



    const parseV2Response = async (response) => {
        if (!response.ok) {
            const { message } = await response.json()
            if (message === "UNAUTHORIZED") {
                return toast.error("You are not authorized to perform this action")
            }
        }
        else {
            return response.json()
        }
    }

    const updateServerIntent = async (sponsoredTokenId: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/fulfill_tokenIntent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": session?.csrfToken || "",
                },
                credentials: "include",
                body: JSON.stringify({
                    contractId: contractId,
                    tokenIntentId: _token.id,
                    tokenId: sponsoredTokenId,
                })
            })
                .then(parseV2Response)
                .then(res => {
                    if (res.success) {
                        return toast.success('Token Minted')
                    }
                })
        } catch (e) {
            console.log(e)
            return toast.error("Something went wrong")
        }
    }

    const handleSubmit = async (quantity: number) => {

        await sponsorTokenWithETH({
            channelAddress: contractAddress,
            sponsoredToken: _token,
            to: session?.user?.address as Address,
            amount: quantity,
            mintReferral: mintReferral,
            data: "",
            ...(fees ? { transactionOverrides: { value: fees.ethMintPrice * BigInt(quantity) } } : {})
        }).then(async (response) => {
            if (response) {
                await updateServerIntent(response.tokenId.toString())
                triggerIntentSponsorship(_token.id, quantity.toString())
                receiveSponsorship()
            }
        })

    }

    return <RenderDisplayWithProps
        displayMode={display}
        chainId={channel.chainId}
        creator={token.author}
        metadata={token.metadata} // todo type this
        fees={fees}
        isMintPeriodOver={isMintPeriodOver(saleEnd)}
        saleEnd={saleEnd}
        totalMinted={token.totalMinted}
        maxSupply={_token.intent.message.maxSupply.toString()}
        handleSubmit={handleSubmit}
        isTxPending={isTxPending}
        isTxSuccessful={isTxSuccessful}
        txStatus={txStatus}
        txHash={txHash}
        setIsModalOpen={setIsModalOpen}
    />
}



export const MintTokenSwitch = ({
    token,
    channel,
    contractAddress,
    referral,
    setIsModalOpen,
    display
}: MintTokenSwitchProps) => {

    if (isTokenIntent(token)) {
        return <MintV2Intent
            contractAddress={contractAddress}
            channel={channel}
            token={token as ChannelTokenIntent}
            referral={referral}
            setIsModalOpen={setIsModalOpen}
            display={display}
        />
    }

    else if (isTokenV2Onchain(token)) {
        return <MintV2Onchain
            contractAddress={contractAddress}
            channel={channel}
            token={token as ChannelToken}
            referral={referral}
            setIsModalOpen={setIsModalOpen}
            display={display}
        />
    }

    else return <MintV1Onchain
        contractAddress={contractAddress}
        channel={channel}
        token={token as ChannelTokenV1}
        referral={referral}
        setIsModalOpen={setIsModalOpen}
        display={display}
    />

}
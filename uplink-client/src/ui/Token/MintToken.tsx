"use client"

import { useSession } from "@/providers/SessionProvider";
import React, { useEffect } from "react";
import { Channel, ChannelToken, ChannelTokenIntent, ChannelTokenV1, concatContractID, doesChannelHaveFees, isTokenIntent, isTokenV2Onchain } from "@/types/channel";
import { useAccount, useWalletClient } from "wagmi";
import toast from "react-hot-toast";
import { Address, Chain, erc20Abi, maxUint40, parseEther, zeroAddress } from "viem";
import { IInfiniteTransportConfig, NATIVE_TOKEN } from "@tx-kit/sdk";
import { useSponsorTokenWithETH, useMintTokenBatchWithETH, useApproveERC20 } from "@tx-kit/hooks";
import { useMintTokenV1 } from "@/hooks/useMintTokenV1";
import { calculateSaleEnd, FeeStructure, isMintPeriodOver } from "./MintUtils";
import { DisplayMode, RenderDisplayWithProps } from "./MintableTokenDisplay";
import { usePaginatedMintBoardIntents, usePaginatedMintBoardPosts } from "@/hooks/useTokens";
import { handleV2MutationError } from "@/lib/fetch/handleV2MutationError";
import { useMintTokenBatchWithERC20 } from "@tx-kit/hooks/dist/token";
import { baseSepolia } from "viem/chains";
import { useCombinedMinter } from "@/hooks/useCombinedMinter";


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
        ethMintPrice: _token.publicSalePrice === "0" ? parseEther("0.000777") : BigInt(_token.publicSalePrice),
        erc20MintPrice: BigInt(0),
        erc20Contract: zeroAddress
    }

    const handleSubmit = (quantity: number, mintToken: Address) => {
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
        metadata={token.metadata}
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
    const combinedMinterResponse = useCombinedMinter({ contractAddress, channel, token, mintReferral })

    // const txStatus = ethTxStatus || erc20TxStatus || approveErc20TxStatus
    // const isTxPending = txStatus === "pendingApproval" || txStatus === "txInProgress";
    // const isTxSuccessful = txStatus === "complete";

    const saleEnd = calculateSaleEnd(channel, _token)

    const handleSubmit = async (quantity: number, mintToken: Address) => {
        combinedMinterResponse.mint(quantity, mintToken).then(() => {
            mintPaginatedPost(_token.tokenId, quantity.toString())
        })
    }

    return <RenderDisplayWithProps
        displayMode={display}
        chainId={channel.chainId}
        creator={token.author}
        metadata={token.metadata}
        fees={combinedMinterResponse.fees}
        isMintPeriodOver={isMintPeriodOver(saleEnd)}
        saleEnd={saleEnd}
        totalMinted={token.totalMinted}
        maxSupply={_token.maxSupply}
        handleSubmit={handleSubmit}
        isTxPending={combinedMinterResponse.isTxPending}
        isTxSuccessful={combinedMinterResponse.isTxSuccessful}
        txStatus={combinedMinterResponse.txStatus}
        txHash={combinedMinterResponse.txHash}
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

    const saleEnd = calculateSaleEnd(channel, _token)

    const fees: FeeStructure = doesChannelHaveFees(channel) ? {
        creatorPercentage: channel.fees.fees.creatorPercentage,
        channelPercentage: channel.fees.fees.channelPercentage,
        referralPercentage: channel.fees.fees.mintReferralPercentage,
        sponsorPercentage: channel.fees.fees.sponsorPercentage,
        uplinkPercentage: channel.fees.fees.uplinkPercentage,
        ethMintPrice: BigInt(channel.fees.fees.ethMintPrice),
        erc20MintPrice: BigInt(channel.fees.fees.erc20MintPrice),
        erc20Contract: channel.fees.fees.erc20Contract
    } : null;


    useEffect(() => {
        if (isTxSuccessful && txHash) {
            updateServerIntent()
        }
    }, [txHash, isTxSuccessful])



    const updateServerIntent = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/fulfill_tokenIntent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": session?.csrfToken || "",
                },
                body: JSON.stringify({
                    contractId: contractId,
                    txHash: txHash,
                    tokenIntentId: _token.id
                })
            })
                .then(handleV2MutationError)
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

    const handleSubmit = async (quantity: number, mintToken: Address) => {

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
                triggerIntentSponsorship(_token.id, quantity.toString())
                receiveSponsorship()
            }
        })

    }

    return <RenderDisplayWithProps
        displayMode={display}
        chainId={channel.chainId}
        creator={token.author}
        metadata={token.metadata}
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
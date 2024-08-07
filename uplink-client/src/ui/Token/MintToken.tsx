"use client"

import { useSession } from "@/providers/SessionProvider";
import React, { useEffect, useMemo, useState } from "react";
import { Channel, ChannelToken, ChannelTokenIntent, ChannelTokenV1, concatContractID, doesChannelHaveFees, isTokenIntent, isTokenV2Onchain } from "@/types/channel";
import { useAccount, useChainId, useWalletClient } from "wagmi";
import toast from "react-hot-toast";
import { Address, Chain, erc20Abi, maxUint40, parseEther, zeroAddress } from "viem";
import { IInfiniteTransportConfig, NATIVE_TOKEN } from "@tx-kit/sdk";
import { useSponsorTokenWithETH, useMintTokenBatchWithETH, useApproveERC20, useMintTokenBatchWithERC20, useSponsorTokenWithERC20 } from "@tx-kit/hooks";
import { useMintTokenV1 } from "@/hooks/useMintTokenV1";
import { calculateSaleEnd, FeeStructure, isMintPeriodOver, ShareModalContent } from "./MintUtils";
import { DisplayMode, RenderDisplayWithProps } from "./MintableTokenDisplay";
import { usePaginatedMintBoardIntents, usePaginatedMintBoardPosts } from "@/hooks/useTokens";
import { handleV2MutationError } from "@/lib/fetch/handleV2MutationError";
import { useTransmissionsErrorHandler } from "@/hooks/useTransmissionsErrorHandler";
import { useCapabilities } from "wagmi/experimental";



export type MintTokenSwitchProps = {
    contractAddress: string,
    channel: Channel,
    token: ChannelToken | ChannelTokenIntent | ChannelTokenV1,
    referral: string,
    display: DisplayMode,
    setIsModalOpen?: (open: boolean) => void,
    backwardsNavUrl?: string
}


export const MintV1Onchain = ({
    contractAddress,
    channel,
    token,
    referral,
    setIsModalOpen,
    display,
    backwardsNavUrl
}: MintTokenSwitchProps) => {

    const _token = token as ChannelTokenV1

    const mintReferral = referral && referral.startsWith('0x') && referral.length === 42 ? referral : "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C";
    const { mintTokenV1, status: txStatus, txHash: txHash, error: txError } = useMintTokenV1(_token.contractAddress)
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)

    const isTxPending = txStatus === "pendingApproval" || txStatus === "txInProgress";
    const isTxSuccessful = txStatus === "complete";
    const saleEnd = calculateSaleEnd(channel, _token)

    useTransmissionsErrorHandler(txError)

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

    return (
        <>
            <RenderDisplayWithProps
                token={_token}
                displayMode={display}
                chainId={channel.chainId}
                creator={token.author}
                metadata={token.metadata}
                fees={fees}
                mintToken={NATIVE_TOKEN}
                setMintToken={() => { }}
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
                handleShare={() => setIsShareModalOpen(true)}
                backwardsNavUrl={backwardsNavUrl}
            />
            <ShareModal displayMode={display} token={_token} isShareModalOpen={isShareModalOpen} setIsShareModalOpen={setIsShareModalOpen} />
        </>
    )
}


export const MintV2Onchain = ({
    contractAddress,
    channel,
    token,
    referral,
    setIsModalOpen,
    display,
    backwardsNavUrl
}: MintTokenSwitchProps) => {

    const _token = token as ChannelToken
    const chainId = useChainId()
    const { data: walletClient } = useWalletClient();
    const mintReferral = referral && referral.startsWith('0x') && referral.length === 42 ? referral : "";
    const { mintPaginatedPost } = usePaginatedMintBoardPosts(concatContractID({ chainId: channel.chainId, contractAddress }))
    const { mintTokenBatchWithETH, status: ethTxStatus, txHash: ethTxHash, error: ethTxError } = useMintTokenBatchWithETH()
    const { mintTokenBatchWithERC20, mintTokenBatchWithERC20_smartWallet, status: erc20TxStatus, txHash: erc20TxHash, error: erc20TxError } = useMintTokenBatchWithERC20()

    const capabilities = useCapabilities()
    const isSmartWallet = capabilities?.[chainId]?.atomicBatch?.supported ?? false
    const erc20Minter = isSmartWallet ? mintTokenBatchWithERC20_smartWallet : mintTokenBatchWithERC20

    const [isShareModalOpen, setIsShareModalOpen] = useState(false)

    const [mintToken, setMintToken] = useState<Address>(NATIVE_TOKEN)
    const isCurrencyEth = mintToken === NATIVE_TOKEN

    const txStatus = isCurrencyEth ? ethTxStatus : erc20TxStatus
    const isTxPending = txStatus === "pendingApproval" || txStatus === "txInProgress" || txStatus === "erc20ApprovalInProgress";
    const isTxSuccessful = txStatus === "complete";
    const txHash = isCurrencyEth ? ethTxHash : erc20TxHash
    const txError = isCurrencyEth ? ethTxError : erc20TxError

    useTransmissionsErrorHandler(txError)


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

    const saleEnd = calculateSaleEnd(channel, _token)

    const handleSubmit = async (quantity: number, mintToken: Address) => {
        if (mintToken === NATIVE_TOKEN) {
            await mintTokenBatchWithETH({
                channelAddress: contractAddress,
                to: walletClient.account.address,
                tokenIds: [BigInt(_token.tokenId)],
                amounts: [quantity],
                mintReferral: mintReferral,
                data: "",
                ...(fees ? { transactionOverrides: { value: fees.ethMintPrice * BigInt(quantity) } } : {})
            })
        } else {

            await erc20Minter({
                channelAddress: contractAddress,
                to: walletClient.account.address,
                tokenIds: [BigInt(_token.tokenId)],
                amounts: [quantity],
                mintReferral: mintReferral,
                data: "",
            },
                mintToken,
                fees.erc20MintPrice * BigInt(quantity)
            )
        }

        mintPaginatedPost(_token.tokenId, quantity.toString())
    }

    return (
        <>
            <RenderDisplayWithProps
                token={_token}
                displayMode={display}
                chainId={channel.chainId}
                creator={token.author}
                metadata={token.metadata}
                fees={fees}
                mintToken={mintToken}
                setMintToken={setMintToken}
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
                handleShare={() => setIsShareModalOpen(true)}
                backwardsNavUrl={backwardsNavUrl}
            />
            <ShareModal displayMode={display} token={_token} isShareModalOpen={isShareModalOpen} setIsShareModalOpen={setIsShareModalOpen} />
        </>
    )
}


export const MintV2Intent = ({
    contractAddress,
    channel,
    token,
    referral,
    setIsModalOpen,
    display,
    backwardsNavUrl
}: MintTokenSwitchProps) => {

    const _token = token as ChannelTokenIntent
    const chainId = useChainId()
    const { data: session, status } = useSession();
    const mintReferral = referral && referral.startsWith('0x') && referral.length === 42 ? referral : "";
    const contractId = concatContractID({ chainId: channel.chainId, contractAddress })
    const { triggerIntentSponsorship } = usePaginatedMintBoardIntents(contractId)
    const { receiveSponsorship } = usePaginatedMintBoardPosts(contractId)
    const { sponsorTokenWithETH, status: ethTxStatus, txHash: ethTxHash, error: ethTxError } = useSponsorTokenWithETH()
    const { sponsorTokenWithERC20, sponsorTokenWithERC20_smartWallet, status: erc20TxStatus, txHash: erc20TxHash, error: erc20TxError } = useSponsorTokenWithERC20()
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)

    const capabilities = useCapabilities()
    const isSmartWallet = capabilities?.[chainId]?.atomicBatch?.supported ?? false
    const erc20Minter = isSmartWallet ? sponsorTokenWithERC20_smartWallet : sponsorTokenWithERC20

    const [mintToken, setMintToken] = useState<Address>(NATIVE_TOKEN)
    const isCurrencyEth = mintToken === NATIVE_TOKEN

    const txStatus = isCurrencyEth ? ethTxStatus : erc20TxStatus
    const isTxPending = txStatus === "pendingApproval" || txStatus === "txInProgress" || txStatus === "erc20ApprovalInProgress";
    const isTxSuccessful = txStatus === "complete";
    const txHash = isCurrencyEth ? ethTxHash : erc20TxHash
    const txError = isCurrencyEth ? ethTxError : erc20TxError

    useTransmissionsErrorHandler(txError)

    useEffect(() => {
        console.log(ethTxError, erc20TxError)
    }, [ethTxError, erc20TxError])


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

        if (mintToken === NATIVE_TOKEN) {

            await sponsorTokenWithETH({
                channelAddress: contractAddress,
                sponsoredToken: _token,
                to: session?.user?.address,
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

        } else {
            await erc20Minter({
                channelAddress: contractAddress,
                sponsoredToken: _token,
                to: session?.user?.address,
                amount: quantity,
                mintReferral: mintReferral,
                data: "",
            },
                mintToken,
                fees.erc20MintPrice * BigInt(quantity)
            ).then(async (response) => {
                if (response) {
                    triggerIntentSponsorship(_token.id, quantity.toString())
                    receiveSponsorship()
                }
            })

        }

    }

    return (
        <>
            <RenderDisplayWithProps
                token={_token}
                displayMode={display}
                chainId={channel.chainId}
                creator={token.author}
                metadata={token.metadata}
                fees={fees}
                mintToken={mintToken}
                setMintToken={setMintToken}
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
                handleShare={() => setIsShareModalOpen(true)}
                backwardsNavUrl={backwardsNavUrl}
            />
            <ShareModal displayMode={display} token={_token} isShareModalOpen={isShareModalOpen} setIsShareModalOpen={setIsShareModalOpen} />
        </>
    )
}



export const ShareModal = ({ displayMode, token, isShareModalOpen, setIsShareModalOpen }: { displayMode: DisplayMode, token: ChannelTokenV1 | ChannelToken | ChannelTokenIntent, isShareModalOpen: boolean, setIsShareModalOpen: (val: boolean) => void }) => {

    if (isShareModalOpen) {
        return (
            <div className="modal modal-open flex-col lg:flex-row-reverse gap-4 bg-black bg-opacity-80 transition-colors duration-300 ease-in-out">
                <div
                    className="modal-box bg-[#1A1B1F] bg-gradient-to-r from-[#e0e8ff0a] to-[#e0e8ff0a] border border-[#ffffff14] max-w-xl animate-springUp"
                >
                    <ShareModalContent displayMode={displayMode} token={token} handleClose={() => setIsShareModalOpen(false)} />
                </div>
            </div>
        );
    }
}


export const MintTokenSwitch = ({
    token,
    channel,
    contractAddress,
    referral,
    setIsModalOpen,
    display,
    backwardsNavUrl
}: MintTokenSwitchProps) => {

    if (isTokenIntent(token)) {
        return <MintV2Intent
            contractAddress={contractAddress}
            channel={channel}
            token={token as ChannelTokenIntent}
            referral={referral}
            setIsModalOpen={setIsModalOpen}
            display={display}
            backwardsNavUrl={backwardsNavUrl}
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
            backwardsNavUrl={backwardsNavUrl}
        />
    }

    else return <MintV1Onchain
        contractAddress={contractAddress}
        channel={channel}
        token={token as ChannelTokenV1}
        referral={referral}
        setIsModalOpen={setIsModalOpen}
        display={display}
        backwardsNavUrl={backwardsNavUrl}
    />

}
"use client";

// helper hook for minting or sponsoring with ERC20 or ETH

import { Channel, ChannelToken, ChannelTokenIntent, ChannelTokenV1, doesChannelHaveFees, isTokenIntent, isTokenV1Onchain, isTokenV2Onchain } from "@/types/channel";
import { FeeStructure } from "@/ui/Token/MintUtils";
import { useMintTokenV1 } from "./useMintTokenV1";
import { useApproveERC20, useMintTokenBatchWithETH } from "@tx-kit/hooks";
import { useMintTokenBatchWithERC20 } from "@tx-kit/hooks/dist/token";
import { Address, zeroAddress } from "viem";
import { NATIVE_TOKEN } from "@tx-kit/sdk";
import { useWalletClient } from "wagmi";
import { useEffect, useState } from "react";

export type CombinedMinterProps = {
    channel: Channel;
    token: ChannelToken | ChannelTokenIntent | ChannelTokenV1;
    contractAddress: string;
    mintReferral: string;
}

export type CombinedMinterResponse = {
    txHash: string;
    txStatus: string;
    isTxPending: boolean;
    isTxSuccessful: boolean;
    txError: string;
    fees: FeeStructure;
    mint: (quantity: number, mintToken: Address) => Promise<void>;
}

export const useCombinedMinter = (props: CombinedMinterProps): CombinedMinterResponse => {
    const { mintTokenV1, status: v1TxStatus, txHash: v1TxHash, error: v1TxError } = useMintTokenV1(props.contractAddress)
    const { mintTokenBatchWithETH, status: ethTxStatus, txHash: ethTxHash, error: ethTxError } = useMintTokenBatchWithETH()
    const { mintTokenBatchWithERC20, status: erc20TxStatus, txHash: erc20TxHash, error: erc20TxError } = useMintTokenBatchWithERC20()
    const { approveERC20, status: approveErc20TxStatus, txHash: approveErc20TxHash, error: approveErc20TxError } = useApproveERC20()
    const [txHash, setTxHash] = useState<string>("")
    const [txStatus, setTxStatus] = useState<string>("")
    const [txError, setTxError] = useState<string>("")

    useEffect(() => {
        console.log(approveErc20TxStatus)
    }, [approveErc20TxStatus])

    const { data: walletClient } = useWalletClient()

    const fees: FeeStructure = doesChannelHaveFees(props.channel) ? {
        creatorPercentage: props.channel.fees.fees.creatorPercentage,
        channelPercentage: props.channel.fees.fees.channelPercentage,
        referralPercentage: props.channel.fees.fees.mintReferralPercentage,
        sponsorPercentage: props.channel.fees.fees.sponsorPercentage,
        uplinkPercentage: props.channel.fees.fees.uplinkPercentage,
        ethMintPrice: BigInt(props.channel.fees.fees.ethMintPrice),
        erc20MintPrice: BigInt(props.channel.fees.fees.erc20MintPrice),
        erc20Contract: props.channel.fees.fees.erc20Contract
    } : null;


    if (isTokenV1Onchain(props.token)) {
        const token = props.token as ChannelTokenV1

        return {
            txHash: "",
            txStatus: "",
            txError: "",
            isTxPending: false,
            isTxSuccessful: false,
            fees: fees ? { ...fees, erc20Contract: zeroAddress, erc20MintPrice: BigInt(0) } : null, // zora tokens don't have erc20 minting
            mint: async () => { },
        }
    }

    else if (isTokenV2Onchain(props.token)) {

        const token = props.token as ChannelToken
        const txStatus = erc20TxStatus === "complete" ? ethTxStatus : erc20TxStatus
        const isTxSuccessful = txStatus === "complete"

        const mint = async (quantity: number, mintToken: Address) => {
            if (mintToken === NATIVE_TOKEN) {
                setTxHash(ethTxHash)
                await mintTokenBatchWithETH({
                    channelAddress: props.contractAddress,
                    to: walletClient.account.address,
                    tokenIds: [BigInt(token.tokenId)],
                    amounts: [quantity],
                    mintReferral: props.mintReferral,
                    data: "",
                    ...(fees ? { transactionOverrides: { value: fees.ethMintPrice * BigInt(quantity) } } : {})
                })
            } else {
                setTxStatus(approveErc20TxStatus)
                await approveERC20({
                    erc20Contract: mintToken,
                    spender: props.contractAddress,
                    amount: fees.erc20MintPrice * BigInt(quantity)
                })

                await mintTokenBatchWithERC20({
                    channelAddress: props.contractAddress,
                    to: walletClient.account.address,
                    tokenIds: [BigInt(token.tokenId)],
                    amounts: [quantity],
                    mintReferral: props.mintReferral,
                    data: ""
                })
            }
        }

        return {
            txHash: ethTxHash || erc20TxHash,
            txStatus,
            isTxPending: txStatus === "pendingApproval" || txStatus === "txInProgress",
            isTxSuccessful,
            txError: ethTxError || erc20TxError,
            fees,
            mint,
        }
    }

    else if (isTokenIntent(props.token)) {
        const token = props.token as ChannelTokenIntent
        return {
            txHash: "",
            txStatus: "",
            isTxPending: false,
            isTxSuccessful: false,
            txError: "",
            fees,
            mint: async () => { },
        }
    }

}
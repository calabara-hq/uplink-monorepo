import { Address, decodeEventLog, erc20Abi } from 'viem'
import { useCallback, useContext, useState } from 'react'
import {
    MintTokenBatchConfig
} from '@tx-kit/sdk'
import {
    infiniteChannelAbi,
    finiteChannelAbi,
} from '@tx-kit/sdk/abi'

import { useTransmissionsClient } from '@tx-kit/hooks'
import { useChainId, usePublicClient, useWalletClient } from 'wagmi'

export type TwoStepExecutionStatus = "pendingApproval" | "erc20ApprovalInProgress" | "txInProgress" | "complete" | "error"

export const useMintTokenBatchWithERC20TwoStep = () => {

    const chainId = useChainId();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

    const transmissionsClient = useTransmissionsClient({
        chainId: chainId,
        walletClient: walletClient,
        publicClient: publicClient,
    }).uplinkClient


    const [status, setStatus] = useState<TwoStepExecutionStatus>()
    const [txHash, setTxHash] = useState<string>()
    const [error, setError] = useState<any>()

    const mintTokenBatchWithERC20 = useCallback(
        async (args: MintTokenBatchConfig, erc20Contract: Address, erc20AmountRequired: bigint) => {
            if (!transmissionsClient) throw new Error('Invalid transmissions client')
            try {
                setStatus('pendingApproval')
                setError(undefined)
                setTxHash(undefined)


                // read the users current token balance -- TODO

                // read the users current allowance for the token

                const allowance = await publicClient.readContract({
                    address: erc20Contract,
                    abi: erc20Abi,
                    functionName: 'allowance',
                    args: [args.to as Address, args.channelAddress as Address],
                })

                // if the allowance is less than the mint price, send an approval request

                if (allowance < erc20AmountRequired) {
                    setStatus('erc20ApprovalInProgress')
                    const { txHash: hash } =
                        await transmissionsClient.submitApproveERC20Transaction({
                            erc20Contract,
                            spender: args.channelAddress as Address,
                            amount: erc20AmountRequired * BigInt(20), // 20x the amount required for better UX on future mints
                        })


                    const events = await transmissionsClient.getTransactionEvents({
                        txHash: hash,
                        eventTopics: transmissionsClient.eventTopics.erc20Approved
                    })


                    const event = events?.[0]
                    const decodedLog = event
                        ? decodeEventLog({
                            abi: erc20Abi,
                            data: event.data,
                            // @ts-ignore
                            topics: event.topics,
                        })
                        : undefined

                    // @ts-ignore
                    if (decodedLog?.eventName !== 'Approval') {
                        setStatus('error')
                        throw new Error('Approval failed')
                    }
                }

                // mint the token

                setStatus('txInProgress')

                const { txHash: hash } = await transmissionsClient.submitMintTokenBatchWithERC20Transaction(args)

                setTxHash(hash)

                const events = await transmissionsClient.getTransactionEvents({
                    txHash: hash,
                    eventTopics: transmissionsClient.eventTopics.tokenMinted,
                })

                const event = events?.[0]
                const decodedLog = event
                    ? decodeEventLog({
                        abi: [...infiniteChannelAbi, ...finiteChannelAbi],
                        data: event.data,
                        // @ts-ignore
                        topics: event.topics,
                    })
                    : undefined

                // @ts-ignore
                if (decodedLog?.eventName === 'TokenMinted') {
                    setStatus('complete')
                }

                return events
            } catch (e) {
                setStatus('error')
                setError(e)
            }
        },
        [transmissionsClient],
    )

    return { mintTokenBatchWithERC20, status, txHash, error }
}
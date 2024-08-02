import { Address, decodeEventLog, erc20Abi, Hash, Hex, MulticallContracts, zeroAddress } from 'viem'
import { useCallback, useContext, useState } from 'react'
import {
    MintTokenBatchConfig
} from '@tx-kit/sdk'
import {
    infiniteChannelAbi,
    finiteChannelAbi,
} from '@tx-kit/sdk/abi'

import { useTransmissionsClient, TransmissionsContext } from '@tx-kit/hooks'
import { useAccount, useChainId, usePublicClient, useWalletClient } from 'wagmi'
import { useCapabilities } from 'wagmi/experimental'
import { walletActionsEip5792 } from 'viem/experimental'
export type TwoStepExecutionStatus = "pendingApproval" | "erc20ApprovalInProgress" | "txInProgress" | "complete" | "error"

export const useMintTokenBatchWithERC20TwoStep = () => {

    const { chain } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();
    const { data: capabilities } = useCapabilities();

    const isAtomicBatchSupported = capabilities?.[chain.id]?.atomicBatch?.supported ?? false

    const { uplinkClient } = useContext(TransmissionsContext).transmissionsClient

    const [status, setStatus] = useState<TwoStepExecutionStatus>()
    const [txHash, setTxHash] = useState<string>()
    const [error, setError] = useState<any>()


    const mintTokenBatchWithERC20AtomicBatch = useCallback(

        async (args: MintTokenBatchConfig, erc20Contract: Address, erc20AmountRequired: bigint) => {

            if (!uplinkClient) throw new Error('Invalid transmissions client')

            try {
                setStatus('pendingApproval')
                setError(undefined)
                setTxHash(undefined)

                // read the users current allowance for the token

                const allowance = await publicClient.readContract({
                    address: erc20Contract,
                    abi: erc20Abi,
                    functionName: 'allowance',
                    args: [args.to as Address, args.channelAddress as Address],
                })

                // if the allowance is less than the mint price, send an approval request

                if (allowance < erc20AmountRequired) {

                    setStatus('txInProgress')

                    const eip5792WalletClient = walletClient.extend(walletActionsEip5792())

                    const id = await eip5792WalletClient.writeContracts({
                        account: eip5792WalletClient.account,
                        chain: chain,
                        // @ts-ignore
                        contracts: [
                            {
                                address: erc20Contract,
                                abi: erc20Abi,
                                functionName: 'approve',
                                args: [args.channelAddress as Address, erc20AmountRequired * BigInt(20)]
                            },
                            // todo: do some validation / checks here from sdk
                            {
                                address: args.channelAddress as Address,
                                abi: [...infiniteChannelAbi, ...finiteChannelAbi],
                                functionName: 'mintBatchWithERC20',
                                args: [
                                    args.to as Address,
                                    args.tokenIds,
                                    args.amounts.map(a => BigInt(a)),
                                    args.mintReferral as Address || zeroAddress,
                                    args.data as Hex
                                ]
                            }

                        ],

                        capabilities: {
                            paymasterService: {
                                paymasterUrl: `${process.env.NEXT_PUBLIC_HUB_URL}/v2/paymaster_proxy`
                            }
                        }
                    })

                    const events = await uplinkClient.getTransactionEvents({
                        txHash: id as Hash,
                        eventTopics: uplinkClient.eventTopics.tokenMinted,
                    })

                    const event = events?.[0]

                    setTxHash(event.transactionHash)

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

                    setStatus("complete")

                }

                else {

                    // mint the token directly

                    setStatus('txInProgress')

                    const { txHash: hash } = await uplinkClient.submitMintTokenBatchWithERC20Transaction(args)

                    const events = await uplinkClient.getTransactionEvents({
                        txHash: hash,
                        eventTopics: uplinkClient.eventTopics.tokenMinted,
                    })

                    const event = events?.[0]

                    setTxHash(event.transactionHash)

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
                }

            } catch (e) {
                setStatus('error')
                setError(e)
            }
        },
        [uplinkClient],
    )




    const mintTokenBatchWithERC20TwoStep = useCallback(
        async (args: MintTokenBatchConfig, erc20Contract: Address, erc20AmountRequired: bigint) => {
            if (!uplinkClient) throw new Error('Invalid transmissions client')
            try {
                setStatus('pendingApproval')
                setError(undefined)
                setTxHash(undefined)

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
                        await uplinkClient.submitApproveERC20Transaction({
                            erc20Contract,
                            spender: args.channelAddress as Address,
                            amount: erc20AmountRequired * BigInt(20), // 20x the amount required for better UX on future mints
                        })


                    const events = await uplinkClient.getTransactionEvents({
                        txHash: hash,
                        eventTopics: uplinkClient.eventTopics.erc20Approved
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

                const { txHash: hash } = await uplinkClient.submitMintTokenBatchWithERC20Transaction(args)

                setTxHash(hash)

                const events = await uplinkClient.getTransactionEvents({
                    txHash: hash,
                    eventTopics: uplinkClient.eventTopics.tokenMinted,
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
        [uplinkClient],
    )

    return {
        mintTokenBatchWithERC20: isAtomicBatchSupported ? mintTokenBatchWithERC20AtomicBatch : mintTokenBatchWithERC20TwoStep,
        status,
        txHash,
        error
    }
}
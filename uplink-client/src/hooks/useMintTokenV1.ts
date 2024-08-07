import { ZoraAbi } from "@/lib/abi/zoraEdition";
import { useCallback, useState } from "react"
import { Address, decodeEventLog, Hash, Hex, Log, parseEther } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";


export type MintTokenV1Config = {
    amount: bigint;
    referral: Address;
    value: bigint;
}

type ContractExecutionStatus = "pendingApproval" | "txInProgress" | "complete" | "error"



export const useMintTokenV1 = (contractAddress: string) => {

    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();


    const [status, setStatus] = useState<ContractExecutionStatus>()
    const [txHash, setTxHash] = useState<string>()
    const [error, setError] = useState()


    const reset = () => {
        setStatus(undefined)
        setTxHash(undefined)
    }

    const mintTokenV1 = useCallback(
        async (args: MintTokenV1Config) => {

            try {

                setStatus('pendingApproval')
                setError(undefined)
                setTxHash(undefined)

                const { request } = await publicClient.simulateContract({
                    address: contractAddress as Address,
                    account: walletClient.account,
                    abi: ZoraAbi,
                    functionName: 'mintWithRewards',
                    args: [
                        walletClient.account.address,
                        args.amount,
                        "",
                        args.referral
                    ],
                    value: args.value
                })


                const _txHash = await walletClient.writeContract(request)

                setStatus('txInProgress')
                setTxHash(_txHash)

                const transaction = await publicClient.waitForTransactionReceipt({ hash: _txHash })

                if (transaction.status === 'success') {
                    setStatus("complete")
                }

            } catch (e) {
                console.error(e)
                setStatus('error')
                setError(e)
                reset()
            }

        }, [contractAddress, walletClient]
    )

    return { mintTokenV1, status, txHash, error }

}
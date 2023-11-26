"use client"
import useMe from "@/hooks/useMe"
import { ZoraAbi, getContractFromEnv } from "@/lib/abi/zoraEdition";
import { getChainName } from "@/lib/chains/supportedChains";
import { TokenContractApi } from "@/lib/contract";
import { useSession } from "@/providers/SessionProvider";
import { ChainLabel } from "@/ui/ContestLabels/ContestLabels";
import { UserSubmissionDisplay } from "@/ui/Submission/SubmissionDisplay";
import { useEffect, useState } from "react";
import { Decimal } from 'decimal.js'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import toast from "react-hot-toast";
import { TbLoader2 } from "react-icons/tb";
import Link from "next/link";
import { SwitchNetworkButton } from "@/ui/Zora/common";
import { Submission } from "@/types/submission";
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import { User } from "@/types/user";

export const ManageAccountButton = ({ }) => {

}

export const UserSubmissions = ({ accountAddress, isMintableOnly }: { accountAddress: string, isMintableOnly: boolean }) => {
    const { me, isMeLoading, isMeError } = useMe(accountAddress);
    console.log('IS MINTABLE ONLY', isMintableOnly)
    const filteredSubs = isMintableOnly ? me.submissions.filter((el: Submission) => el.nftDrop) : me.submissions

    const user: User = {
        ...me,
        submissions: filteredSubs
    }

    return <UserSubmissionDisplay user={user} />
}

const useClaimableBalance = (chainId: number, contractAddress: string) => {
    const [balance, setBalance] = useState<string | null>(null);
    const [triggerRefresh, setTriggerRefresh] = useState(0);
    const { data: session, status } = useSession();
    const tokenApi = new TokenContractApi(chainId);

    const getBalance = (userAddress: string) => {
        tokenApi.zoraGetRewardBalance({ contractAddress, userAddress }).then(balance => {
            console.log('balance is', balance)
            setBalance(balance.toString());
        })
    }

    useEffect(() => {
        if (session?.user?.address) {
            getBalance(session?.user?.address)
        }

    }, [session?.user?.address, triggerRefresh])

    return {
        balance,
        isLoading: balance === null,
        triggerRefresh: () => {
            setTriggerRefresh(triggerRefresh + 1)
        }
    }
}

export const ClaimableUserRewards = ({ accountAddress }: { accountAddress: string }) => {
    const { me, isUserAuthorized, isMeLoading, isMeError } = useMe(accountAddress);
    const { data: session, status } = useSession();
    const { rewards_contract, chainId } = getContractFromEnv();
    const { balance, isLoading: isBalanceLoading, triggerRefresh } = useClaimableBalance(chainId, rewards_contract)



    const { config, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
        chainId: chainId,
        address: rewards_contract,
        abi: ZoraAbi,
        functionName: 'withdraw',
        args: [session?.user?.address, BigInt(balance || '0')],
        enabled: true,
    });

    const isInsufficientFundsError = isPrepareError ? prepareError.message.includes("insufficient funds for gas * price + value") : false;

    const {
        data,
        write,
        isLoading: isWriteLoading,
        error: writeError,
        isError: isWriteError
    } = useContractWrite({
        ...config,
        onError(err) {
            if (err.message.includes("User rejected the request")) {
                toast.error("Signature request rejected")
            }
        }
    });

    const { isLoading: isTxPending, isSuccess: isTxSuccessful } = useWaitForTransaction({
        hash: data?.hash,
        onSettled: (data, err) => {
            if (err) {
                console.log(err)
                return toast.error('Error claiming rewards')
            }
            if (data) {
                toast.success('Successfully claimed your rewards')
            }
        },

    });

    useEffect(() => {
        if (isTxSuccessful) {
            triggerRefresh();
        }
    }, [isTxSuccessful])

    if (isMeLoading) return <p>loading</p>
    if (!isUserAuthorized) return null

    else return (
        <div className="flex flex-col bg-base-100 h-40 w-fit min-w-[300px] justify-between rounded-xl border border-border p-2 gap-4 m-auto md:mt-auto md:mr-0 md:ml-auto md:mb-0">
            <h2 className="text-t1 font-bold text-xl">Creator Balance</h2>
            <div className="flex flex-row items-center w-full">
                <div className="flex gap-2 items-center">
                    <p className="text-t1 ">{getChainName(chainId)}</p>
                    <ChainLabel chainId={chainId} px={16} />
                </div>

                <div className="text-t1 font-bold ml-auto">{`${new Decimal(balance).div(Decimal.pow(10, 18)).toString()} ETH`}</div>
            </div>
            {isInsufficientFundsError
                ?
                (<Link className="btn btn-outline btn-warning normal-case" href='https://bridge.base.org/deposit' prefetch={false} target="_blank">Add Funds</Link>)
                :
                <SwitchNetworkButton chainId={chainId}>
                    <button className="btn btn-primary normal-case " disabled={isBalanceLoading || balance === '0' || isTxPending || isWriteLoading}
                        onClick={() => write?.()}
                    >
                        {isWriteLoading ?
                            <div className="flex gap-2 items-center">
                                <p className="text-sm">Awaiting signature</p>
                                <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                            </div>
                            :
                            isTxPending ? (
                                <div className="flex gap-2 items-center">
                                    <p className="text-sm">Claiming</p>
                                    <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                                </div>
                            ) : "Claim"
                        }
                    </button>
                </SwitchNetworkButton>
            }
        </div>
    )
}
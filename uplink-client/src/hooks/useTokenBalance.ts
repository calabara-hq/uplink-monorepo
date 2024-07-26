import { NATIVE_TOKEN } from "@tx-kit/sdk";
import { useEffect, useState } from "react";
import { Address, erc20Abi, zeroAddress } from "viem";
import { useAccount, useChainId, usePublicClient, useWalletClient } from "wagmi";

export const useErc20Balance = (tokenContract: Address, chainId: number) => {
    const [balance, setBalance] = useState<bigint>(BigInt(0));
    const [isBalanceLoading, setIsBalanceLoading] = useState<boolean>(true);
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

    const fetchBalance = async () => {
        try {
            setIsBalanceLoading(true);
            const balance = await publicClient.readContract({
                address: tokenContract,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [walletClient.account.address]
            })
            setBalance(balance);
            setIsBalanceLoading(false);
        } catch (e) {
            console.error(e);
            setIsBalanceLoading(false);
            setBalance(BigInt(0));
        }
    }


    useEffect(() => {
        if (tokenContract !== zeroAddress && tokenContract !== NATIVE_TOKEN && walletClient) {
            fetchBalance();
        }
    }, [tokenContract, walletClient, chainId])

    return { balance, isBalanceLoading }
}

export const useEthBalance = (chainId: number) => {

    const [balance, setBalance] = useState<bigint>(BigInt(0));
    const [isBalanceLoading, setIsBalanceLoading] = useState<boolean>(true);
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

    const fetchBalance = async () => {
        try {
            setIsBalanceLoading(true);
            const balance = await publicClient.getBalance({
                address: walletClient.account.address
            });

            setBalance(balance);
            setIsBalanceLoading(false);
        } catch (e) {
            console.error(e);
            setIsBalanceLoading(false);
            setBalance(BigInt(0));
        }
    }

    useEffect(() => {
        if (walletClient) {
            fetchBalance();
        }
    }, [walletClient, chainId])


    return { balance, isBalanceLoading }
}
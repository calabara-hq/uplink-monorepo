"use client";
import { ContractID, splitContractID } from "@/types/channel";
import { useReadContract, useWalletClient } from "wagmi";
import { useChannel } from "./useChannel";
import { dynamicLogicAbi } from "@tx-kit/sdk/abi";
import { getDynamicLogicAddress } from "@tx-kit/sdk";
import { Address } from "viem";


export const useInteractionPower = (contractId: ContractID, mode: 'creator' | 'minter') => {

    const { data: walletClient } = useWalletClient();
    const { channel } = useChannel(contractId);
    const { contractAddress, chainId } = splitContractID(contractId);

    const fn = mode === 'creator' ? 'calculateCreatorInteractionPower' : 'calculateMinterInteractionPower';

    const result = useReadContract({
        abi: dynamicLogicAbi,
        address: getDynamicLogicAddress(chainId),
        functionName: fn,
        args: [walletClient?.account.address],
        account: contractAddress as Address, // mock the channel address as the msg.sender
        chainId: chainId
    })

    return {
        interactionPower: result?.data ?? BigInt(0),
    }

}
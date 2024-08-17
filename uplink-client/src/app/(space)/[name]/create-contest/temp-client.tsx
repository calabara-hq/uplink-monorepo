"use client";

import { useCreateFiniteChannel } from "@tx-kit/hooks";
import { CreateFiniteChannelConfig, NATIVE_TOKEN } from "@tx-kit/sdk";
import { encodeAbiParameters, parseEther, zeroAddress } from "viem";
import { useWalletClient } from "wagmi";
import { UniformInteractionPower } from "@tx-kit/sdk/utils";
import { useEffect } from "react";
import { DYNAMIC_LOGIC_BASE_SEPOLIA } from "@tx-kit/sdk";

// known errors
// InvalidRewards()
// InvalidAmountSent()


export const TempCreateContestV2 = () => {
    const { createFiniteChannel, status, txHash, error, channelAddress } = useCreateFiniteChannel();
    const { data: walletClient } = useWalletClient();

    const erc20BalanceOfData = encodeAbiParameters([{ type: "address", name: "address" }], [zeroAddress])


    useEffect(() => {
        console.log(error)
        console.log(status)
    }, [error, status])

    const setupActions = [
        {
            logicContract: DYNAMIC_LOGIC_BASE_SEPOLIA,
            creatorLogic: [new UniformInteractionPower(BigInt(10)).ifResultOf('0x24fe7807089e321395172633aA9c4bBa4Ac4a357', '0x70a08231', erc20BalanceOfData).gt(parseEther('0.0000000001'))],
            minterLogic: [new UniformInteractionPower(BigInt(10)).ifResultOf('0x24fe7807089e321395172633aA9c4bBa4Ac4a357', '0x70a08231', erc20BalanceOfData).gt(parseEther('0.0000000001'))]
        }
    ]


    const args: CreateFiniteChannelConfig = {
        uri: 'ipfs://Qmcn5RgybtgUQYhqJoncrkABqYXwbCFgcvRdF5dMQgvEYN',
        name: 'voting test',
        defaultAdmin: "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C",
        managers: [],
        setupActions,
        transportLayer: {
            createStartInSeconds: Math.floor(Date.now() / 1000),
            mintStartInSeconds: Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes
            mintEndInSeconds: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14, // 2 weeks
            rewards: {
                ranks: [1],
                allocations: [parseEther('0.0000001')],
                totalAllocation: parseEther('0.0000001'),
                token: NATIVE_TOKEN
            }
        },
        transactionOverrides: {
            value: parseEther('0.0000001')
        }
    }





    const handleClick = async () => {
        await createFiniteChannel(args)
    }


    return <button className="btn" onClick={handleClick}>Create Contest</button>

}
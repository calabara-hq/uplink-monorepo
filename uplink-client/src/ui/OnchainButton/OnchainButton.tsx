"use client";
import { useChainId, usePublicClient, useSwitchChain, useWalletClient } from "wagmi";
import { getChainName } from "@/lib/chains/supportedChains";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";
import { useTransmissionsClient } from "@tx-kit/hooks";

import { createSmartAccountClient, ENTRYPOINT_ADDRESS_V06 } from "permissionless";
import { base, baseSepolia, Chain, mainnet, sepolia } from "viem/chains";
import { http, createClient, createWalletClient, Client, Transport, HttpTransport } from "viem";
import { Eip7677RpcSchema, paymasterActionsEip7677 } from "permissionless/experimental";
import { walletClientToSmartAccountSigner } from "permissionless"
import { useEffect, useMemo } from "react";
import { createPimlicoPaymasterClient } from "permissionless/clients/pimlico";



export const TransmissionsClientProvider = ({ children }: { children: React.ReactNode }) => {
    const chainId = useChainId();
    const { data: walletClient, status } = useWalletClient();
    const publicClient = usePublicClient();

    const paymasterService = "https://api.developer.coinbase.com/rpc/v1/base-sepolia/64vYtCS67rJdaMnO5BjNzXrgsjL8t-yR";


    const cloudPaymaster = createPimlicoPaymasterClient({
        chain: baseSepolia as Chain,
        transport: http(paymasterService),
        entryPoint: ENTRYPOINT_ADDRESS_V06,
    })

    const smartAccountClient = createSmartAccountClient({
        account: walletClientToSmartAccountSigner(walletClient),
        chain: baseSepolia as Chain,
        entryPoint: ENTRYPOINT_ADDRESS_V06,
        middleware: {
            sponsorUserOperation: cloudPaymaster.sponsorUserOperation,
        }
    })


    // type PaymasterClient = Client<Transport, Chain, undefined, Eip7677RpcSchema<typeof ENTRYPOINT_ADDRESS_V06>>;

    // const paymasterClient = useMemo(() => {
    //     return createClient({
    //         account: walletClient?.account,
    //         chain: baseSepolia as Chain,
    //         transport: http(paymasterService),

    //     }).extend(paymasterActionsEip7677(ENTRYPOINT_ADDRESS_V06) as PaymasterClient);

    // }, [walletClient])


    //const smartAccountSigner = walletClientToSmartAccountSigner(walletClient)


    //paymasterClient.extend(paymasterActionsEip7677(ENTRYPOINT_ADDRESS_V06))

    // const smartAccountClient = createSmartAccountClient({
    //     account: smartAccountSigner,
    //     entryPoint: ENTRYPOINT_ADDRESS_V06,
    //     chain: baseSepolia as Chain,
    //     // bundlerTransport: http(bundlerUrl, {
    //     //     timeout: 30_000 // Wait 30 seconds for user operation to be included
    //     // }),

    //     middleware: {
    //         // gasPrice: async () => {
    //         //     return (await bundlerClient.getUserOperationGasPrice()).fast
    //         // },
    //         sponsorUserOperation: paymasterClient.sponsorUserOperation,
    //     },
    // })

    useEffect(() => {
        console.log(walletClient)
    }, [walletClient])

    useTransmissionsClient({
        chainId: chainId,
        walletClient: walletClient,
        publicClient: publicClient,
    })

    return <>{children}</>

}


export const SwitchNetworkButton = ({ children, desiredChainId, currentChainId }: { children: React.ReactNode; desiredChainId: number, currentChainId: number }) => {
    const { status, reset, switchChain } = useSwitchChain()

    const handleSwitch = async () => {
        switchChain({ chainId: desiredChainId }, { onError: () => reset() });
    }

    if (currentChainId !== desiredChainId) {
        if (status === 'pending') {
            return (
                <button className="btn normal-case" onClick={handleSwitch} disabled={true}>
                    <div className="flex gap-2 items-center">
                        <p>Switching to {getChainName(desiredChainId)} network</p>
                        <div
                            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status"
                        />
                    </div>
                </button>
            )
        }

        else return (
            <button className="btn normal-case btn-ghost btn-active rounded-3xl hover:rounded-xl transition-all duration-200 ease-linear" onClick={handleSwitch}>Switch to {getChainName(desiredChainId)}</button>
        )

    }

    return (
        <TransmissionsClientProvider>
            {children}
        </TransmissionsClientProvider>
    )
}

export default function OnchainButton({ chainId, title, onClick, isLoading, loadingChild, disabled = false }: { chainId: number, title: string, onClick: () => void, isLoading: boolean, disabled?: boolean, loadingChild: React.ReactNode }) {
    const currentChainId = useChainId();

    return (
        <WalletConnectButton styleOverride="w-full">
            <SwitchNetworkButton desiredChainId={chainId} currentChainId={currentChainId}>
                {
                    isLoading ?
                        <>{loadingChild}</>
                        : <button className="btn btn-primary normal-case w-full" disabled={disabled} onClick={onClick}> {title} </button>
                }
            </SwitchNetworkButton>
        </WalletConnectButton>
    )
}
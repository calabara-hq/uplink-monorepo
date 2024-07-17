"use client";

import { supportedChains } from "@/lib/chains/supportedChains";
import { TransmissionsProvider, useTransmissionsClient } from "@tx-kit/hooks";
import { PublicClient, WalletClient } from "viem";
import { useChainId, usePublicClient, useWalletClient } from "wagmi";

export const TxProvider = ({ children }: { children: React.ReactNode }) => {
    const chainId = useChainId();
    const { data: walletClient, status } = useWalletClient();
    const publicClient = usePublicClient();

    if (supportedChains.map(chain => chain.id).includes(chainId)) return (
        <TransmissionsProvider>
            <TransmissionsClientProvider chainId={chainId} publicClient={publicClient} walletClient={walletClient}>
                {children}
            </TransmissionsClientProvider>
        </TransmissionsProvider>
    )

    return <TransmissionsProvider>{children}</TransmissionsProvider>

}


const TransmissionsClientProvider = ({
    chainId,
    publicClient,
    walletClient,
    children
}: {
    chainId: number,
    publicClient: PublicClient,
    walletClient: WalletClient,
    children: React.ReactNode
}) => {

    useTransmissionsClient({
        chainId: chainId,
        walletClient: walletClient,
        publicClient: publicClient,
    })

    return <>{children}</>

}
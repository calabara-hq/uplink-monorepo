"use client";

import { TransmissionsProvider, useTransmissionsClient } from '@tx-kit/hooks';
import { SUPPORTED_CHAIN_IDS } from '@tx-kit/sdk';
import { useMemo } from 'react';
import { useChainId, usePublicClient, useWalletClient } from 'wagmi';


const TxProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <TransmissionsProvider>
            <TransmissionsClientProvider>
                {children}
            </TransmissionsClientProvider>
        </TransmissionsProvider>
    )
}



const TransmissionsClientProvider = ({ children }: { children: React.ReactNode }) => {
    const chainId = useChainId();
    const { data: walletClient, status } = useWalletClient();
    const publicClient = usePublicClient();

    const transmissionsClientConfig = useMemo(() => ({
        chainId: SUPPORTED_CHAIN_IDS.includes(chainId) ? chainId : 8453,
        walletClient: walletClient,
        publicClient: publicClient,
        paymasterConfig: {
            paymasterUrl: process.env.NODE_ENV === "production" ? `${process.env.NEXT_PUBLIC_HUB_URL}/v2/paymaster_proxy` : 'https://paymaster.base.org',
        }
    }), [chainId, walletClient, publicClient]);

    useTransmissionsClient(transmissionsClientConfig);

    return <>{children}</>;
};


export default TxProvider;
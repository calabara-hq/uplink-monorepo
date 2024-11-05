"use client";

import { TransmissionsProvider, useTransmissionsClient } from '@tx-kit/hooks';
import { getSubgraphUrl, SUPPORTED_CHAIN_IDS } from '@tx-kit/sdk';
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

    const { data: walletClient, status } = useWalletClient();
    const publicClient = usePublicClient();

    const transmissionsClientConfig = useMemo(() => {

        const chainId = walletClient?.chain?.id;

        if (!chainId || !SUPPORTED_CHAIN_IDS.includes(chainId)) {
            return undefined;
        }

        return {
            chainId,
            walletClient,
            publicClient,
            apiConfig: {
                serverUrl: getSubgraphUrl(chainId),
            },
            paymasterConfig: {
                paymasterUrl: process.env.NODE_ENV === "production" ? `${process.env.NEXT_PUBLIC_HUB_URL}/v2/paymaster_proxy` : 'https://paymaster.base.org',
            },
        };
    }, [walletClient, publicClient]);

    useTransmissionsClient(transmissionsClientConfig);

    return <>{children}</>;
};


export default TxProvider;
import { useState, useCallback } from 'react';
import { createWeb3Client } from '@/lib/viem'; // adjust the import path as necessary
import debounce from 'lodash/debounce';
import { Address } from 'viem';

// Create a Web3 client instance
const client = createWeb3Client(1);

// In-memory cache for ENS names
const ensCache = new Map<string, string>();

export const useWalletDisplayText = (address: string | null | undefined) => {
    const [displayText, setDisplayText] = useState<string>(address ? `${address.slice(0, 5)}...${address.slice(-4)}` : "");
    const [ensName, setEnsName] = useState<string | null>(null);

    const getDisplayText = useCallback(
        debounce(async (address: string | null | undefined) => {
            if (!address) {
                setDisplayText("anonymous");
                setEnsName(null);
                return;
            }

            // Check cache first
            if (ensCache.has(address)) {
                const cachedEnsName = ensCache.get(address) as string;
                setDisplayText(cachedEnsName);
                setEnsName(cachedEnsName);
                return;
            }

            try {
                const ensName = await client.getEnsName({ address: address as Address });
                if (ensName) {
                    ensCache.set(address, ensName);
                    setDisplayText(ensName);
                    setEnsName(ensName);
                } else {
                    const shortAddress = `${address.slice(0, 5)}...${address.slice(-4)}`;
                    ensCache.set(address, shortAddress);
                    setDisplayText(shortAddress);
                    setEnsName(null);
                }
            } catch (error) {
                console.error("Error fetching ENS name:", error);
                const shortAddress = `${address.slice(0, 5)}...${address.slice(-4)}`;
                setDisplayText(shortAddress);
                setEnsName(null);
            }
        }, 300), // debounce delay
        []
    );

    return {
        getDisplayText,
        displayText,
        ensName,
    };
};
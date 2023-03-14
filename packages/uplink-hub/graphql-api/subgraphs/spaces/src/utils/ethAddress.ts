import { ethers } from 'ethers';
import provider from './provider.js';

export const validateEthAddress = async (address: string) => {

    if (!address) return null
    address = address.trim();

    const isEns = address.match(/\.eth$/); // check if address is ens or hex
    let resolvedAddress: string | null = null;

    if (isEns) {
        resolvedAddress = await provider.resolveName(address);
        if (!resolvedAddress) return null;
        return resolvedAddress;
    }

    try {
        resolvedAddress = ethers.utils.getAddress(address);
        return resolvedAddress as string;
    } catch (error) {
        return null;
    }
}
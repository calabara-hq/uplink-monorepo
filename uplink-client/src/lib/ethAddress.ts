import { publicClient } from "./viem";
import { getAddress } from 'viem';
import { normalize } from "viem/ens";

export const validateEthAddress = async (address: string) => {

    if (!address) return null
    address = address.trim();

    const isEns = address.match(/\.eth$/); // check if address is ens or hex
    let resolvedAddress: string | null = null;

    if (isEns) {
        resolvedAddress = await publicClient.getEnsAddress({ name: normalize(address) });
        if (!resolvedAddress) return null;
        return resolvedAddress;
    }

    try {
        resolvedAddress = getAddress(address);
        return resolvedAddress as string;
    } catch (error) {
        return null;
    }
}

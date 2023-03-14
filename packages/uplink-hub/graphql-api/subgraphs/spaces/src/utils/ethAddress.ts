import { ethers } from 'ethers';

// TODO implement ethAddress conversion

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

export const validateEthAddress = async (address: string) => {
    const isEns = address.match(/\.eth$/); // check if address is ens or hex
    let resolvedAddress: string | null = null;
    if (isEns) resolvedAddress = await provider.resolveName(address);

    if (!resolvedAddress) return null;

    try {
        resolvedAddress = ethers.utils.getAddress(address);
        return resolvedAddress;
    } catch (error) {
        return null;
    }
}
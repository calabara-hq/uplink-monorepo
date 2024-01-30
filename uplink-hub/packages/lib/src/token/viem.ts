import { createPublicClient, http } from 'viem'
import type {Transport, Chain, PublicClient} from 'viem'
import { mainnet, base, zora, optimism, baseGoerli, zoraTestnet, optimismGoerli } from 'viem/chains'

export const createViemClient = (providerKey: string, chainId?: number): any => {

    if (chainId === 8453) return createPublicClient({
        chain: base,
        transport: http(`https://base-mainnet.g.alchemy.com/v2/${providerKey}`),
        batch: {
            multicall: true
        }
    });

    else if (chainId === 10) return createPublicClient({
        chain: optimism,
        transport: http(`https://opt-mainnet.g.alchemy.com/v2/${providerKey}`),
        batch: {
            multicall: true
        }
    });

    else if (chainId === 7777777) return createPublicClient({
        chain: zora,
        transport: http(`https://rpc.zora.energy`),
        batch: {
            multicall: true
        }
    });

    else if (chainId === 84531) return createPublicClient({
        chain: baseGoerli,
        transport: http(`https://base-goerli.g.alchemy.com/v2/${providerKey}`),
        batch: {
            multicall: true
        }
    });

    else if (chainId === 420) return createPublicClient({
        chain: optimismGoerli,
        transport: http(`https://opt-goerli.g.alchemy.com/v2/${providerKey}`),
        batch: {
            multicall: true
        }
    });

    else if (chainId === 999) return createPublicClient({
        chain: zoraTestnet,
        transport: http(`https://testnet.rpc.zora.energy`),
        batch: {
            multicall: true
        }
    });

    // return mainnet by default

    return createPublicClient({
        chain: mainnet,
        transport: http(`https://eth-mainnet.g.alchemy.com/v2/${providerKey}`),
        batch: {
            multicall: true
        }
    });
}

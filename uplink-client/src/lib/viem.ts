import { createPublicClient, http } from 'viem'
import { mainnet, base } from 'viem/chains'

export const createWeb3Client = (chainId?: number) => {
    if (!chainId || chainId === 1) return createPublicClient({
        chain: mainnet,
        transport: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
        batch: {
            multicall: true
        }
    });

    else if (chainId === 8453) return createPublicClient({
        chain: base,
        transport: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
        batch: {
            multicall: true
        }
    });

    else if (chainId === 10) return createPublicClient({
        chain: base,
        transport: http(`https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
        batch: {
            multicall: true
        }
    });

    else if (chainId === 7777777) return createPublicClient({
        chain: base,
        transport: http(`https://rpc.zora.energy`),
        batch: {
            multicall: true
        }
    });

    else if (chainId === 84531) return createPublicClient({
        chain: base,
        transport: http(`https://base-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
        batch: {
            multicall: true
        }
    });

    else if (chainId === 420) return createPublicClient({
        chain: base,
        transport: http(`https://opt-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
        batch: {
            multicall: true
        }
    });

    else if (chainId === 999) return createPublicClient({
        chain: base,
        transport: http(`https://testnet.rpc.zora.energy`),
        batch: {
            multicall: true
        }
    });
}


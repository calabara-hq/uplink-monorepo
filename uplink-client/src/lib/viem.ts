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
        transport: http(`https://mainnet.base.org`),
        batch: {
            multicall: true
        }
    });
}


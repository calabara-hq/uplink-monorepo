import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet, base, zora, optimism, baseGoerli, zoraTestnet, optimismGoerli } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'


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
        chain: optimism,
        transport: http(`https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
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
        transport: http(`https://base-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
        batch: {
            multicall: true
        }
    });

    else if (chainId === 420) return createPublicClient({
        chain: optimismGoerli,
        transport: http(`https://opt-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
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
}

export const createPrivClient = () => {
    const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)
    return {
        account,
        client: createWalletClient({
            chain: base,
            transport: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
        })
    }
}


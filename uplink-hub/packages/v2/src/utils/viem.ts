import { Chain, createPublicClient, http, PublicClient, Transport } from 'viem'
import { mainnet, base, baseSepolia } from 'viem/chains'
import dotenv from 'dotenv'
dotenv.config()

export const createWeb3Client = (chainId?: number) => {

    if (chainId === 84532) return createPublicClient({
        chain: baseSepolia as Chain,
        transport: http(`https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`),
        batch: {
            multicall: true
        }
    }) as PublicClient<Transport, Chain>;

    return createPublicClient({
        chain: base as Chain,
        transport: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`),
        batch: {
            multicall: true
        }
    }) as PublicClient<Transport, Chain>;
}
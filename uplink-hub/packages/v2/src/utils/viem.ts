import { Chain, createPublicClient, http, PublicClient, Transport } from 'viem'
import { mainnet, base, baseSepolia } from 'viem/chains'
import dotenv from 'dotenv'
dotenv.config()


const ethClient = createPublicClient({
    chain: mainnet as Chain,
    transport: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`),
    batch: {
        multicall: true
    }
});

const baseSepoliaClient = createPublicClient({
    chain: baseSepolia as Chain,
    transport: http(`https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`),
    batch: {
        multicall: true
    }
});

const baseClient = createPublicClient({
    chain: base as Chain,
    transport: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`),
    batch: {
        multicall: true
    }
});

export const createWeb3Client = (chainId?: number) => {
    // if (chainId === 84532) return baseSepoliaClient as PublicClient<Transport, Chain>;
    // return baseClient as PublicClient<Transport, Chain>;

    switch (chainId) {
        case 1:
            return ethClient as PublicClient<Transport, Chain>;
        case 84532:
            return baseSepoliaClient as PublicClient<Transport, Chain>;
        default:
            return baseClient as PublicClient<Transport, Chain>;
    }

};
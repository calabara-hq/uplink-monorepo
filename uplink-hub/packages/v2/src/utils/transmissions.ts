import { TransmissionsClient, getSubgraphUrl } from '@tx-kit/sdk';
import { createWeb3Client } from './viem.js';
import { createWalletClient, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import dotenv from 'dotenv'
dotenv.config()

const { downlinkClient: baseSepoliaDownlinkClient, uplinkClient: baseSepoliaUplinkClient } = new TransmissionsClient({
    chainId: 84532,
    apiConfig: {
        serverUrl: getSubgraphUrl(84532)
    },
    publicClient: createWeb3Client(84532),
    walletClient: createWalletClient({
        chain: baseSepolia,
        transport: http(`https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`)
    })
})

const { downlinkClient: baseDownlinkClient, uplinkClient: baseUplinkClient } = new TransmissionsClient({
    chainId: 8453,
    apiConfig: {
        serverUrl: getSubgraphUrl(8453)
    },
    publicClient: createWeb3Client(8453),
    walletClient: createWalletClient({
        chain: base,
        transport: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`)
    })
})


export const clientByChainId = (chainId: number) => {
    if (chainId === 84532) {
        return { downlinkClient: baseSepoliaDownlinkClient, uplinkClient: baseSepoliaUplinkClient }
    } else if (chainId === 8453) {
        return { downlinkClient: baseDownlinkClient, uplinkClient: baseUplinkClient }
    }
}

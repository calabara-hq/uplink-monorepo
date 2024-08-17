import { TransmissionsClient, getSubgraphUrl } from '@tx-kit/sdk';
import { createWeb3Client } from './viem.js';
import { createWalletClient, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import dotenv from 'dotenv'
dotenv.config()


const { downlinkClient: baseSepoliaDownlinkClient, uplinkClient: baseSepoliaUplinkClient } = new TransmissionsClient({
    chainId: 84532,
    apiConfig: {
        serverUrl: 'https://api.goldsky.com/api/public/project_clx10qkniqc3w01ypaz560vm1/subgraphs/transmissions-baseSepolia/0.0.8/gn'
        //serverUrl: getSubgraphUrl(84532) // TODO update sdk to new version and swap back
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
        //serverUrl: getSubgraphUrl(8453) // TODO update sdk to new version and swap back
        serverUrl: 'https://api.goldsky.com/api/public/project_clx10qkniqc3w01ypaz560vm1/subgraphs/transmissions-baseMainnet/0.0.3/gn'
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

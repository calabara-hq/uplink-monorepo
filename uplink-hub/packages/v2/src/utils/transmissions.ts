import { TransmissionsClient, getSubgraphUrl } from '@tx-kit/sdk';
import { createWeb3Client } from './viem.js';



export const { downlinkClient: baseSepoliaDownlinkClient } = new TransmissionsClient({
    chainId: 84532,
    apiConfig: {
        serverUrl: getSubgraphUrl(84532)
    },
    publicClient: createWeb3Client(84532),
})

export const { downlinkClient: baseDownlinkClient } = new TransmissionsClient({
    chainId: 8453,
    apiConfig: {
        serverUrl: getSubgraphUrl(8453)
    },
    publicClient: createWeb3Client(8453),
})


export const clientByChainId = (chainId: number) => {
    if (chainId === 84532) {
        return baseSepoliaDownlinkClient
    } else if (chainId === 8453) {
        return baseDownlinkClient
    }
}

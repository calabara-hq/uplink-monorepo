import { http, createConfig } from '@wagmi/core'
import { base, baseSepolia } from '@wagmi/core/chains'

export default createConfig({
    chains: [
        base,
        baseSepolia
    ],
    transports: {
        [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
        [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
    },
})


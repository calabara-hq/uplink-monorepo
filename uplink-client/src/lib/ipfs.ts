

// given an ipfs url, return both the "raw" ipfs protocol url and the gateway url (uplink.mypinata.cloud)
export const parseIpfsUrl = (url: string) => {
    if (url.startsWith('ipfs://')) {
        const hash = url.split('ipfs://')[1];
        return {
            raw: url,
            gateway: `https://uplink.mypinata.cloud/ipfs/${hash}`,
        }
    }
    if (url.startsWith('https://uplink.mypinata.cloud/ipfs/')) {
        const hash = url.split('https://uplink.mypinata.cloud/ipfs/')[1];
        return {
            raw: `ipfs://${hash}`,
            gateway: url,
        }
    }
    return {
        raw: url,
        gateway: url,
    }
}
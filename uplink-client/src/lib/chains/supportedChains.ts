export const supportedChains = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_CLIENT_URL === "https://staging.uplink.wtf" ? [
    { id: 1, name: 'Ethereum' },
    { id: 8453, name: 'Base' },
    { id: 84531, name: 'Base Goerli' }
] : [
    { id: 1, name: 'Ethereum' },
    { id: 8453, name: 'Base' },
]

export const getChainName = (chainId: number) => {
    const chain = supportedChains.find(c => c.id === chainId);
    if (!chain) return null;
    return chain.name;
}

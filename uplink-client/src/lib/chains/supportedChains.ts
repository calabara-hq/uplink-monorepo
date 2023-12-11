export const supportedChains = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_CLIENT_URL === "https://staging.uplink.wtf" ? [
    { id: 1, name: 'Ethereum' },
    { id: 8453, name: 'Base' },
    { id: 10, name: 'Optimism' },
    { id: 7777777, name: 'Zora' },
    { id: 84531, name: 'Base Goerli' },
    { id: 420, name: 'Optimism Goerli' },
    { id: 999, name: 'Zora Goerli' },
] : [
    { id: 1, name: 'Ethereum' },
    { id: 8453, name: 'Base' },
    { id: 10, name: 'Optimism' },
    { id: 7777777, name: 'Zora' },
]

export const getChainName = (chainId: number) => {
    const chain = supportedChains.find(c => c.id === chainId);
    if (!chain) return null;
    return chain.name;
}

export const supportedChains = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_CLIENT_URL === "https://staging.uplink.wtf" ? [
    { id: 8453, name: 'Base' },
    { id: 84532, name: 'Base Sepolia' },
] : [
    { id: 8453, name: 'Base' },
]

export const getChainName = (chainId: number) => {
    const chain = supportedChains.find(c => c.id === chainId);
    if (!chain) return null;
    return chain.name;
}

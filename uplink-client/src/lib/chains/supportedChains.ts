export const supportedChains = process.env.NODE_ENV === "production" ? [
    { id: 1, name: 'Ethereum' },
    { id: 8453, name: 'Base' },
] : [
    { id: 1, name: 'Ethereum' },
    { id: 8453, name: 'Base' },
    { id: 84531, name: 'Base Goerli' }
]

export const getChainName = (chainId: number) => {
    const chain = supportedChains.find(c => c.id === chainId);
    if (!chain) return null;
    return chain.name;
}
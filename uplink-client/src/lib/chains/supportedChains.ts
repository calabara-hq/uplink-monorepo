export const supportedChains = [
    { id: 1, name: 'Ethereum' },
    { id: 8453, name: 'Base' },
]

export const getChainName = (chainId: number) => {
    const chain = supportedChains.find(c => c.id === chainId);
    if (!chain) return null;
    return chain.name;
}
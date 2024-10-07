
export interface IERCToken {
    type: "ERC20" | "ERC721" | "ERC1155";
    address: string;
    decimals: number;
    symbol: string;
    chainId: number;
    tokenId: number | null;
}

export interface INativeToken {
    type: "ETH";
    symbol: "ETH";
    decimals: 18;
    chainId: number;
}

export type IToken = IERCToken | INativeToken;


export const filterTokenProperties = (tokens: IToken[]): IToken[] => {
    return tokens.map(token => {
        if (token.type === "ETH") {
            const { type, symbol, decimals, chainId } = token as INativeToken;
            return { type, symbol, decimals, chainId };
        } else {
            const { type, address, decimals, symbol, chainId, tokenId } = token as IERCToken;
            return { type, address, decimals, symbol, chainId, tokenId };
        }
    });
}

export const isERCToken = (token: any): token is IERCToken => {
    return token.type === "ERC20" || token.type === "ERC721" || token.type === "ERC1155";
}

export const isMainnet = (token: IToken): boolean => {
    return token.chainId === 1;
}

export const isBaseNetwork = (token: IToken): boolean => {
    return token.chainId === 8453;
}
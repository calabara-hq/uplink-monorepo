
export interface IERCToken {
    type: "ERC20" | "ERC721" | "ERC1155";
    address: string;
    decimals: number;
    symbol: string;
    tokenId?: number;
}

export interface INativeToken {
    type: "ETH";
    symbol: "ETH";
    decimals: 18;
}

export type IToken = IERCToken | INativeToken;


export const isERCToken = (token: IToken): token is IERCToken => {
    return token.type === "ERC20" || token.type === "ERC721" || token.type === "ERC1155";
}
import { IERCToken, INativeToken, IToken } from "@/types/token";

export const sampleERC1155Token: IERCToken = {
    type: "ERC1155",
    address: "0x7c2748C7Ec984b559EADc39C7a4944398E34911a",
    symbol: "TNS",
    decimals: 0,
    tokenId: 2,
}

export const sampleERC20Token: IERCToken = {
    type: "ERC20",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    symbol: "USDC",
    decimals: 6,
}

export const sampleERC721Token: IERCToken = {
    type: "ERC721",
    address: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
    symbol: "NOUN",
    decimals: 0,
}

export const sampleETHToken: INativeToken = {
    type: "ETH",
    symbol: "ETH",
    decimals: 18,
}
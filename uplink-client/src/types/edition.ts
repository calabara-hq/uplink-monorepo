export type Edition = {
    id: string;
    chainId: number;
    contractAddress: string;
    name: string
    symbol: string
    editionSize: string
    royaltyBPS: number
    fundsRecipient: string
    defaultAdmin: string
    saleConfig: EditionSaleConfig;
    description: string;
    animationURI: string;
    imageURI: string;
    referrer: string;

}

export type EditionSaleConfig = {
    publicSalePrice: string;
    maxSalePurchasePerAddress: number;
    publicSaleStart: string;
    publicSaleEnd: string;
    presaleStart: string;
    presaleEnd: string;
    presaleMerkleRoot: string;
}
import { Context, schema } from "lib";
import { Request } from "express";
import { Address } from "viem";
import { DeferredTokenIntentWithSignature, IToken } from "@tx-kit/sdk";

export interface ContexedRequest extends Request {
    context: Context;
}

export type ContractID = `0x${string}-${number}`;

// export type TokenMetadata = {
//     id: string;
//     name: string;
//     description: string;
//     image: string;
//     animation: string;
//     type: "uplink-v1" | "uplink-v2";
// }

// export type V1TokenWithMetadata = schema.dbZoraTokenType & {
//     metadata: TokenMetadata | null
// }

// export type V2TokenWithMetadata = IToken

// export type TokenIntentWithMetadata = schema.dbTokenIntentType & DeferredTokenIntentWithSignature & {
//     metadata: TokenMetadata | null
//     uri: string;
//     totalMinted: "0";
// };

export type TokenMetadata = {
    id: string;
    name: string;
    description: string;
    image: string;
    animation: string;
    type: "uplink-v1" | "uplink-v2";
}

export type V1TokenWithMetadata = {
    id: string;
    chainId: number;
    contractAddress: string;
    channelAddress: string;
    maxSupply: string;
    totalMinted: string;
    author: string;
    publicSalePrice: string;
    publicSaleStart: string;
    publicSaleEnd: string;

    name: string;
    description: string;
    animationURI: string;
    imageURI: string;

    metadata: TokenMetadata;
}

// export type V2TokenWithMetadata = {
//     id: string;
//     channelAddress: Address;
//     tokenId: string;
//     uri: string;
//     author: Address;
//     sponsor: Address;
//     totalMinted: string;
//     maxSupply: string;
//     createdAt: string;
//     blockNumber: string;
//     blockTimestamp: string;
//     metadata: TokenMetadata;
// }

export type V2TokenWithMetadata = IToken

export type TokenIntentWithMetadata = schema.dbTokenIntentType & DeferredTokenIntentWithSignature & {
    metadata: TokenMetadata | null
    uri: string;
    totalMinted: "0";
};


type PageInfo = {
    pageInfo: {
        endCursor: number;
        hasNextPage: boolean;
    }
}

export type V1TokenPage = {
    data: Array<V1TokenWithMetadata>
} & PageInfo

export type V2TokenPage = {
    data: Array<V2TokenWithMetadata>
} & PageInfo

export type IntentTokenPage = {
    data: Array<TokenIntentWithMetadata>
} & PageInfo
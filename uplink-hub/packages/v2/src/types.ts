import { Context, schema } from "lib";
import { Request } from "express";
import { DeferredTokenIntentWithSignature } from "@tx-kit/sdk";
import { IChannel, IToken } from "@tx-kit/sdk/subgraph";
import { Address } from "viem";

export type MutateSpaceData = {
    spaceId?: string;
    name: string;
    logoUrl: string;
    website: string;
    admins: Array<Address>;
}

export interface ContexedRequest<T = any> extends Request {
    context: Context;
    body: T;
}

export type ContractID = `0x${string}-${number}`;

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

export type FiniteTokenPage = {
    data: Array<V2TokenWithMetadata & { isWinner: boolean }>
} & PageInfo

export type IntentTokenPage = {
    data: Array<TokenIntentWithMetadata>
} & PageInfo

export const isInfiniteChannel = (channel: IChannel) => {
    return channel.transportLayer.type === "infinite";
}

export const isFiniteChannel = (channel: IChannel) => {
    return channel.transportLayer.type === "finite";
}
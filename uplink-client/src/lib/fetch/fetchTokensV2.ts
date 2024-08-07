import { Channel, ChannelToken, ChannelTokenIntent, ChannelTokenV1, ContractID } from "@/types/channel";
import { Space } from "@/types/space";

export type PageInfo = {
    endCursor: number;
    hasNextPage: boolean;
}

export type FetchTokenIntentsResponse = {
    data: Array<ChannelTokenIntent>
    pageInfo: PageInfo
}

export type FetchTokensV1Response = {
    data: Array<ChannelTokenV1>
    pageInfo: PageInfo
}

export type FetchTokensV2Response = {
    data: Array<ChannelToken>
    pageInfo: PageInfo
}

export type FetchPopularTokensResponse = {
    data: Array<ChannelToken | ChannelTokenV1>
    pageInfo: PageInfo
}

export type FetchFeaturedTokensResponse = {
    data: Array<{ token: ChannelToken, channel: Channel, space: Space }>
    pageInfo: PageInfo
}


export const fetchTokensV1 = async (contractId: ContractID, pageSize: number, skip: number): Promise<FetchTokensV1Response> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/channel_tokensV1?contractId=${contractId}&pageSize=${pageSize}&skip=${skip}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },

        next: { revalidate: 60, tags: [`tokensV1/${contractId}`] },

    }).then(res => res.json())

}

export const fetchTokensV2 = async (contractId: ContractID, pageSize: number, skip: number): Promise<FetchTokensV2Response> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/channel_tokensV2?contractId=${contractId}&pageSize=${pageSize}&skip=${skip}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },

        next: { revalidate: 60, tags: [`tokensV2/${contractId}`] },

    }).then(res => res.json())

}


export const fetchTokenIntents = async (contractId: ContractID, pageSize: number, skip: number): Promise<FetchTokenIntentsResponse> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/channel_tokenIntents?contractId=${contractId}&pageSize=${pageSize}&skip=${skip}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },

        next: { revalidate: 60, tags: [`tokenIntents/${contractId}`] },

    }).then(res => res.json())

}

export const fetchPopularTokens = async (contractId: ContractID, pageSize: number, skip: number): Promise<FetchPopularTokensResponse> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/channel_popularTokens?contractId=${contractId}&pageSize=${pageSize}&skip=${skip}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },

        next: { revalidate: 60, tags: [`popularTokens/${contractId}`] },

    }).then(res => res.json())
}

export const fetchSingleTokenV1 = async (contractId: ContractID, postId: string): Promise<ChannelTokenV1> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/singleTokenV1?contractId=${contractId}&postId=${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },

        next: { revalidate: 60, tags: [`singleTokenV1/${contractId}/post/${postId}`] },

    }).then(res => res.json())
}

export const fetchSingleTokenV2 = async (contractId: ContractID, postId: string): Promise<ChannelToken> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/singleTokenV2?contractId=${contractId}&postId=${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        next: { revalidate: 60, tags: [`singleTokenV2/${contractId}/post/${postId}`] },

    }).then(res => res.json())
}

export const fetchSingleTokenIntent = async (contractId: ContractID, postId: string): Promise<ChannelTokenIntent | ChannelToken> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/singleTokenIntent?contractId=${contractId}&postId=${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },

        next: { revalidate: 60, tags: [`singleTokenIntent/${contractId}/post/${postId}`] },

    }).then(res => res.json())
}

export const fetchFeaturedTokens = async (chainId: number, pageSize: number, skip: number): Promise<FetchFeaturedTokensResponse> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/featured_mints?chainId=${chainId}&pageSize=${pageSize}&skip=${skip}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },

        next: { revalidate: 60, tags: [`featuredTokens/${chainId}`] },

    }).then(res => res.json())


}

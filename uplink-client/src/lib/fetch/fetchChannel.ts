import { Channel, ChannelUpgradePath, ContractID } from "@/types/channel";
import { Space } from "@/types/space";


export const fetchChannelUpgradePath = async (contractId: ContractID): Promise<ChannelUpgradePath | null> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/channel_upgradePath?contractId=${contractId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        next: { revalidate: 60, tags: [`channel_upgradePath/${contractId}`] },
    }).then(res => res.json())

    return data;
}

export const fetchTrendingChannels = async (chainId: number): Promise<Array<Channel & { space: Space }>> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/explore_trending?chainId=${chainId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        next: { revalidate: 60, tags: [`explore_trending/${chainId}`] },
    }).then(res => res.json())

    return data;
}

export const fetchActiveContests = async (chainId: number): Promise<Array<Channel & { space: Space }>> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/explore_activeContests?chainId=${chainId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        next: { revalidate: 60, tags: [`explore_activeContests/${chainId}`] },
    }).then(res => res.json())

    return data;
}

const fetchChannel = async (contractId: ContractID): Promise<Channel> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/channel?contractId=${contractId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        next: { revalidate: 60, tags: [`channel/${contractId}`] },
    }).then(res => res.json())

    return data;
}


export default fetchChannel;
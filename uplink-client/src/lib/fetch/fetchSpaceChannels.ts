import { ChainId } from "@/types/chains";
import { Channel } from "@/types/channel";
import { LegacyContest } from "@/types/contest";


export type SpaceChannels = {
    finiteChannels: Array<Channel>;
    infiniteChannels: Array<Channel>;
    legacyContests: Array<LegacyContest>;
}

const fetchSpaceChannels = async (spaceName: string, chainId: ChainId): Promise<SpaceChannels> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/space_channels?spaceName=${spaceName}&chainId=${chainId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        next: { revalidate: 60, tags: [`spaceChannels/${spaceName}`] },
    })

        .then(res => res.json())

    return data;
}

export default fetchSpaceChannels;
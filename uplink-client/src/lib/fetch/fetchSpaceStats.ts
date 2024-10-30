import { SpaceStats } from "@/types/spaceStats";
import { ChainId } from "@/types/chains";



const fetchSpaceStats = async (spaceName: string, chainId: ChainId): Promise<SpaceStats> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/space_stats?spaceName=${spaceName}&chainId=${chainId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },

        next: { revalidate: 60, tags: [`stats/${spaceName}/${chainId}`] },

    }).then(res => res.json())
}

export default fetchSpaceStats;
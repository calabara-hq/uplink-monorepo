import { Channel } from "@/types/channel";

const fetchSpaceChannels = async (spaceName: string): Promise<Array<Channel>> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/space_channels?spaceName=${spaceName}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        next: { revalidate: 60, tags: [`spaceChannels/${spaceName}`] },
    }).then(res => res.json())

    return data;
}

export default fetchSpaceChannels;
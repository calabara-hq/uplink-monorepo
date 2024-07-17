import { Channel, ContractID } from "@/types/channel";

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
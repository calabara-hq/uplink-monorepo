import { Space } from "@/types/space";

const fetchSpaces = async (): Promise<Array<Space>> => {

    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/spaces`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        next: { revalidate: 60, tags: [`spaces`] },
    })

        .then(res => res.json())

    return data;
}
export default fetchSpaces;

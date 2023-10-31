import { Space } from "@/types/space";

const fetchSpaces = async (): Promise<Array<Space>> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        body: JSON.stringify({
            query: `
                query Spaces{
                spaces{
                    name
                    displayName
                    members
                    logoUrl
                }
            }`,
        }),
        next: { tags: ["spaces"], revalidate: 60 },
    })
        .then((res) => res.json())
        .then((res) => res.data.spaces);
};

export default fetchSpaces;
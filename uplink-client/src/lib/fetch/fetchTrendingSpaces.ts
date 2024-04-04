import {Space} from "@/types/space";
import handleNotFound from "../handleNotFound";

const fetchTrendingSpaces = async (): Promise<Array<Space>> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        body: JSON.stringify({
            query: `
                query trendingSpaces($limit: Int!){
                    trendingSpaces(limit: $limit) {
                        id
                        name
                        displayName
                        logoUrl
                    }
                }`,
            variables: { limit: 10 },
        }),
        next: { tags: [`trendingSpaces}`], revalidate: 60 },
    })
        .then((res) => res.json())
        .then((res) => res.data.trendingSpaces)
        .then(handleNotFound)
};

export default fetchTrendingSpaces;
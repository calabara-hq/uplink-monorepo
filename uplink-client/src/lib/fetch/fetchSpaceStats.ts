import { SpaceStats } from "@/types/spaceStats";
import handleNotFound from "../handleNotFound";

const fetchSpaceStats = async (spaceName: string): Promise<SpaceStats> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        body: JSON.stringify({
            query: `
                query spaceStatistics($spaceName: String!){
                    spaceStatistics(spaceName: $spaceName) {
                        totalEditions
                        totalMints
                        topAppearanceUser {
                            address
                            userName
                            displayName
                            profileAvatar
                        }
                        topMintsUser {
                            address
                            userName
                            displayName
                            profileAvatar
                        }
                        editions {
                            totalMints
                            edition {
                                id
                                defaultAdmin
                                saleConfig {
                                    publicSaleStart
                                }
                            }
                        }
                    }
                }`,
            variables: {
                spaceName,
            },
        }),
        next: { tags: [`spaceStats/${spaceName}`], revalidate: 3600 },
    })
        .then((res) => res.json())
        .then((res) => res.data.spaceStatistics)
        .then(handleNotFound)
};

export default fetchSpaceStats;
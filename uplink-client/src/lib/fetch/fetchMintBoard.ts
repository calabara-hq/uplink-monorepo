import { MintBoard } from "@/types/mintBoard";

const fetchMintBoard = async (spaceName: string): Promise<MintBoard> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        body: JSON.stringify({
            query: `
                query mintBoard($spaceName: String!){
                    mintBoard(spaceName: $spaceName) {
                        id
                        space {
                            id
                            logoUrl
                            name
                            displayName
                            admins {
                                address
                            }
                        }
                        enabled
                        threshold
                        editionSize
                        description
                        chainId
                        created
                        boardTitle
                        boardDescription
                        name
                        publicSaleEnd
                        publicSalePrice
                        publicSaleStart
                        referrer
                        spaceId
                        symbol
                    }
                }`,
            variables: {
                spaceName,
            },
        }),
        next: { tags: [`mintBoard/${spaceName}`], revalidate: 60 },
    })
        .then((res) => res.json())
        .then((res) => res.data.mintBoard)
    return data;
};

export default fetchMintBoard;
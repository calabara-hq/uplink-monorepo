import { MintBoardPost, PaginatedMintBoardPosts } from "@/types/mintBoard";
import handleNotFound from "../handleNotFound";

export const fetchPaginatedMintBoardPosts = async (spaceName: string, lastCursor: string | null, limit: number): Promise<PaginatedMintBoardPosts> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        body: JSON.stringify({
            query: `
                query PaginatedMintBoardPosts($spaceName: String! $lastCursor: String $limit: Int!) {
                    paginatedMintBoardPosts(spaceName: $spaceName lastCursor: $lastCursor limit: $limit) {
                        posts {
                            id
                            created
                            totalMints
                            author {
                                id
                                address
                                userName
                                displayName
                                profileAvatar
                            }
                            edition {
                                id
                                chainId
                                contractAddress
                                name
                                symbol
                                editionSize
                                royaltyBPS
                                fundsRecipient
                                defaultAdmin
                                saleConfig {
                                publicSalePrice
                                maxSalePurchasePerAddress
                                publicSaleStart
                                publicSaleEnd
                                presaleStart
                                presaleEnd
                                presaleMerkleRoot
                                }
                                description
                                animationURI
                                imageURI
                                referrer
                            }
                        }
                        pageInfo {
                            endCursor
                            hasNextPage
                        }
                    }
                }`,
            variables: {
                spaceName,
                lastCursor,
                limit
            },
        }),
        next: { tags: [`mintBoard/${spaceName}/posts?lastCursor=${lastCursor}&limit=${limit}`], revalidate: 60 },
    })
        .then((res) => res.json())
        .then((res) => res.data.paginatedMintBoardPosts)
        .then(handleNotFound);
    return data;
}


export const fetchPopularMintBoardPosts = async (spaceName: string): Promise<Array<MintBoardPost>> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        body: JSON.stringify({
            query: `
                query PopularMintBoardPosts($spaceName: String!){
                    popularMintBoardPosts(spaceName: $spaceName) {
                        id
                        created
                        totalMints
                        author {
                            id
                            address
                            userName
                            displayName
                            profileAvatar
                        }
                        edition {
                            id
                            chainId
                            contractAddress
                            name
                            symbol
                            editionSize
                            royaltyBPS
                            fundsRecipient
                            defaultAdmin
                            saleConfig {
                                publicSalePrice
                                maxSalePurchasePerAddress
                                publicSaleStart
                                publicSaleEnd
                                presaleStart
                                presaleEnd
                                presaleMerkleRoot
                            }
                            description
                            animationURI
                            imageURI
                            referrer
                        }
                    }
                }`,
            variables: {
                spaceName,
            },
        }),
        next: { tags: [`mintBoard/${spaceName}/popular`], revalidate: 60 },
    })
        .then((res) => res.json())
        .then((res) => res.data.popularMintBoardPosts)
        .then(handleNotFound);
    return data;
}


export const fetchSingleMintboardPost = async (spaceName: string, postId: string): Promise<MintBoardPost> => {
    const offestPostId = postId + 1;
    return fetchPaginatedMintBoardPosts(spaceName, offestPostId, 1).then(data => data.posts[0])
}
import { MintBoardPost, PaginatedMintBoardPosts } from '@/types/mintBoard';
import useSWRInfinite from 'swr/infinite'
import useSWR from 'swr';

const fetchPaginatedMintBoardPosts = async (spaceName: string, lastCursor: string | null, limit: number): Promise<PaginatedMintBoardPosts> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
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
    })
        .then((res) => res.json())
        .then((res) => res.data.paginatedMintBoardPosts)
    return data;
}


const fetchPopularMintBoardPosts = async (spaceName: string): Promise<Array<MintBoardPost>> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
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
    })
        .then((res) => res.json())
        .then((res) => res.data.popularMintBoardPosts)
    return data;
}


const locatePageOfPost = (data: Array<PaginatedMintBoardPosts>, postId: string) => {

    for (let i = 0; i < data.length; i++) {
        if (postId >= data[i].pageInfo.endCursor) {
            for (let j = 0; j < data[i].posts.length; j++) {
                if (data[i].posts[j].id === postId) {
                    return { pageIndex: i, postIndex: j }
                }
            }
        }
    }

    return null;
}


export const usePaginatedMintBoardPosts = (spaceName: string) => {

    const getKey = (pageIndex, previousPageData) => {
        // The first page has an index of 0
        if (pageIndex === 0) return ['mintBoard', spaceName, 'posts', null, 50];

        // Return null to stop fetching if there are no more pages
        if (!previousPageData.pageInfo.hasNextPage) return null;

        // Use the endCursor from the previous page for the next page
        return ['mintBoard', spaceName, 'posts', previousPageData.pageInfo.endCursor.toString(), 50];
    };


    const { data, error, size, setSize, mutate } = useSWRInfinite(
        getKey,
        ([, spaceName, , lastCursor, limit]) => fetchPaginatedMintBoardPosts(spaceName, lastCursor, limit)
    );


    const mintPaginatedPost = (postId: string, mintAmount: number) => {
        const { pageIndex, postIndex } = locatePageOfPost(data, postId);
        mutate((currentPageData) => {
            return currentPageData.map((page, index) => {
                if (index !== pageIndex) return page;

                return {
                    ...page,
                    posts: page.posts.map((post, idx) => {
                        if (idx !== postIndex) return post;
                        return { ...post, totalMints: post.totalMints + mintAmount };
                    }),
                };
            });
        }, false); // avoid revalidation after mutation

    }

    const deletePaginatedPost = (postId: string) => {
        const { pageIndex, postIndex } = locatePageOfPost(data, postId);

        mutate((currentPageData) => {
            return currentPageData.map((page, index) => {
                if (index !== pageIndex) return page;

                return {
                    ...page,
                    posts: page.posts.filter((_, idx) => idx !== postIndex)
                };
            });
        }, false)
    }

    return { data, error, size, setSize, mintPaginatedPost, deletePaginatedPost };

}

export const usePopularMintBoardPosts = (spaceName: string) => {
    const {
        data,
        isLoading,
        error,
        mutate
    }: { data: any; isLoading: boolean; error: any; mutate: any } = useSWR(
        `mintBoard/${spaceName}/popular`,
        () => fetchPopularMintBoardPosts(spaceName),
    );


    const mintPopularPost = (postId: string, mintAmount) => {
        const isPopular = data.some((post: MintBoardPost) => post.id === postId);
        if (isPopular) {
            mutate((popularPosts) => {
                return popularPosts.map((post: MintBoardPost) => {
                    if (post.id === postId) {
                        return { ...post, totalMints: post.totalMints + mintAmount }
                    }
                    return post;
                })
            })
        }
    }


    const deletePopularPost = (postId: string) => {
        const isPopular = data.some((post: MintBoardPost) => post.id === postId);
        if (isPopular) {
            mutate((popularPosts) => {
                return popularPosts.filter((post: MintBoardPost) => post.id !== postId)
            })
        }
    }


    return { data, error, isLoading, mutate, mintPopularPost, deletePopularPost }

}

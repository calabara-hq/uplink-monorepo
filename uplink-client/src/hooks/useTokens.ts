"use client";
import useSWRInfinite from "swr/infinite";
import { FetchFiniteChannelTokensV2Response, FetchPopularTokensResponse, FetchTokenIntentsResponse, FetchTokensV1Response, FetchTokensV2Response } from "@/lib/fetch/fetchTokensV2";
import { ContractID } from "@/types/channel";
import { useCallback } from "react";

export const fetchTokensV1_client = async (contractId: ContractID, pageSize: number, skip: number): Promise<FetchTokensV1Response> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/channel_tokensV1?contractId=${contractId}&pageSize=${pageSize}&skip=${skip}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then(res => res.json())

}

export const fetchTokensV2_client = async (contractId: ContractID, pageSize: number, skip: number): Promise<FetchTokensV2Response> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/channel_tokensV2?contractId=${contractId}&pageSize=${pageSize}&skip=${skip}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then(res => res.json())
}

export const fetchFiniteTokensV2_client = async (contractId: ContractID, pageSize: number, skip: number): Promise<FetchFiniteChannelTokensV2Response> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/channel_finiteTokensV2?contractId=${contractId}&pageSize=${pageSize}&skip=${skip}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then(res => res.json())
}

export const fetchPopularTokens_client = async (contractId: ContractID, pageSize: number, skip: number): Promise<FetchPopularTokensResponse> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/channel_popularTokens?contractId=${contractId}&pageSize=${pageSize}&skip=${skip}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then(res => res.json())
}


export const fetchTokenIntents_client = async (contractId: ContractID, pageSize: number, skip: number): Promise<FetchTokenIntentsResponse> => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/channel_tokenIntents?contractId=${contractId}&pageSize=${pageSize}&skip=${skip}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then(res => res.json())
}


type GetPageKey = [string, ContractID, string, number, number]


export const usePaginatedMintBoardIntents = (contractId: ContractID) => {

    const getKey = (pageIndex: number, previousPageData: FetchTokenIntentsResponse): GetPageKey => {
        // The first page has an index of 0
        if (pageIndex === 0) return ['mintBoard', contractId, 'intents', 50, 0];

        // Return null to stop fetching if there are no more pages
        if (!previousPageData.pageInfo.hasNextPage) return null;

        // Use the endCursor from the previous page for the next page
        return ['mintBoard', contractId, 'intents', 50, pageIndex * previousPageData.pageInfo.endCursor];
    };


    const { data, error, size, setSize, mutate } = useSWRInfinite(
        getKey,
        ([, contractId, , limit, lastCursor]) => fetchTokenIntents_client(contractId, limit, lastCursor)
    );



    const locatePageOfPost = (pages: Array<FetchTokenIntentsResponse>, id: string) => {

        for (let i = 0; i < pages.length; i++) {
            for (let j = 0; j < pages[i].data.length; j++) {
                if (pages[i].data[j].id === id) {
                    return { pageIndex: i, postIndex: j }
                }
            }

        }

        return null;
    }

    const triggerIntentSponsorship = (id: string, mintAmount: string) => {
        deletePaginatedPost(id);
    }

    const deletePaginatedPost = (id: string) => {
        const { pageIndex, postIndex } = locatePageOfPost(data, id);

        mutate((currentPageData) => {
            return currentPageData.map((page, index) => {
                if (index !== pageIndex) return page;

                return {
                    ...page,
                    data: page.data.filter((_, idx) => idx !== postIndex)
                };
            });
        }, {
            revalidate: false
        })
    }

    return {
        data,
        error,
        size,
        setSize,
        triggerIntentSponsorship,
        deletePaginatedPost
    };

}

export const usePaginatedMintBoardPosts = (contractId: ContractID) => {

    const getKey = (pageIndex: number, previousPageData: FetchTokensV2Response): GetPageKey => {
        // The first page has an index of 0
        if (pageIndex === 0) return ['mintBoard', contractId, 'posts', 50, 0];

        // Return null to stop fetching if there are no more pages
        if (!previousPageData.pageInfo.hasNextPage) return null;

        // Use the endCursor from the previous page for the next page
        return ['mintBoard', contractId, 'posts', 50, pageIndex * previousPageData.pageInfo.endCursor];
    };


    const { data, error, size, setSize, mutate } = useSWRInfinite(
        getKey,
        ([, contractId, , limit, lastCursor]) => fetchFiniteTokensV2_client(contractId, limit, lastCursor)
    );

    const locatePageOfPost = (pages: Array<FetchTokensV2Response>, tokenId: string) => {

        for (let i = 0; i < pages.length; i++) {
            for (let j = 0; j < pages[i].data.length; j++) {
                if (pages[i].data[j].tokenId === tokenId) {
                    return { pageIndex: i, postIndex: j }
                }
            }

        }

        return null;
    }

    const mintPaginatedPost = (tokenId: string, mintAmount: string) => {
        const { pageIndex, postIndex } = locatePageOfPost(data, tokenId);
        mutate((currentPageData) => {
            return currentPageData.map((page, index) => {
                if (index !== pageIndex) return page;

                return {
                    ...page,
                    data: page.data.map((post, idx) => {
                        if (idx !== postIndex) return post;
                        return { ...post, totalMinted: (parseInt(post.totalMinted) + parseInt(mintAmount)).toString() };
                    }),
                };
            });
        }, {
            revalidate: false
        }); // avoid revalidation after mutation

    }

    const receiveSponsorship = () => {
        mutate();
    }

    const deletePaginatedPost = (tokenId: string) => {
        const { pageIndex, postIndex } = locatePageOfPost(data, tokenId);

        mutate((currentPageData) => {
            return currentPageData.map((page, index) => {
                if (index !== pageIndex) return page;

                return {
                    ...page,
                    data: page.data.filter((_, idx) => idx !== postIndex)
                };
            });
        }, {
            revalidate: false
        })

    }

    return {
        data,
        error,
        size,
        setSize,
        mintPaginatedPost,
        receiveSponsorship,
        deletePaginatedPost
    };

}

export const usePaginatedFinitePosts = (contractId: ContractID) => {

    const getKey = (pageIndex: number, previousPageData: FetchFiniteChannelTokensV2Response): GetPageKey => {
        // The first page has an index of 0
        if (pageIndex === 0) return ['contest', contractId, 'posts', 50, 0];

        // Return null to stop fetching if there are no more pages
        if (!previousPageData.pageInfo.hasNextPage) return null;

        // Use the endCursor from the previous page for the next page
        return ['contest', contractId, 'posts', 50, pageIndex * previousPageData.pageInfo.endCursor];
    };


    const { data, error, size, setSize, mutate } = useSWRInfinite(
        getKey,
        ([, contractId, , limit, lastCursor]) => fetchFiniteTokensV2_client(contractId, limit, lastCursor)
    );

    const locatePageOfPost = (pages: Array<FetchTokensV2Response>, tokenId: string) => {

        for (let i = 0; i < pages.length; i++) {
            for (let j = 0; j < pages[i].data.length; j++) {
                if (pages[i].data[j].tokenId === tokenId) {
                    return { pageIndex: i, postIndex: j }
                }
            }

        }

        return null;
    }

    const mintPaginatedPost = (tokenId: string, mintAmount: string) => {
        const { pageIndex, postIndex } = locatePageOfPost(data, tokenId);
        mutate((currentPageData) => {
            return currentPageData.map((page, index) => {
                if (index !== pageIndex) return page;

                return {
                    ...page,
                    data: page.data.map((post, idx) => {
                        if (idx !== postIndex) return post;
                        return { ...post, totalMinted: (parseInt(post.totalMinted) + parseInt(mintAmount)).toString() };
                    }),
                };
            });
        }, {
            revalidate: false
        }); // avoid revalidation after mutation

    }


    const receiveSponsorship = () => {
        mutate();
    }

    const deletePaginatedPost = (tokenId: string) => {
        const { pageIndex, postIndex } = locatePageOfPost(data, tokenId);

        mutate((currentPageData) => {
            return currentPageData.map((page, index) => {
                if (index !== pageIndex) return page;

                return {
                    ...page,
                    data: page.data.filter((_, idx) => idx !== postIndex)
                };
            });
        }, {
            revalidate: false
        })

    }

    return {
        data,
        error,
        size,
        setSize,
        mintPaginatedPost,
        receiveSponsorship,
        deletePaginatedPost
    };

}


export const usePaginatedMintBoardPostsV1 = (contractId: ContractID) => {

    const getKey = (pageIndex: number, previousPageData: FetchTokensV1Response): GetPageKey => {
        // The first page has an index of 0
        if (pageIndex === 0) return ['mintBoard', contractId, 'postsV1', 50, 0];

        // Return null to stop fetching if there are no more pages
        if (!previousPageData.pageInfo.hasNextPage) return null;

        // Use the endCursor from the previous page for the next page
        return ['mintBoard', contractId, 'postsV1', 50, pageIndex * previousPageData.pageInfo.endCursor];
    };


    const { data, error, size, setSize, mutate } = useSWRInfinite(
        getKey,
        ([, contractId, , limit, lastCursor]) => fetchTokensV1_client(contractId, limit, lastCursor)
    );

    return {
        data,
        error,
        size,
        setSize
    };

}


export const usePaginatedPopularTokens = (contractId: ContractID) => {

    const getKey = (pageIndex: number, previousPageData: FetchTokensV2Response): GetPageKey => {
        // The first page has an index of 0
        if (pageIndex === 0) return ['mintBoard', contractId, 'popular', 50, 0];

        // Return null to stop fetching if there are no more pages
        if (!previousPageData.pageInfo.hasNextPage) return null;

        // Use the endCursor from the previous page for the next page
        return ['mintBoard', contractId, 'popular', 50, pageIndex * previousPageData.pageInfo.endCursor];
    };

    const { data, error, size, setSize, mutate } = useSWRInfinite(
        getKey,
        ([, contractId, , limit, lastCursor]) => fetchPopularTokens_client(contractId, limit, lastCursor)
    );

    return {
        data,
        error,
        size,
        setSize
    };
}
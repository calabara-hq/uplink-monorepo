import useSWR from "swr";
import { mutateSpaces, mutateSubmissions } from "@/app/mutate";
import { useEffect } from "react";
import { Submission } from "@/types/submission";
import { Space } from "@/types/space";

// local client side fetch, don't use the server-only fetch
const fetchSingleSpace = async (name: string): Promise<Space> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        body: JSON.stringify({
            query: `
            query space($name: String!){
              space(name: $name) {
                id
                name
                displayName
                logoUrl
                twitter
                website
                admins{
                    address
                }
                spaceTokens {
                  token {
                    type
                    address
                    decimals
                    symbol
                    tokenId
                    chainId
                  }
                }
                mintBoard {
                  id
                  chainId
                  enabled
                  boardTitle
                  boardDescription
                  name
                  symbol
                  editionSize
                  publicSalePrice
                  publicSaleStart
                  publicSaleEnd
                  description
                  referrer
                  submissions {
                    id
                    chainId
                    contractAddress
                    created
                    dropConfig
                    spaceId
                    author {
                      id
                      address
                    }
                  }
                }
              }
          }`,
            variables: {
                name,
            },
        }),
    })
        .then((res) => res.json())
        .then((res) => res.data.space)
    return data;
};



const useLiveMintBoard = (spaceName: string) => {
    const {
        data: liveBoard,
        isLoading: isBoardLoading,
        error: isBoardError,
        mutate: mutateSWRBoard,
    }: { data: Space; isLoading: boolean; error: any; mutate: any } = useSWR(
        `mintBoard/${spaceName}`,
        () => fetchSingleSpace(spaceName),
        { refreshInterval: 10000 }
    );

    const mutateLiveBoard = () => {
        mutateSWRBoard(); // mutate the SWR cache
        mutateSpaces(spaceName); // mutate the server cache
    };

    return {
        liveBoard,
        isBoardLoading,
        isBoardError,
        mutateLiveBoard,
    }
}


export default useLiveMintBoard;
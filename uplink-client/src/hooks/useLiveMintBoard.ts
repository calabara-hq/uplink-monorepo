import useSWR from "swr";
import { mutateMintBoard, mutateSpaces, mutateSubmissions } from "@/app/mutate";
import { useEffect } from "react";
import { Submission } from "@/types/submission";
import { Space } from "@/types/space";
import { MintBoard } from "@/types/mintBoard";

// local client side fetch, don't use the server-only fetch
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
                logoUrl
                name
                displayName
              }
              enabled
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
          }
      }`,
      variables: {
        spaceName,
      },
    }),
  })
    .then((res) => res.json())
    .then((res) => res.data.mintBoard)
  return data;
};



const useLiveMintBoard = (spaceName: string) => {
  const {
    data: liveBoard,
    isLoading: isBoardLoading,
    error: isBoardError,
    mutate: mutateSWRBoard,
  }: { data: MintBoard; isLoading: boolean; error: any; mutate: any } = useSWR(
    `/mintBoard/${spaceName}`,
    () => fetchMintBoard(spaceName),
    { refreshInterval: 10000 }
  );

  const mutateLiveBoard = () => {
    mutateSWRBoard(); // mutate the SWR cache
    mutateMintBoard(spaceName); // mutate the server cache
  };

  const optimisticMintUpdate = (editionId: string, mintAmount: number) => {
    mutateSWRBoard({
      ...liveBoard,
      posts: liveBoard.posts.map((post) => {
        if (post.edition.id === editionId) {
          return {
            ...post,
            totalMints: post.totalMints + mintAmount,
          };
        }
        return post;
      })
    });
  };

  return {
    liveBoard,
    isBoardLoading,
    isBoardError,
    mutateLiveBoard,
    optimisticMintUpdate
  }
}


export default useLiveMintBoard;
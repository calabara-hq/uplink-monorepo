import useSWR from "swr";
import { MintBoard } from "@/types/mintBoard";

// local client side fetch, don't use the server-only fetch
const fetchMintBoard = async (spaceName: string): Promise<MintBoard> => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  })
    .then((res) => res.json())
    .then((res) => res.data.mintBoard)
  return data;
};



const useMintBoardConfig = (spaceName: string) => {
  const {
    data: mintBoardConfig,
    isLoading: isBoardLoading,
    error: isBoardError,
  }: { data: MintBoard; isLoading: boolean; error: any; mutate: any } = useSWR(
    `/mintBoard/${spaceName}`,
    () => fetchMintBoard(spaceName),
  );



  return {
    mintBoardConfig,
    isBoardLoading,
    isBoardError,
  }
}


export const useMintBoardThreshold = (spaceName: string) => {
  const {
    data: mintBoardConfig,
    isLoading: isBoardLoading,
    error: isBoardError,
  }: { data: MintBoard; isLoading: boolean; error: any; mutate: any } = useSWR(
    `/mintBoard/${spaceName}`,
    () => fetchMintBoard(spaceName),
  );

  return {
    mintBoardConfig,
    isBoardLoading,
    isBoardError,
  }
}


export default useMintBoardConfig;
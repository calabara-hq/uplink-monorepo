import { Space } from "@/types/space";
import handleNotFound from "../handleNotFound";
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
                    logoUrl
                    name
                    displayName
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
        next: { tags: [`mintBoard/${spaceName}`], revalidate: 60 },
    })
        .then((res) => res.json())
        .then((res) => res.data.mintBoard)
        .then(handleNotFound);
    return data;
};

export default fetchMintBoard;
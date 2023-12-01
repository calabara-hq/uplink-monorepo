import { Space } from "@/types/space";
import handleNotFound from "../handleNotFound";

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
            }
        }`,
      variables: {
        name,
      },
    }),
    next: { tags: [`space/${name}`], revalidate: 60 },
  })
    .then((res) => res.json())
    .then((res) => res.data.space)
    .then(handleNotFound);
  return data;
};

export default fetchSingleSpace;
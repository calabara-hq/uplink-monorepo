import handleNotFound from "@/lib/handleNotFound";
import { Space } from "@/types/space";
import ContestForm from "@/ui/ContestForm/Entrypoint";

const getSpace = async (name: string) => {
  const data: Space = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-TOKEN": process.env.API_SECRET,
    },
    body: JSON.stringify({
      query: `
        query space($name: String!){
          space(name: $name) {
            id
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
    .then(handleNotFound)
    .then((res) => res.data.space);
  return data;
};

export default async function Page({ params }: { params: { name: string } }) {
  const { id, spaceTokens } = await getSpace(params.name);
  return (
    <div className="w-11/12 h-full lg:w-9/12 m-auto">
      <ContestForm
        spaceName={params.name}
        spaceId={id}
        spaceTokens={spaceTokens.map((t) => t.token)}
      />
    </div>
  );
}

import ContestForm from "@/ui/ContestForm/ContestForm";
import graphqlClient from "@/lib/graphql/initUrql";
import { SpaceDocument } from "@/lib/graphql/spaces.gql";

const getSpace = async (name: string) => {
  const results = await graphqlClient
    .query(SpaceDocument, { name })
    .toPromise();
  console.log(results);
  if (results.error) {
    throw new Error(results.error.message);
  }
  return results;
};

export default async function Page({ params }: { params: { name: string } }) {
  const result = await getSpace(params.name);
  const spaceId = result.data.space.id;
  return <ContestForm spaceId={spaceId} spaceName={params.name} />;
}

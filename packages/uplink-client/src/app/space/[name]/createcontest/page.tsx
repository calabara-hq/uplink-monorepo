import ContestForm from "@/ui/ContestForm/ContestForm";
import graphqlClient from "@/lib/graphql/initUrql";
import { SpaceDocument } from "@/lib/graphql/spaces.gql";
import { ContestByIdDocument } from "@/lib/graphql/contests.gql";

const getSpace = async (name: string) => {
  const results = await graphqlClient
    .query(SpaceDocument, { name })
    .toPromise();
  if (results.error) {
    throw new Error(results.error.message);
  }
  return results;
};

const getContest = async (contestId: string) => {
  const results = await graphqlClient
    .query(ContestByIdDocument, { contestId: parseInt(contestId) })
    .toPromise();
  console.log(results);
  if (results.error) {
    throw new Error(results.error.message);
  }
  return results;
};

export default async function Page({ params }: { params: { name: string } }) {
  const result = await getSpace(params.name);
  const contest = await getContest('435');
  const spaceId = result.data.space.id;
  return <ContestForm spaceId={spaceId} spaceName={params.name} />;
}

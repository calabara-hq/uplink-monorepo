import "server-only";
import graphqlClient, { stripTypenames } from "@/lib/graphql/initUrql";
import { SpaceDocument } from "@/lib/graphql/spaces.gql";
import SpaceForm from "@/ui/SpaceForm/SpaceForm";

// get the space data from server and pass it to the form via initial state

const getSpace = async (id: string) => {
  const results = await graphqlClient.query(SpaceDocument, { id }).toPromise();
  if (results.error) throw new Error(results.error.message);
  if (!results.data.space) throw new Error("Space not found");

  const { contests, id: spaceId, ...data } = stripTypenames(results.data.space);

  return {
    ...data,
    logoBlob: data.logoUrl,
    admins: data.admins.map((admin: any) => admin.address),
    errors: {
      admins: Array(data.admins.length).fill(null),
    },
  };
};

export default async function Page({ params }: { params: { id: string } }) {
  const initialState = await getSpace(params.id);
  return (
    <SpaceForm
      initialState={initialState}
      isNewSpace={false}
      spaceId={params.id}
    />
  );
}

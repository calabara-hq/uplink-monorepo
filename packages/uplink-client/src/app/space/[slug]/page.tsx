import { SpaceDocument } from "@/lib/graphql/spaces.gql";
import graphqlClient from "@/lib/graphql/initUrql";
import { slugToName } from "@/lib/slug";

// return the space data and contests

const getSpace = async (name: string) => {
  console.log(name)
  const results = await graphqlClient.query(SpaceDocument, { name }).toPromise();
  if (results.error) throw new Error(results.error.message);
  if (!results.data.space) throw new Error("Space not found");
  return results.data;
};

export default async function Page({ params }: { params: { slug: string } }) {
  try {
    const spaceData = await getSpace(slugToName(params.slug));
    console.log(spaceData);
    const { space, spaceContests } = spaceData;
    return <pre className="text-white">{JSON.stringify(spaceData, null, 2)}</pre>;
  } catch (e) {
    console.log(e);
    return <h1 className="text-white">oops, we couldnt find that space!</h1>;
  }
}

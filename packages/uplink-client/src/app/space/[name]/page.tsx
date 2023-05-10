import { SpaceDocument } from "@/lib/graphql/spaces.gql";
import graphqlClient from "@/lib/graphql/initUrql";
import Link from "next/link";

// return the space data and contests

const getSpace = async (name: string) => {
  const results = await graphqlClient
    .query(SpaceDocument, { name })
    .toPromise();
  if (results.error) throw new Error(results.error.message);
  if (!results.data.space) throw new Error("Space not found");
  return results.data;
};

export default async function Page({ params }: { params: { name: string } }) {
  try {
    const spaceData = await getSpace(params.name);
    const { space, spaceContests } = spaceData;
    return (
      <div>
        <Link href={`/spacebuilder/edit/${spaceData.space.id}`}>
          edit space
        </Link>
        <br></br>
        <Link href={`space/${params.name}/createcontest`}>create contest</Link>
        <pre className="text-white">{JSON.stringify(spaceData, null, 2)}</pre>
      </div>
    );
  } catch (e) {
    console.log(e);
    return <h1 className="text-white">oops, we couldnt find that space!</h1>;
  }
}

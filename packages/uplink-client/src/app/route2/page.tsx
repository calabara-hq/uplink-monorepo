import Link from "next/link";
import { AllSpacesDocument } from "@/lib/graphql/spaces.gql";
import graphqlClient from "@/lib/graphql/initUrql";

//console.log('revalidating')

//export const revalidate = 10;
//export const dynamic = "force-static";
//export const revalidate = 10;

const getSpaces = async () => {
  const results = await graphqlClient.query(AllSpacesDocument, {}).toPromise();
  if (results.error) {
    throw new Error(results.error.message);
  }
  return results;
};

export default async function Page() {
  console.log("entering page");
  const spaces = await getSpaces();
  return (
    <div>
      <p>hello from route2</p>
      <Link href="/route1">back to route 1</Link>

      <pre>{JSON.stringify(spaces.data, null, 2)}</pre>
      <pre>key: {JSON.stringify(spaces.operation.key, null, 2)}</pre>
      <pre>{JSON.stringify(spaces.operation.context.meta, null, 2)}</pre>
    </div>
  );
}

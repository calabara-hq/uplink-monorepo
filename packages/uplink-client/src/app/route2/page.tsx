import Link from "next/link";
import { AllSpacesDocument } from "@/lib/graphql/spaces.gql";
/*
import graphqlClient from "@/lib/graphql/initUrql";

const getSpaces = async () => {
  const results = await graphqlClient.query(AllSpacesDocument, {}).toPromise();
  if (results.error) {
    throw new Error(results.error.message);
  }
  console.log(results)
  return results;
};
*/

export default async function Page() {
  console.log("re rendering page");
  //const spaces = await getSpaces();
  return (
    <div>
      <p>hello from route2</p>
      <Link className="btn" href="/route1">
        back to route 1
      </Link>
    </div>
  );
}

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
  const spaces = await getSpaces();
  return (
    <div>
      <Link className="btn" href="/">
        go home
      </Link>

      {spaces.data.spaces.map((space, index) => {
        return (
          <div key={index}>
            <div className="card card-compact w-96 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{space.name}</h2>
                <p></p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Take me there</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

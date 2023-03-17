import Link from "next/link";
import { AllSpacesDocument } from "@/lib/graphql/spaces.gql";
import graphqlClient from "@/lib/graphql/initUrql";

//console.log('revalidating')

//export const revalidate = 10;
//export const dynamic = "force-static";
//export const revalidate = 10;

const getSpaces = async () => {
  console.log('entering getSpaces')
  const results = await graphqlClient.query(AllSpacesDocument, {}).toPromise();
  console.log(results)
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
      <Link className="btn" href="/spacebuilder/create">
        create
      </Link>
      <div className="grid grid-cols-4 gap-4 mt-10">
        {spaces.data.spaces.map((space: any, index: any) => {
          return (
            <div key={index}>
              <div className="card card-compact w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">{space.name}</h2>
                  <p></p>
                  <div className="card-actions justify-end">
                    <Link
                      className="btn btn-primary"
                      href={`/space/${space.id}`}
                    >
                      Take me there
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

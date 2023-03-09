import Link from "next/link";
import Image from "next/image";
import { AllSpacesDocument } from "@/lib/graphql/spaces.gql";
import graphqlClient from "@/lib/graphql/initUrql";

//console.log('revalidating')

//export const revalidate = 10;
//export const dynamic = "force-static";
//export const revalidate = 10;

export function SpaceMap({ spaces }: any) {
  return (
    <div
      className="grid gap-6 py-6
  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {spaces.data.spaces.map((space: any, index: any) => {
        return (
          <Link key={index} href={`/space/${space.id}`}>
            <div
              className="card card-compact bg-blue-900 shadow-xl
          transition-all duration-300 ease-linear
          cursor-pointer hover:rounded-xl rounded-3xl"
            >
              <div className="card-body items-center">
                <div className="avatar">
                  <div className="w-28 rounded-full bg-base-100">
                    <Image
                      src={"/noun-47.png"}
                      alt={"org avatar"}
                      height={150}
                      width={150}
                    />
                  </div>
                </div>

                <h2 className="card-title mb-0">{space.name}</h2>
                <div className="card-actions justify-end">
                  <p>{space.members}</p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

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
      <Link className="btn" href="/spacebuilder/create">
        create
      </Link>
      <SpaceMap spaces={spaces} />
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { AllSpacesDocument } from "@/lib/graphql/spaces.gql";
import graphqlClient from "@/lib/graphql/initUrql";
import { AllSpaces } from "./data";

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
  console.log(spaces.data.spaces);
  return (
    <div>
      <div className="flex flex-col md:flex-row p-1 gap-4">
        <Link className="btn btn-primary" href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <p className="pl-2">home</p>
        </Link>

        <Link className="btn" href="/spacebuilder/create">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="pl-2">create</p>
        </Link>
        <div className="form-control ml-auto">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search…"
              className="input input-bordered"
            />
            <button className="btn btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <AllSpaces spaces={spaces} />
    </div>
  );
}

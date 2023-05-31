import Link from "next/link";
import Image from "next/image";
import { AllSpacesDocument } from "@/lib/graphql/spaces.gql";
import graphqlClient from "@/lib/graphql/initUrql";

import { AllSpaces } from "./data";
import { SearchBar } from "@/ui/SearchBar/SearchBar";
import { HomeIcon, PlusIcon } from "@heroicons/react/24/solid";
import TwitterConnectButton from "@/ui/TwitterConnectButton/TwitterConnectButton";
import CreateThread from "@/ui/CreateThread/CreateThread";

//console.log('revalidating')

//export const revalidate = 10;
//export const dynamic = "force-static";
//export const revalidate = 10;

const getSpaces = async () => {
  const results = await graphqlClient.query(AllSpacesDocument, {}).toPromise();
  console.log(results);
  if (results.error) {
    throw new Error(results.error.message);
  }
  return results;
};

export default async function Page() {
  const spaces = await getSpaces();
  console.log(spaces.data.spaces);
  return (
    <div className="flex flex-col w-full justify-center m-auto py-12 lg:w-4/5 gap-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Link className="btn" href="/">
          <HomeIcon className="h-6 w-6" />
          <p className="pl-2">home</p>
        </Link>
        <Link className="btn btn-primary lg:mr-auto" href="/spacebuilder/create">
          <PlusIcon className="w-6 h-6" />
          <p className="pl-2">new space</p>
        </Link>

        <SearchBar />
      </div>
      
      <div className="flex flex-row justify-evenly">
        <TwitterConnectButton />
        <CreateThread />
      </div>
    
      <AllSpaces spaces={spaces} />
    </div>
  );
}

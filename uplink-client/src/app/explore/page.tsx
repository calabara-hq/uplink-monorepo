import Link from "next/link";
import Image from "next/image";
import { nanoid } from "nanoid";
import { SearchBar } from "@/ui/SearchBar/SearchBar";
import { HiHome, HiPlus } from "react-icons/hi2";

const getSpaces = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query Spaces{
        spaces{
            name
            displayName
            members
            logoUrl
        }
    }`,
    }),
    next: { tags: ["spaces"], revalidate: 60 },
  }).then((res) => res.json());
  return data;
};

export default async function Page() {
  const spaces = await getSpaces();
  return (
    <div className="flex flex-col w-full justify-center m-auto py-12 lg:w-4/5 gap-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Link className="btn" href="/">
          <HiHome className="h-6 w-6" />
          <p className="pl-2">home</p>
        </Link>
        <Link
          className="btn btn-primary lg:mr-auto"
          href="/spacebuilder/create"
        >
          <HiPlus className="w-6 h-6" />
          <p className="pl-2">new space</p>
        </Link>

        <SearchBar />
      </div>
      <AllSpaces spaces={spaces} />
    </div>
  );
}


function AllSpaces({ spaces }: any) {
  
  return (
    <div
      className="grid gap-12 py-6
      grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-2/3 md:w-10/12 lg:w-full mr-auto ml-auto"
    >
      {spaces.data.spaces.map((space: any, index: number) => {
        return (
          <div
            key={index}
            className="card card-compact rounded-xl bg-base-100 border border-border"
          >
            <Link
              href={`${space.name}`}
              prefetch={false}
              className="relative h-56 transition-all duration-150 ease-linear
              cursor-pointer hover:scale-105 rounded-3xl"
            >
              <Image
                src={space.logoUrl}
                alt="space logo"
                fill
                className="rounded-xl object-cover w-full"
              />
            </Link>
            <div className="card-body h-fit rounded-b-xl w-full">
              <div>
                <Link
                  prefetch={false}
                  href={`${space.name}`}
                  className="card-title text-2xl hover:text-white"
                >
                  {space.name}
                </Link>
                {/* TODO: will be added in a future release 
                <div className="flex items-center w-fit gap-1">
                  <p>{space.members} members</p>
                  <span className="text-gray-500 ml-2">•</span>
                  <button className="btn btn-sm btn-ghost underline mr-auto lowercase">
                    Join
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

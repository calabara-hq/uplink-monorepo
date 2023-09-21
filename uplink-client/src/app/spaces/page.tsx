import Link from "next/link";
import Image from "next/image";
import { HiPlus } from "react-icons/hi2";
import { Metadata } from "next";
import { baseMetadata } from "../base-metadata";

export const metadata: Metadata = {
  ...baseMetadata,
  description: "Spaces",
  openGraph: {
    ...baseMetadata.openGraph,
    title: "Spaces",
    description: "Explore spaces on Uplink",
  },
};

const getSpaces = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
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
  })
    .then((res) => res.json())
    .then((res) => res.data.spaces);
};

const AllSpaces = ({ spaces }) => {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-fr w-full ">
      {spaces.map((space: any, index: number) => {
        return (
          <Link
            key={index}
            href={`${space.name}`}
            className="flex flex-col items-center justify-center gap-4 bg-base animate-scrollInX
            cursor-pointer border border-border rounded-2xl p-4 full overflow-hidden w-full transform 
            transition-transform duration-300 hoverCard will-change-transform no-select"
          >
            <div className="relative w-28 h-28">
              <Image
                src={space.logoUrl}
                fill
                alt="spaceLogo"
                className="object-contain mask mask-circle"
                sizes={"10vw"}
              />
            </div>
            <div className="flex items-center justify-center gap-1 truncate">
              <h1 className="overflow-hidden text-xl font-semibold">
                {space.displayName.length > 15
                  ? space.displayName.slice(0, 15) + "..."
                  : space.displayName}
              </h1>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default async function Page() {
  const spaces = await getSpaces();
  return (
    <div className="flex flex-col w-11/12 lg:w-9/12 m-auto justify-center py-12 gap-4">
      <div className="flex items-center gap-4 justify-end font-bold">
        <Link
          className="btn btn-primary btn-outline normal-case"
          href="/spacebuilder/create"
          draggable={false}
        >
          <HiPlus className="w-6 h-6" />
          <p className="pl-2">New Space</p>
        </Link>
      </div>
      <AllSpaces spaces={spaces} />
    </div>
  );
}

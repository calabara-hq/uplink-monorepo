import Link from "next/link";
import Image from "next/image";
import { HiPlus } from "react-icons/hi2";
import { Metadata } from "next";
import fetchSpaces from "@/lib/fetch/fetchSpaces";
import { Suspense } from "react";

export const metadata: Metadata = {
  openGraph: {
    title: "Uplink",
    description: "Discover spaces on Uplink.",
    url: "/",
    siteName: "Uplink",
    images: [
      {
        url: "/opengraph.png",
        width: 400,
        height: 600,
        alt: "Uplink",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const ListSpaces = async () => {
  const spaces = await fetchSpaces();
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-fr w-full ">
      {spaces.map((space: any, index: number) => {
        return (
          <Link
            key={index}
            draggable={false}
            href={`${space.name}`}
            className="flex flex-col items-center justify-center gap-4 bg-base 
              cursor-pointer border border-border rounded-2xl p-4 full overflow-hidden w-full transform 
              transition-transform duration-300 hoverCard will-change-transform no-select"
          >
            <div className="relative w-28 h-28">
              <Image
                src={space.logoUrl}
                fill
                alt="spaceLogo"
                className="object-cover mask mask-circle"
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

const SpaceListSkeleton = () => {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-fr w-full ">
      {[...Array(20)].map((_, index) => {
        return (
          <div key={index} className="h-[190px] shimmer bg-base-100 rounded-xl"></div>
        );
      })}
    </div>
  );
};

export default async function Page() {
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
      <Suspense fallback={<SpaceListSkeleton />}>
        {/* render empty div so it doesn't mess with our animation */}
        {/*@ts-expect-error*/}
        <ListSpaces />
      </Suspense>
    </div>
  );
}

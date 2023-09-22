"use client";
import fetchSpaces from "@/lib/fetch/fetchSpaces";
import { revalidateTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { revalidateDataCache } from "../actions";
import { startTransition } from "react";

export const useListSpaces = () => {
  const {
    data: spaces,
    isLoading: areSpacesLoading,
    error: isSpaceError,
    mutate,
  }: { data: any; isLoading: boolean; error: any; mutate: any } = useSWR(
    "spaces",
    () => fetchSpaces()
  );

  const mutateSpaces = async () => {
    mutate(); // reval client cache
    startTransition(() => {
      revalidateDataCache(["spaces"]); // reval server cache
    });
  };

  return {
    spaces,
    areSpacesLoading,
    isSpaceError,
    mutateSpaces,
  };
};

const ListSpaces = () => {
  const { spaces } = useListSpaces();

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

export default ListSpaces;

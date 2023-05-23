"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { SearchBar } from "@/ui/SearchBar/SearchBar";
import { sub } from "date-fns";

export function AllSpaces({ spaces }: any) {
  const [joinedSpaces, setJoinedSpaces] = useState<string[]>([]);

  const handleJoinClick = (e: React.MouseEvent, spaceName: string) => {
    e.stopPropagation(); // Prevent click propagation to outer div
    if (joinedSpaces.includes(spaceName)) {
      // If already joined, remove from joinedSpaces
      setJoinedSpaces(joinedSpaces.filter((name) => name !== spaceName));
    } else {
      // If not joined, add to joinedSpaces
      setJoinedSpaces([...joinedSpaces, spaceName]);
    }
  };

  return (
    <>
      <div
        className="grid gap-4 py-6
      grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center w-full"
      >
        {spaces.data.spaces.map((space: any, index: number) => {
          const isJoined = joinedSpaces.includes(space.name);

          return (
            <>
              <Link key={index} href={`/space/${space.name}`}>
                <div
                  className="card card-compact hover:shadow-box bg-base-100
              transition-all duration-300 ease-linear
              cursor-pointer hover:scale-105 rounded-3xl w-[300px] h-[350px]"
                >
                  <figure className="relative h-2/3 ">
                    <Image
                      src={space.logoUrl}
                      alt="submission image"
                      fill
                      className="rounded-t-xl object-cover w-full"
                    />
                  </figure>
                  <div className="card-body items-center">
                    <h2 className="card-title mb-0">{space.name}</h2>
                    <div className="card-actions justify-end">
                      <p>{space.members} members</p>
                    </div>
                    <button
                      className={`btn btn-xs ${
                        isJoined ? "btn-outline btn-active" : "btn-outline"
                      }`}
                      onClick={(e) => handleJoinClick(e, space.name)}
                    >
                      {isJoined ? "Joined" : "Join"}
                    </button>
                  </div>
                </div>
              </Link>
            </>
          );
        })}
      </div>
    </>
  );
}


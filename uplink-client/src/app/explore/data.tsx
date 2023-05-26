"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { SearchBar } from "@/ui/SearchBar/SearchBar";

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
      grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {spaces.data.spaces.map((space: any, index: number) => {
          const isJoined = joinedSpaces.includes(space.name);
          

          return (
            <Link key={index} href={`/space/${space.name}`}>
              <div
                className="card card-compact bg-base-100 hover:shadow-box
              transition-all duration-300 ease-linear
              cursor-pointer hover:scale-105 rounded-3xl"
              >
                <div className="card-body items-center">
                  <div className="avatar">
                    <div className="w-24 rounded-full bg-base-100">
                      <Image
                        src={"/noun-47.png"}
                        alt={"org avatar"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

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
          );
        })}
      </div>
    </>
  );
}

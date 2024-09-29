"use client";;
import { Space } from "@/types/space";
import { useEffect, useRef, useState } from "react";
import UplinkImage from "@/lib/UplinkImage";
import Link from "next/link";
import { Input } from "@/ui/DesignKit/Input";


const isFuzzyMatch = (str1: string, str2: string, maxEdits: number = 1) => {
    let edits = 0;
    const len = Math.min(str1.length, str2.length);
    for (let i = 0; i < len; i++) {
        if (str1[i] !== str2[i]) {
            edits++;
            if (edits > maxEdits) {
                return false;
            }
        }
    }
    return true;
}

const normalizeString = (str: string) => {
    return str.trim().replace(/\s+/g, '').toLowerCase();
}


export const SearchSpaces = ({ allSpaces }: { allSpaces: Array<Space> }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSpaces, setFilteredSpaces] = useState([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const ref = useRef(null);

    // Handle input change
    const handleInput = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value) {
            setIsPopoverOpen(true);
            // Filter the spaces based on the search term
            // const results = allSpaces.filter((space) =>
            //     space.name.toLowerCase().includes(value.toLowerCase())
            // );

            const results = allSpaces.filter((space) =>
                isFuzzyMatch(normalizeString(space.displayName), normalizeString(value))
            );

            setFilteredSpaces(results.slice(0, 10));
        } else {
            setIsPopoverOpen(false);
            setFilteredSpaces([]);
        }
    };


    // Close the popover when clicking outside

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node) &&
                !event.composedPath().some((node) => node instanceof HTMLButtonElement)
            ) {
                setIsPopoverOpen(false);
            }
        };

        const handleClickInside = (event: MouseEvent) => {
            if (
                ref.current &&
                ref.current.contains(event.target as Node)
                && searchTerm.length > 0
            ) {
                setIsPopoverOpen(true);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("click", handleClickInside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("click", handleClickInside);
        };
    }, [ref]);


    return (
        <div className="flex flex-col w-full" ref={ref}>
            {/* Popover trigger with search input */}

            <Input
                type="text"
                variant="default"
                onChange={handleInput}
                placeholder="Search"
                value={searchTerm}
                className="h-10 max-w-full"
            />
            <div className="relative z-20 mt-2">
                {isPopoverOpen && filteredSpaces.length > 0 && (
                    <div className="w-full absolute  bg-base-100 shadow-lg rounded-lg">
                        <div className="flex flex-col w-full p-2 ">
                            {filteredSpaces.map((space, index) => (
                                <Link
                                    href={`/${space.name}`}
                                    key={index}
                                    className="flex flex-row items-center gap-2 p-2 hover:bg-base cursor-pointer rounded-lg"
                                >
                                    <div className="relative w-8 h-8 ">
                                        <UplinkImage
                                            src={space.logoUrl}
                                            alt={space.name}
                                            className="w-full rounded-full"
                                            fill
                                        />
                                    </div>
                                    <p className="text-t1">
                                        {space.displayName}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Optionally display a message if no results are found */}
                {isPopoverOpen && filteredSpaces.length === 0 && (
                    <div className="w-full absolute bg-base-100 shadow-lg rounded-lg">
                        <div className="flex flex-col w-full p-2">
                            <p className="p-2 text-gray-500">No results found</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

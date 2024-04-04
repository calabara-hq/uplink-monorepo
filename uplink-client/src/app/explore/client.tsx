"use client";

import {useRouter} from "next/navigation"


export const SearchSpaces = () => {
    const router = useRouter();

    const handleInput = (event) => {
        if(event.target.value === "") return router.push("/explore?all=true", {scroll: false});
        router.push(`/explore?all=true&query=${encodeURIComponent(event.target.value)}`, {scroll: false});
    }

    return (
        <input
            className="input input-bordered"
            onChange={handleInput}
            placeholder="search"
        />
    )
}
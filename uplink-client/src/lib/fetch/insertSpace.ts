"use client";;
import { handleV2MutationError } from "./handleV2MutationError";
import { SpaceSettingsOutput } from "@/hooks/useSpaceReducer";

export type InsertSpaceArgs = SpaceSettingsOutput & {
    csrfToken: string
    spaceId?: string
}


export const insertSpace = async (url,
    {
        arg,
    }: {
        url: string
        arg: InsertSpaceArgs
    }
) => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/insert_space`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": arg.csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
            spaceId: undefined,
            name: arg.name,
            logoUrl: arg.logoUrl,
            website: arg.website,
            admins: arg.admins,

        })
    })
        .then(handleV2MutationError)
}

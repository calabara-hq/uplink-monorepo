"use client";;
import { handleV2MutationError } from "./handleV2MutationError";
import { SpaceSettingsOutput } from "@/hooks/useSpaceReducer";

export type UpdateSpaceArgs = SpaceSettingsOutput & {
    csrfToken: string
    spaceId?: string
}


export const updateSpace = async (url,
    {
        arg,
    }: {
        url: string
        arg: UpdateSpaceArgs
    }
) => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/update_space`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": arg.csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
            spaceId: arg.spaceId,
            name: arg.name,
            logoUrl: arg.logoUrl,
            website: arg.website,
            admins: arg.admins,

        })
    })
        .then(handleV2MutationError)
}

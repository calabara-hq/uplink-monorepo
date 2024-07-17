"use client";

import { ContractID } from "@/types/channel";
import { handleV2MutationError } from "./handleV2MutationError";

export const insertChannel = async (url,
    {
        arg,
    }: {
        url: string
        arg: {
            csrfToken: string
            spaceId: string
            contractId: ContractID,
            channelType: string
        }
    }
) => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/insert_channel`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": arg.csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
            spaceId: arg.spaceId,
            contractId: arg.contractId,
            channelType: arg.channelType,
        })
    })
        .then(handleV2MutationError)
}

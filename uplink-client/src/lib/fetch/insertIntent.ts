"use client";
import { DeferredTokenIntentWithSignature } from "@tx-kit/sdk";
import { handleV2MutationError } from "./handleV2MutationError";
import { ContractID } from "@/types/channel";

export const insertIntent = async (url,
    {
        arg,
    }: {
        url: string
        arg: {
            csrfToken: string
            contractId: ContractID
            tokenIntent: DeferredTokenIntentWithSignature
        }
    }
) => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/insert_tokenIntent`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": arg.csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
            contractId: arg.contractId,
            tokenIntent: arg.tokenIntent
        })
    })
        .then(handleV2MutationError)
}

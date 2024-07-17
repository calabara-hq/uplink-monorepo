"use client";
import { handleV2MutationError } from "@/lib/fetch/handleV2MutationError";
import { useSession } from "@/providers/SessionProvider";
import { ChannelToken, ChannelTokenIntent, ContractID, isTokenIntent } from "@/types/channel";
import { useCallback } from "react"
import toast from "react-hot-toast";
import useSWRMutation from "swr/mutation";



const banTokenV2 = async (url, { arg }: {
    url: string;
    arg: {
        csrfToken: string;
        contractId: ContractID;
        tokenId: string;
    }
}
) => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/ban_tokenV2`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": arg.csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
            contractId: arg.contractId,
            tokenId: arg.tokenId
        }),
    })
        .then(handleV2MutationError)
}


const banTokenIntent = async (url, { arg }: {
    url: string;
    arg: {
        csrfToken: string;
        contractId: ContractID;
        tokenIntentId: string;
    }
}
) => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/ban_tokenIntent`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": arg.csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
            contractId: arg.contractId,
            tokenIntentId: arg.tokenIntentId
        }),
    })
        .then(handleV2MutationError)
}



export const useBanToken = (contractId: ContractID) => {

    const { trigger: triggerBanTokenV2, error: banTokenV2Error, isMutating: isBanTokenV2Mutating, reset: resetBanTokenV2 } = useSWRMutation(
        `/api/banTokenV2`,
        banTokenV2,
        {
            onError: (err) => {
                console.log(err);
                toast.error(
                    "Oops, something went wrong."
                );
                resetBanTokenV2();
            },
        }
    );

    const { trigger: triggerBanTokenIntent, error: banTokenIntentError, isMutating: isBanTokenIntentMutating, reset: resetBanTokenIntent } = useSWRMutation(
        `/api/banTokenIntent`,
        banTokenIntent,
        {
            onError: (err) => {
                console.log(err);
                toast.error(
                    "Oops, something went wrong."
                );
                resetBanTokenIntent();
            },
        }
    );


    const handleBanToken = async ({
        token,
        csrfToken
    }: {
        token: ChannelToken | ChannelTokenIntent,
        csrfToken: string
    }) => {

        const isIntent = isTokenIntent(token)

        const triggerFn = isIntent ?
            () => triggerBanTokenIntent({ csrfToken, contractId, tokenIntentId: token.id.toString() })
            :
            () => triggerBanTokenV2({ csrfToken, contractId, tokenId: token.tokenId.toString() })

        try {
            await triggerFn().then(({ success }) => {
                if (success) {
                    toast.success("Token deleted")
                } else {
                    toast.error("Failed to delete token")
                }
            })
        } catch (e) {
            if (isIntent) { resetBanTokenIntent() }
            else { resetBanTokenV2() }
        }

    }

    return {
        handleBanToken
    }


}
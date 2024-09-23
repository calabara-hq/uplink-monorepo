"use client";
import { handleV2Error } from "@/lib/fetch/handleV2Errors";
import { Channel, ContractID } from "@/types/channel";
import useSWR from "swr";

const fetchChannel = async (contractId: ContractID): Promise<Channel> => {

    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/channel?contractId=${contractId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(handleV2Error)

    return data;
}


export const useChannel = (contractId: ContractID, refreshInterval?: number) => {
    const {
        data: channel,
        isLoading,
        error,
        mutate: mutateSwrChannel,
    }: { data: Channel; isLoading: boolean; error: any; mutate: any } = useSWR(
        `/swrChannel/${contractId}`,
        () => fetchChannel(contractId),
        { refreshInterval: refreshInterval ?? 0 }
    );

    return {
        channel,
        isLoading,
        error,
        mutateSwrChannel
    }
}

"use client";

import { handleV2Error } from "@/lib/fetch/handleV2Errors";
import { ChannelUpgradePath, ContractID } from "@/types/channel";
import useSWR from "swr";

const client_fetchChannelUpgradePath = async (contractId: ContractID): Promise<ChannelUpgradePath | null> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/channel_upgradePath?contractId=${contractId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then(handleV2Error)
        .then(data => data.channelUpgradePath)

    return data;
}


export const useMonitorChannelUpgrades = (contractId: ContractID) => {
    const { data: upgradePath, isLoading, mutate } = useSWR([`upgradePath/${contractId}`], () => client_fetchChannelUpgradePath(contractId))

    return { upgradePath, isLoading, mutate }

}
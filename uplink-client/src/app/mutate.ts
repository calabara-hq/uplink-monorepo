import { startTransition } from "react";
import { revalidateDataCache } from "./(webapp)/actions";
import { ContractID } from "@/types/channel";

export const mutateSpaceContests = (spaceName: string) => {
    startTransition(() => {
        revalidateDataCache([`space/${spaceName}/contests`, "activeContests"]); // reval server cache
    });
}

export const mutateSpaces = (name: string) => {
    startTransition(() => {
        revalidateDataCache(["spaces", `space/${name}`]); // reval server cache
    });
}

export const mutateSubmissions = (contestId: string) => {
    startTransition(() => {
        revalidateDataCache([`submissions/${contestId}`]); // reval server cache
    });
}

export const mutateUser = (identifier: string) => {
    startTransition(() => {
        revalidateDataCache([`user/${identifier}`]); // reval server cache
    });
}

export const mutateChannel = (contractId: ContractID) => {
    startTransition(() => {
        revalidateDataCache([`channel/${contractId}`]); // reval server cache
    });
}
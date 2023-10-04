import { startTransition } from "react";
import { revalidateDataCache } from "./actions";

export const mutateSpaceContests = (spaceName: string) => {
    startTransition(() => {
        revalidateDataCache([`space/${spaceName}/contests`, "activeContests"]); // reval server cache
    });
}

export const mutateSpaces = () => {
    startTransition(() => {
        revalidateDataCache(["spaces"]); // reval server cache
    });
}

export const mutateSubmissions = (contestId: string) => {
    startTransition(() => {
        revalidateDataCache([`submissions/${contestId}`]); // reval server cache
    });
}
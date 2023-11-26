import { Submission } from "./submission";

type UserName = string;
type UserAddress = `0x${string}`;

export type UserIdentifier = UserName | UserAddress;


export type User = {
    id: string;
    address: string;
    userName: string | null;
    displayName: string | null;
    twitterHandle: string | null;
    profileAvatar: string | null;
    twitterAvatar: string | null;
    visibleTwitter: boolean;
    submissions: Array<Submission>
}

export const isUserAddress = (identifier: UserIdentifier): identifier is UserAddress => {
    return identifier.startsWith("0x");
}


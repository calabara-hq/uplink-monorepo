import { MintBoard } from "./mintBoard";
import { IToken } from "./token";

export type Admin = {
    address: string;
}

type SpaceToken = IToken & {
    tokenHash: string;
}

type SpaceTokenMap = {
    id: string;
    spaceId: string;
    token: SpaceToken;
    tokenLink: number;
}

export type Space = {
    id: string;
    name: string;
    displayName: string;
    logoUrl: string;
    members: number;
    twitter: string | null;
    website: string | null;
    admins: Array<Admin>;
    spaceTokens: Array<SpaceTokenMap>;
};
import { IToken } from "./token";
import { User } from "./user";


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

type MintBoard = {
    id: string;
    spaceId: string;
    created: string;
    chainId: number;
    enabled: boolean;
    boardTitle: string;
    boardDescription: string;
    name: string;
    symbol: string;
    editionSize: string;
    publicSalePrice: string;
    publicSaleStart: string;
    publicSaleEnd: string;
    description: string;
    referrer: string;
    submissions: Array<MintBoardSubmission>;
}

type MintBoardSubmission = {
    id: string;
    chainId: number;
    contractAddress: string;
    created: string;
    dropConfig: string;
    spaceId: string;
    author: User;
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
    mintBoard: MintBoard | null;
};
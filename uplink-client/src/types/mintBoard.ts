import { Edition } from "./edition";
import { Space } from "./space";
import { User } from "./user";

export type MintBoard = {
    id: string;
    space: Space
    spaceId: string;
    created: string;
    chainId: number;
    enabled: boolean;
    threshold: number;
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
}

export type PaginatedMintBoardPosts = {
    posts: Array<MintBoardPost>;
    pageInfo: {
        endCursor: string;
        hasNextPage: boolean
    }
}

export type MintBoardPost = {
    id: string;
    created: string;
    edition: Edition;
    author: User;
    totalMints: number;
}


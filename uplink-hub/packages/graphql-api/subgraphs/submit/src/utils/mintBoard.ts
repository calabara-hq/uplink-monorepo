import { schema } from "lib";
import { DropConfig, MintBoardPost, MintBoardPostConnection } from "../__generated__/resolvers-types";
import { db, dbGetPaginatedLatestMintBoardPosts, dbMintboardUserStats, sqlOps } from "./database.js";

export const createMintBoardPost = async (user: any, spaceName: string, chainId: number, contractAddress: string, dropConfig: DropConfig) => {

    // check if the space has a mintboard

}


const hasNextPage = async (boardId: number, lastCursor: string): Promise<boolean> => {
    return db.execute(sqlOps.sql`
        SELECT EXISTS(
            SELECT 1 FROM mintBoardPosts WHERE boardId = ${boardId} AND id < ${lastCursor}
        ) AS has_next_page
    `).then((data: any) => {
        if (data.rows.length > 0) {
            return Boolean(Number(data.rows[0].has_next_page));
        }
        return false;
    });
};


export const paginatedMintBoardPosts = async (spaceName: string, lastCursor: string | null, limit: number): Promise<MintBoardPostConnection> => {
    try {
        const result = await dbGetPaginatedLatestMintBoardPosts(spaceName, lastCursor, limit)
        if (result && result.length > 0) {
            const boardId = result[0].boardId;
            const endCursor = result.at(-1).id.toString();
            const hasNext = await hasNextPage(boardId, endCursor)

            return {
                posts: result,
                pageInfo: {
                    endCursor,
                    hasNextPage: hasNext
                }
            }
        }

        return {
            posts: [],
            pageInfo: {
                endCursor: 0,
                hasNextPage: false,
            },
        };

    } catch (e) {
        return {
            posts: [],
            pageInfo: {
                endCursor: 0,
                hasNextPage: false,
            },
        };
    }

}


export const mintBoardUserStats = async (boardId: string, userAddress: string) => {
    try {
        const totalMints = await dbMintboardUserStats(boardId, userAddress)
        return totalMints
    } catch (e) {
        return {
            totalMints: 0,
        }
    }
}

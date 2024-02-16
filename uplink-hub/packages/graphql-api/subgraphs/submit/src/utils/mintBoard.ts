import { schema } from "lib";
import { DropConfig, MintBoardPost, MintBoardPostConnection } from "../__generated__/resolvers-types";
import { db, dbGetPaginatedLatestMintBoardPosts, dbMintboardUserStats, sqlOps } from "./database.js";

export const createMintBoardPost = async (user: any, spaceName: string, chainId: number, contractAddress: string, dropConfig: DropConfig) => {

    // check if the space has a mintboard


    const space = await db.query.spaces.findFirst({
        with: {
            mintBoard: true
        },
        where: sqlOps.eq(schema.spaces.name, spaceName)
    })

    if (!space.mintBoard) throw new Error('Mint board not configured for this space')

    try {

        await db.transaction(async (tx: any) => {

            const newEdition: schema.dbNewZoraEditionType = {
                chainId,
                contractAddress,
                name: dropConfig.name,
                symbol: dropConfig.symbol,
                editionSize: dropConfig.editionSize,
                royaltyBPS: dropConfig.royaltyBPS,
                fundsRecipient: dropConfig.fundsRecipient,
                defaultAdmin: dropConfig.defaultAdmin,
                description: dropConfig.description,
                animationURI: dropConfig.animationURI,
                imageURI: dropConfig.imageURI,
                referrer: dropConfig.referrer,
                publicSalePrice: dropConfig.saleConfig.publicSalePrice,
                maxSalePurchasePerAddress: dropConfig.saleConfig.maxSalePurchasePerAddress,
                publicSaleStart: dropConfig.saleConfig.publicSaleStart,
                publicSaleEnd: dropConfig.saleConfig.publicSaleEnd,
                presaleStart: dropConfig.saleConfig.presaleStart,
                presaleEnd: dropConfig.saleConfig.presaleEnd,
                presaleMerkleRoot: dropConfig.saleConfig.presaleMerkleRoot,
            }

            const insertedEdition = await tx.insert(schema.zoraEditions).values(newEdition)
            const editionId = insertedEdition.insertId

            const newPost: schema.dbNewMintBoardPostType = {
                boardId: space.mintBoard.id,
                spaceId: space.id,
                userId: user.id,
                created: new Date().toISOString(),
                editionId,
            }

            await tx.insert(schema.mintBoardPosts).values(newPost)
        })

        return { success: true }

    } catch (e) {
        console.log(e);
        return { success: false }
    }
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

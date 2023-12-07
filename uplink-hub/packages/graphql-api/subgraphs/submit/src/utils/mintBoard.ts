import { schema } from "lib";
import { DropConfig } from "../__generated__/resolvers-types";
import { db, dbSingleSubmissionById, sqlOps } from "./database.js";

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



import { schema } from "lib";
import { DropConfig } from "../__generated__/resolvers-types";
import { db, dbSingleSubmissionById, sqlOps } from "./database.js";
import { nanoid } from "nanoid";

export const createMintBoardSubmission = async (user: any, spaceName: string, chainId: number, contractAddress: string, dropConfig: DropConfig) => {

    // check if the space has a mintboard


    const space = await db.query.spaces.findFirst({
        with: {
            mintBoard: true
        },
        where: sqlOps.eq(schema.spaces.name, spaceName)
    })

    //if (!space.mintBoard) throw new Error('Mint board not configured for this space')

    try {

        const newSubmission: schema.dbNewMintBoardSubmissionType = {
            boardId: space.mintBoard.id,
            spaceId: space.id,
            userId: user.id,
            created: new Date().toISOString(),
            reserved: 1,
            chainId,
            contractAddress,
            mintBoardSlot: 1,
            dropConfig: JSON.stringify(dropConfig),
        }

        await db.insert(schema.mintBoardSubmissions).values(newSubmission)
        return { success: true }

    } catch (e) {
        console.log(e);
        return { success: false }
    }
}


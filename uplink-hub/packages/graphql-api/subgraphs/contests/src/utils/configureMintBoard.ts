import { schema } from "lib";
import { MintBoardInput } from "../__generated__/resolvers-types";
import { db, dbSingleSpaceByName, sqlOps } from "./database.js";

import { GraphQLError } from "graphql";

export const configureMintBoard = async (user: any, spaceName: string, mintBoardData: MintBoardInput) => {

    const space = await dbSingleSpaceByName(spaceName);
    if (!space) throw new Error('Space not found')

    const isAdmin = space.admins.some((admin: schema.dbAdminType) => admin.address === user.address);
    if (!isAdmin) {
        throw new GraphQLError('Unauthorized', {
            extensions: {
                code: 'UNAUTHORIZED'
            }
        })
    }


    try {

        const mintBoardValues: schema.dbNewMintBoardType = {
            ...mintBoardData,
            spaceId: space.id,
            created: new Date().toISOString(),
            enabled: mintBoardData.enabled ? 1 : 0,
        }

        const doesBoardExist = Boolean(space.mintBoard);

        if (doesBoardExist) {
            await db.update(schema.mintBoards).set(mintBoardValues).where(sqlOps.eq(schema.mintBoards.id, space.mintBoard.id))
        } else {
            await db.insert(schema.mintBoards).values(mintBoardValues)
        }

        return { success: true }
    } catch (e) {
        console.log(e);
        return { success: false }
    }
}
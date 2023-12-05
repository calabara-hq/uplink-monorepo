import { schema } from "lib";
import { MintBoardInput } from "../__generated__/resolvers-types";
import { db, sqlOps } from "./database.js";
import { singleSpaceByName } from "../resolvers/queries.js";
import { GraphQLError } from "graphql";

export const configureMintBoard = async (user: any, spaceName: string, mintBoardData: MintBoardInput) => {

    try {
        const space = await singleSpaceByName.execute({ name: spaceName });
        if (!space) throw new Error('Space not found')
        const isAdmin = space.admins.some((admin) => admin.address === user.address);
        if (!isAdmin) {
            throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })
        }

        const mintBoardValues: schema.dbNewMintBoardType = {
            ...mintBoardData,
            spaceId: space.id,
            created: new Date().toISOString(),
            enabled: mintBoardData.enabled ? 1 : 0,
        }

        const [existing] = await db.select({
            id: schema.mintBoards.id,
        }).from(schema.mintBoards).where(sqlOps.eq(schema.mintBoards.spaceId, space.id));
        if (existing) {
            await db.update(schema.mintBoards).set(mintBoardValues).where(sqlOps.eq(schema.mintBoards.id, existing.id))
        }
        else {
            await db.insert(schema.mintBoards).values(mintBoardValues)
        }

        

        return { success: true }
    } catch (e) {
        console.log(e);
        return { success: false }
    }
}
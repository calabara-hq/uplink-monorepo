import { schema } from "lib";
import { db } from "./database.js";

export const registerMint = async (user: any, editionId: string, amount: number) => {

    try {
        const mint: schema.dbNewEditionMintType = {
            editionId: parseInt(editionId),
            userId: user.id,
            amount
        }

        await db.transaction(async (tx: any) => {
            await tx.insert(schema.editionMints).values(mint)
        })
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}
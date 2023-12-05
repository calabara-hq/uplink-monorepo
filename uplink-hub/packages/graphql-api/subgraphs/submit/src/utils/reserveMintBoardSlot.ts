import { schema } from "lib";
import { db, sqlOps } from "./database.js";


const reserveMintBoardSlot = async (user: any, spaceName: string) => {
    /*
        try {
            const slot = await db.transaction(async (tx: any) => {
    
                // get the board config for the space
                const space = await tx.query.spaces.findFirst({
                    with: {
                        mintBoard: true
                    },
                    where: sqlOps.eq(schema.spaces.name, spaceName)
                })
    
                //  if (!space.mintBoard) throw new Error('Mint board not configured for this space')
    
    
                // delete null reserved slots that are more than 15 minutes old
                const isoFifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    
                await tx.delete(schema.mintBoardSubmissions).where(sqlOps.and(
                    sqlOps.eq(schema.mintBoardSubmissions.reserved, true),
                    sqlOps.lt(schema.mintBoardSubmissions.created, isoFifteenMinutesAgo),
                    sqlOps.eq(schema.mintBoardSubmissions.dropConfig, null)
                ))
    
                // query the latest reserved slot and increment it by 1
    
                const latestReservedSlot =
                    await tx.query.mintBoardSubmissions.findFirst({
                        where: (submission: schema.dbMintBoardSubmissionType) => sqlOps.and(
                            sqlOps.eq(submission.spaceId, space.id),
                            sqlOps.eq(submission.reserved, true)
                        ),
                        orderBy: sqlOps.desc(schema.mintBoardSubmissions.mintBoardSlot),
                        limit: 1
                    })
                const newSlot = latestReservedSlot ? latestReservedSlot.mintBoardSlot + 1 : 1;
    
                // reserve the new slot
    
                const submissionPlaceholder: schema.dbNewMintBoardSubmissionType = {
                    spaceId: space.id,
                    userId: user.id,
                    created: new Date().toISOString(),
                    reserved: 1,
                    mintBoardSlot: newSlot
                }
    
                await tx.insert(schema.mintBoardSubmissions).values(submissionPlaceholder)
                return newSlot;
            });
    
            return {
                success: true,
                slot
            }
    
        } catch (e) {
            console.log(e);
            throw new Error('Error reserving mint board slot')
        }
        */
}


export default reserveMintBoardSlot;
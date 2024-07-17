import { schema } from "lib";
import { DropConfig } from "../__generated__/resolvers-types";
import { db, dbSingleSubmissionById } from "./database.js";



const createDrop = async (user: any, submissionId: string, contestId: string, contractAddress: string, chainId: number, dropConfig: DropConfig) => {

    // const submission = await dbSingleSubmissionById(parseInt(submissionId));

    // if (submission.author.id !== parseInt(user.id)) return { success: false }

    // if (submission.nftDrop) return { success: false }

    // try {

    //     await db.transaction(async (tx: any) => {

    //         const newEdition: schema.dbNewZoraEditionType = {
    //             chainId,
    //             contractAddress,
    //             name: dropConfig.name,
    //             symbol: dropConfig.symbol,
    //             editionSize: dropConfig.editionSize,
    //             royaltyBPS: dropConfig.royaltyBPS,
    //             fundsRecipient: dropConfig.fundsRecipient,
    //             defaultAdmin: dropConfig.defaultAdmin,
    //             description: dropConfig.description,
    //             animationURI: dropConfig.animationURI,
    //             imageURI: dropConfig.imageURI,
    //             referrer: dropConfig.referrer,
    //             publicSalePrice: dropConfig.saleConfig.publicSalePrice,
    //             maxSalePurchasePerAddress: dropConfig.saleConfig.maxSalePurchasePerAddress,
    //             publicSaleStart: dropConfig.saleConfig.publicSaleStart,
    //             publicSaleEnd: dropConfig.saleConfig.publicSaleEnd,
    //             presaleStart: dropConfig.saleConfig.presaleStart,
    //             presaleEnd: dropConfig.saleConfig.presaleEnd,
    //             presaleMerkleRoot: dropConfig.saleConfig.presaleMerkleRoot,
    //         }

    //         const insertedEdition = await tx.insert(schema.zoraEditions).values(newEdition)
    //         const editionId = insertedEdition.insertId

    //         const newSubmissionDrop: schema.dbNewSubmissionDropType = {
    //             userId: user.id,
    //             created: new Date().toISOString(),
    //             contestId: submission.contestId,
    //             submissionId: submission.id,
    //             editionId,
    //         }

    //         await tx.insert(schema.submissionDrops).values(newSubmissionDrop)

    //     });

    //     return { success: true }

    // } catch (e) {
    //     console.log(e);
    //     return { success: false }
    // }

}

export default createDrop;
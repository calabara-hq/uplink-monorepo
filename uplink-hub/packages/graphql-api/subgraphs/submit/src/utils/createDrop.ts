import { schema } from "lib";
import { DropConfig } from "../__generated__/resolvers-types";
import { db, dbSingleSubmissionById } from "./database.js";



const createDrop = async (user: any, submissionId: string, contestId: string, contractAddress: string, chainId: number, dropConfig: DropConfig) => {

    // get the submission

    const submission = await dbSingleSubmissionById(parseInt(submissionId));

    // check if user is the author of the submission

    if (submission.userId !== user.id) return { success: false }

    // check if submission is already dropped

    if (submission.nftDrop) return { success: false }

    // insert drop into db

    try {

        const newDrop: schema.dbNewUserDropType = {
            submissionId: submission.id,
            contestId: submission.contestId,
            userId: user.id,
            contractAddress: contractAddress,
            chainId: chainId,
            dropConfig: JSON.stringify(dropConfig),
            created: new Date().toISOString(),
        }

        await db.insert(schema.userDrops).values(newDrop)
        return { success: true }

    } catch (e) {
        console.log(e);
        return { success: false }
    }

}

export default createDrop;
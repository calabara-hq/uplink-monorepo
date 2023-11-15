import { schema } from "lib";
import { DropConfig } from "../__generated__/resolvers-types";
import { db, dbSingleSubmissionById } from "./database.js";
import { dbNewUserDropType } from "lib/dist/drizzle/schema";



const createDrop = async (user: any, submissionId: string, contestId: string, contractAddress: string, chainId: number, dropConfig: DropConfig) => {

    // get the submission

    const submission = await dbSingleSubmissionById(parseInt(submissionId));
    console.log(JSON.stringify(submission, null, 2))

    // check if user is the author of the submission

    if (submission.author !== user.address) return { success: false }

    // check if submission is already dropped

    if (submission.nftDrop) return { success: false }

    // insert drop into db

    try {

        const newDrop: dbNewUserDropType = {
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
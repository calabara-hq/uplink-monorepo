import { db, sqlOps } from "./database.js";
import { schema, Decimal, EditorOutputData, TokenController } from "lib";
import dotenv from 'dotenv';
import { GraphQLError } from "graphql";

const prepared_spaceByContestId = db.query.contests.findFirst({
    where: (contest: schema.dbContestType) => sqlOps.eq(contest.id, sqlOps.placeholder('contestId')),
}).prepare();

const prepared_dbUserSpaceAdmin = db.query.admins.findFirst({
    where: (admin: schema.dbAdminType) => sqlOps.and(
        sqlOps.eq(admin.address, sqlOps.placeholder('address')),
        sqlOps.eq(admin.spaceId, sqlOps.placeholder('spaceId'))
    )

}).prepare();

export const deleteContestSubmission = async (user: any, submissionId: string, contestId: string) => {

    // get the space admins by contest id
    // check if caller is authorized admin
    // perform delete operation
    // return 

    const contest = await prepared_spaceByContestId.execute({contestId})
    if (!contest) return { success: false }
    
    const spaceId = contest.spaceId
    
    const isAdmin = await prepared_dbUserSpaceAdmin.execute({ address: user.address, spaceId: spaceId })

    if (!isAdmin) throw new GraphQLError('Unauthorized', {
        extensions: {
            code: 'UNAUTHORIZED'
        }
    })
    
    try {
        const deletedSubmission = await db.delete(schema.submissions)
            .where(
                sqlOps.and(
                    sqlOps.eq(schema.submissions.id, submissionId),
                    sqlOps.eq(schema.submissions.contestId, contestId)
                )
            )

        return { success: true }
        
    } catch(e){
        console.log(e)
        return { success: false }
    }
}


export const deleteMintboardPost = async (user: any, postId: string, spaceId: string) => {
    
    const isAdmin = await prepared_dbUserSpaceAdmin.execute({ address: user.address, spaceId: spaceId })

    if (!isAdmin) throw new GraphQLError('Unauthorized', {
        extensions: {
            code: 'UNAUTHORIZED'
        }
    })

    try {
        const deletedPost = await db.delete(schema.mintBoardPosts)
            .where(
                sqlOps.and(
                    sqlOps.eq(schema.mintBoardPosts.id, postId),
                    sqlOps.eq(schema.mintBoardPosts.spaceId, spaceId)
                )
            )
                
        return { success: true }
        
    } catch(e){
        console.log(e)
        return { success: false }
    }

    // check if post belongs to space

    return { success: true }

}
import { schema, Context } from "lib"
import { db, sqlOps } from "./database.js"
import { authController } from "./authController.js"


export const updateUser = async (user: any, context: Context, displayName: string, profileAvatar: string, visibleTwitter: boolean) => {

    try {
        await db.update(schema.users).set({
            displayName,
            userName: displayName.replace(/\s/g, '').toLowerCase(),
            profileAvatar,
            visibleTwitter
        }).where(sqlOps.eq(schema.users.id, user.id))
        await authController.updateUserSession(context, {
            ...user,
            displayName,
            userName: displayName.replace(/\s/g, '').toLowerCase(),
            profileAvatar,
        })
        return {
            success: true,
        }
    } catch (e) {
        console.log(e)
        return {
            success: false,
        }
    }

}
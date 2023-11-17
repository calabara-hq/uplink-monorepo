import { schema } from "lib"
import { db, sqlOps } from "./database.js"

export const updateUser = async (user: any, displayName: string, profileAvatar: string, visibleTwitter: boolean) => {

    try {
        await db.update(schema.users).set({
            displayName,
            userName: displayName.replace(/\s/g, '').toLowerCase(),
            profileAvatar,
            visibleTwitter
        }).where(sqlOps.eq(schema.users.id, user.id))
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
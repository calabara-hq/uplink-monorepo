import { GraphQLError } from "graphql";
import { updateUser } from "../utils/updateUser.js";
import { authController } from "../utils/authController.js"
import { Context } from "lib";


const mutations = {

    Mutation: {
        updateUser: async (_: any, { displayName, profileAvatar, visibleTwitter }: { displayName: string, profileAvatar: string, visibleTwitter: boolean }, context: Context) => {
            const user = await authController.getUser(context);
            if (!user) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })


            return updateUser(user, context, displayName, profileAvatar, visibleTwitter);

        }
    }
}


export default mutations
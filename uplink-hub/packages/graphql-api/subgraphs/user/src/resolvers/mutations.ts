import { GraphQLError } from "graphql";
import { AuthorizationController } from "lib";
import { updateUser } from "../utils/updateUser.js";

const authController = new AuthorizationController(process.env.REDIS_URL!);


const mutations = {

    Mutation: {
        updateUser: async (_: any, { displayName, profileAvatar, visibleTwitter }: { displayName: string, profileAvatar: string, visibleTwitter: boolean }, context: any) => {
            const user = await authController.getUser(context);
            if (!user) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })


            return updateUser(user, displayName, profileAvatar, visibleTwitter);

        }
    }
}


export default mutations
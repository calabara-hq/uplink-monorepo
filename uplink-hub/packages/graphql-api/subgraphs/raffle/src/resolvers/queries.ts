import { GraphQLError } from "graphql";
import { AuthorizationController, Context } from "lib";
import crypto from "crypto";

import listen from '../utils/spyDM.js'

const authController = new AuthorizationController(process.env.REDIS_URL!);

const queries = {
    Query: {
        async generateTwitterDmCode(_: any, args: any, context: Context) {

            const code = `u-${crypto.randomBytes(4).toString('hex')}`;
            const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            // TODO: store code and expiration in redis

            listen();

            return code
        }
    }

}


export default queries
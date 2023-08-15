import { sqlOps, db } from "../utils/database.js";
import { AuthorizationController } from "lib";

const authController = new AuthorizationController(process.env.REDIS_URL);

const userById = db.query.users.findFirst({
    where: ((users) => sqlOps.eq(users.id, sqlOps.placeholder('id'))),
}).prepare();

const userByAddress = db.query.users.findFirst({
    where: ((users) => sqlOps.eq(users.address, sqlOps.placeholder('address'))),
}).prepare();



const queries = {
    Query: {
        async me(_: any, args: any, context: any) {
            const user = await authController.getUser(context);
            if (!user) return null;
            const data = await userByAddress.execute({ address: user.address });
            return data;
        },

        async user(parent, { id, address }, contextValue, info) {
            const data = id ? await userById.execute({ id }) : address ? await userByAddress.execute({ address }) : null;
        },

    },
};


export default queries
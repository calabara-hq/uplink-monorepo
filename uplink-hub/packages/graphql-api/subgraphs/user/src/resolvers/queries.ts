import { sqlOps, db } from "../utils/database.js";
import { AuthorizationController, schema } from "lib";

const authController = new AuthorizationController(process.env.REDIS_URL);

type UserName = string;
type UserAddress = `0x${string}`

type UserIdentifier = UserName | UserAddress

const isUserAddress = (userIdentifier: UserIdentifier): userIdentifier is UserAddress => {
    return userIdentifier.startsWith('0x');
}

const userByUsername = db.query.users.findFirst({
    where: ((users) => sqlOps.eq(users.userName, sqlOps.placeholder('userName'))),
}).prepare();

const userByAddress = db.query.users.findFirst({
    where: ((users) => sqlOps.eq(users.address, sqlOps.placeholder('userAddress'))),
}).prepare();

const queries = {
    Query: {
        async me(_: any, args: any, context: any) {
            const user = await authController.getUser(context);
            if (!user) return null;
            const data = await userByAddress.execute({ address: user.address });
            return data;
        },

        user(_: any, { userIdentifier }: { userIdentifier: UserIdentifier }) {
            return isUserAddress(userIdentifier) ? userByAddress.execute({ userAddress: userIdentifier }) : userByUsername.execute({ userName: userIdentifier });
        },
    },

};


export default queries
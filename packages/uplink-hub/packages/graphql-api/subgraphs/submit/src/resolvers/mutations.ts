import { db, sqlOps } from "../utils/database.js";
import { GraphQLError } from "graphql";
import { schema, AuthorizationController } from "lib";
import dotenv from "dotenv";
dotenv.config();

const authController = new AuthorizationController(process.env.REDIS_URL);

const mutations = {
    Mutation: {
       
    },
};

export default mutations;

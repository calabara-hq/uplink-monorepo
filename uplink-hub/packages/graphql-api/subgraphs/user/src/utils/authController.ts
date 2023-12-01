import { AuthorizationController } from "lib"
import dotenv from 'dotenv';
dotenv.config();
export const authController = new AuthorizationController(process.env.REDIS_URL!);
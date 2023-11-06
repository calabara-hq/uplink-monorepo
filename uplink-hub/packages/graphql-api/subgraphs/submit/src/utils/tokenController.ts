import { TokenController } from 'lib';
import dotenv from 'dotenv';
dotenv.config();
export const tokenController = new TokenController(process.env.ALCHEMY_KEY!, 1);

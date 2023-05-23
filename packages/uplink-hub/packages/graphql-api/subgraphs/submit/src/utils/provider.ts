import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY)

export default provider
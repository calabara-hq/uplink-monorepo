import dotenv from 'dotenv';
dotenv.config();


const SUPPORTED_CHAINS = [8453, 84532]

export const getSupportedChains = (): Array<number> => {
    return SUPPORTED_CHAINS
}


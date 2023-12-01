import dotenv from 'dotenv';
import Redis from 'ioredis';
import { Decimal } from 'lib';
dotenv.config();

export const redisClient = new Redis(process.env.REDIS_URL!);

export const getCacheValue = async (key: string) => {
    const data = await redisClient.get(key);
    if (data) {
        return JSON.parse(data);
    }

    return null;
}

export const setCacheValue = async (key: string, value: string) => {
    try {
        await redisClient.set(key, value);
        return true;
    } catch (error) {
        console.error(`Failed to set cache value: ${error}`);
        return false;
    }

}

// query the cache and return the sub params for the user / contest
export const getCacheSubParams = async (
    user: any,
    contestId: number
) => {
    const key = `sub-params:${user.id}-${contestId}`;
    return await getCacheValue(key).then(value => {
        if (value === null) return null
        return {
            ...value,
            subPower: parseInt(value.subPower)
        }
    });
}

// cache the sub params for the user / contest
export const setCacheSubParams = async (
    user: any,
    contestId: number,
    subPower: number,
    restrictionResults: {
        restriction: {
            restrictionType: string,
            tokenRestriction: {
                threshold: Decimal,
                token: {
                    type: string,
                    decimals: number,
                    symbol: string,
                    address?: string,
                    tokenId?: string,
                }
            }
        },
        result: boolean
    }[]
) => {
    const key = `sub-params:${user.id}-${contestId}`;
    const value = JSON.stringify({
        subPower: subPower.toString(),
        restrictionResults,
    });
    return await setCacheValue(key, value);
}
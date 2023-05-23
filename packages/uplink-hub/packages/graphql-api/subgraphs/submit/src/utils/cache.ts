import dotenv from 'dotenv';
import Redis from 'ioredis';
dotenv.config();

export const redisClient = new Redis(process.env.REDIS_URL);

export const getCacheValue = async (key: string) => {
    const data = await redisClient.get(key);
    if (data) {
        return JSON.parse(data);
    }

    return null;
}

export const setCacheValue = async (key: string, value: string) => {
    try {
        const data = await redisClient.set(key, value);
        return true;
    } catch (error) {
        console.error(`Failed to set cache value: ${error}`);
        return false;
    }

}
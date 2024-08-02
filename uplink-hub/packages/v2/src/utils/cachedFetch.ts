import { Redis } from 'ioredis';

import dotenv from "dotenv";
dotenv.config();

const redis = new Redis(process.env.REDIS_URL);


export const cachedFetch = async (key: string, fetcher: () => Promise<any>, expiration: number = undefined) => {
    const cached = await redis.get(key);

    if (cached) {
        return JSON.parse(cached);
    }

    const data = await fetcher();

    expiration ?
        await redis.set(key, JSON.stringify(data), 'EX', expiration) // with ttl
        :
        await redis.set(key, JSON.stringify(data)) // without ttl (default)

    return data;
};
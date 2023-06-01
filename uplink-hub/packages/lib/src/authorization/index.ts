import Redis, { Redis as RedisType } from 'ioredis';

export class AuthorizationController {
    private redisClient: RedisType;
    
    constructor(redisUrl: string) {
        this.redisClient = new Redis(redisUrl);
    }
    
    async getUser(context: any) {
        if (!context || !context.token) {
            return null;
        }

        const { token } = context;
        const { 'uplink-hub': uplinkHub } = token;

        if (!uplinkHub) return null;

        const sid = uplinkHub.split('.')[0]?.split(':')[1];

        // Attempt to fetch from the Redis store.
        try {
            const data = await this.redisClient.get(`uplink-session:${sid}`);

            if (data) {
                const parsedData = JSON.parse(data);
                return parsedData.user || null;
            }

            return null;
        } catch (error) {
            console.error(`Failed to fetch user from Redis: ${error}`);
            return null;
        }
    }
}

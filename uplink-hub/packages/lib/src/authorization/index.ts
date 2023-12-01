import Redis, { Redis as RedisType } from 'ioredis';
import { z } from 'zod';


const ContextSchema = z.object({
    token: z.record(z.string()),
    csrfToken: z.string(),
    ip: z.string(),
    hasApiToken: z.boolean()
})

export type UserSession = {
    id: string;
    address: string;
    twitter: {
        id: string;
        accessToken: string;
        expiresAt: string;
    } | null;
} | null;


export type Context = z.infer<typeof ContextSchema>;

export class AuthorizationController {
    private redisClient: RedisType;

    constructor(redisUrl: string) {
        this.redisClient = new Redis(redisUrl);
    }

    async getUser(context: Context): Promise<UserSession> {
        if (!context || !context.token || !context.csrfToken) {
            return null;
        }

        const { token, csrfToken } = context;
        const { 'uplink-hub': uplinkHub } = token;

        if (!uplinkHub || !csrfToken) return null;

        const sid = uplinkHub.split('.')[0]?.split(':')[1];

        // Attempt to fetch from the Redis store.
        try {
            const data = await this.redisClient.get(`uplink-session:${sid}`);

            if (data) {
                const { user, csrfToken: sessionCsrf } = JSON.parse(data);
                if (sessionCsrf !== csrfToken) return null; // check for csrf token match
                return user || null
            }

            return null;
        } catch (error) {
            console.error(`Failed to fetch user from Redis: ${error}`);
            return null;
        }
    }
}
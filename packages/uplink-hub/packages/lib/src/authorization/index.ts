import { _prismaClient } from '../prisma-client/index.js';

export class Authorization {
    static async getUser(context: any) {
        const { token } = context;
        const { 'uplink-hub': uplinkHub } = token;

        if (!uplinkHub) return null;

        const sid = uplinkHub.split('.')[0]?.split(':')[1];
        const data = await _prismaClient.session.findUnique({ where: { sid } });

        if (!data || !data.data) return null;

        try {
            const userData = JSON.parse(data.data);
            const user = userData.user?.address;
            return user;
        } catch (err) {
            console.error('Error parsing user data:', err);
            return null;
        }
    }
}
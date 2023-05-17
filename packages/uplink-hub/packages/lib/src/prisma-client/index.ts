import { PrismaClient } from '@prisma/client'

export const _prismaClient = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

const { PrismaClient } = require('@prisma/client')

const prisma = global.prisma || new PrismaClient()

module.exports = prisma
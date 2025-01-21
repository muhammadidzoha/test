import { PrismaClient } from "@prisma/client"

export const prismaDBClient = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
})
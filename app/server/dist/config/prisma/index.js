"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaDBClient = void 0;
const client_1 = require("@prisma/client");
exports.prismaDBClient = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
});

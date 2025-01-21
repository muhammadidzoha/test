import { PrismaClient } from "@prisma/client";

export class SeedService {
    constructor(public prismaClient: PrismaClient) {
    }

    async seed() {
        const isRoleExist = await this.prismaClient.role.findMany();
        if (isRoleExist.length === 0) {
            await this.seedRole();
        }
    }

    async seedRole() {
        await this.prismaClient.role.createMany({
            data: [
                {
                    id: 1,
                    name: 'admin'
                },
                {
                    id: 2,
                    name: 'sekolah'
                },
                {
                    id: 3,
                    name: 'puskesmas'
                },
                {
                    id: 4,
                    name: 'orangtua'
                }
            ]
        })
    }
}
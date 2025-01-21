import { PrismaClient } from "@prisma/client";

export class SeedService {
    constructor(public prismaClient: PrismaClient) {
    }

    async seed() {
        await this.seedRole();
        await this.seedInstitutionType();
    }

    async seedRole() {
        const isRoleExist = await this.prismaClient.role.findMany();
        if (isRoleExist.length === 0) {
            await this.prismaClient.role.createMany({
                data: [
                    {
                        id: 1,
                        name: 'admin'
                    },
                    {
                        id: 2,
                        name: 'school'
                    },
                    {
                        id: 3,
                        name: 'healthcare'
                    },
                    {
                        id: 4,
                        name: 'parent'
                    }
                ]
            })
        }
        console.log('Role seeded');
    }

    async seedInstitutionType() {
        const isInstitutionTypeExists = await this.prismaClient.institutionType.findMany();
        if (isInstitutionTypeExists.length === 0) {
            await this.prismaClient.institutionType.createMany({
                data: [
                    {
                        id: 1,
                        name: 'school'
                    },
                    {
                        id: 2,
                        name: 'healthcare'
                    },
                ]
            })
        }
        console.log('Institution Type seeded');
    }
}
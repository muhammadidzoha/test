import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

export class SeedService {
    constructor(public prismaClient: PrismaClient) {
    }

    async seed() {
        await this.seedRole();
        await this.seedInstitutionType();
        await this.seedAdminAccount();
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

    async seedAdminAccount() {
        const isUserExist = await this.prismaClient.user.findMany();
        if (!isUserExist.length) {
            await this.prismaClient.user.create({
                data: {
                    id: 1,
                    username: process.env.ADMIN_USERNAME ?? 'admin',
                    password: process.env.ADMIN_PASSWORD ?? bcrypt.hashSync('admin', 10),
                    email: process.env.SMTP_EMAIL ?? 'admin@gmail.com',
                    is_verified: true,
                    role_id: 1,
                }
            })
        }
        console.log('Admin account seeded');
    }
}
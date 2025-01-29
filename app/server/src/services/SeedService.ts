import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

export class SeedService {
    constructor(public prismaClient: PrismaClient) {
    }

    async seed() {
        await this.seedRole();
        await this.seedInstitutionType();
        await this.seedPositions();
        await this.seedAdminAccount();
        await this.seedNutritionStatus();
        await this.seedKIEtype();
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
                    },
                    {
                        id: 5,
                        name: 'uks'
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
                    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD ?? 'admin', 10),
                    email: process.env.SMTP_EMAIL ?? 'admin@gmail.com',
                    is_verified: true,
                    role_id: 1,
                }
            })
        }
        console.log('Admin account seeded');
    }

    async seedPositions() {
        const isPositionExist = await this.prismaClient.position.findMany();
        if (!isPositionExist.length) {
            await this.prismaClient.position.createMany({
                data: [{
                    id: 1,
                    name: 'Kepala uks',
                    modules: 'healthcare'
                },
                {
                    id: 2,
                    name: 'petugas kesehatan',
                    modules: "healthcare"
                },
                ]
            })
        }
        console.log('Position Seeded');
    }

    async seedNutritionStatus() {
        const isNutritionStatusExist = await this.prismaClient.nutritionStatus.findMany();
        if (!isNutritionStatusExist.length) {
            await this.prismaClient.nutritionStatus.createMany({
                data: [
                    {
                        id: 1,
                        status: 'KURUS',
                        information: 'Kekurangan bb tingkat berat'
                    },
                    {
                        id: 2,
                        status: 'KURUS',
                        information: 'Kekurangan bb tingkat ringan'
                    },
                    {
                        id: 3,
                        status: 'NORMAL',
                        information: 'Gizi normal'
                    },
                    {
                        id: 4,
                        status: 'GEMUK',
                        information: 'Kelebihan bb tingkat ringan'
                    },
                    {
                        id: 5,
                        status: 'GEMUK',
                        information: 'Kelebihan bb tingkat berat'
                    },
                ]
            })
        }
        console.log('Nutrition Status Seeded');
    }

    async seedKIEtype() {
        const isKIETypeExist = await this.prismaClient.kIEType.findMany();
        if (!isKIETypeExist.length) {
            await this.prismaClient.kIEType.createMany({
                data: [
                    {
                        id: 1,
                        name: 'Article'
                    },
                    {
                        id: 2,
                        name: 'Poster'
                    },
                    {
                        id: 3,
                        name: 'Video'
                    }
                ]
            })
        }
        console.log('KIE Type Seeded');
    }
}
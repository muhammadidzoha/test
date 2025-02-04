import { PrismaClient } from "@prisma/client";
import { IInstitution } from "../types/auth";

export class HealthCenterService {
    constructor(public prismaClient: PrismaClient) {

    }

    async getAllHealthCenter() {
        const healthCenter = await this.prismaClient.institution.findMany({
            where: {
                type: 2
            }
        });
        return { healthCenter }
    }

    async getHealthCenterById(id: number) {
        const healthCenter = await this.prismaClient.institution.findUnique({
            where: {
                id
            }
        });
        return { healthCenter }
    }

    async updateHealthCenter(id: number, payload: IInstitution) {
        const { healthCenter } = await this.getHealthCenterById(id);
        if (!healthCenter) {
            throw new Error("Health Center not found");
        }
        const updatedHealthCenter = await this.prismaClient.institution.update({
            where: {
                id
            },
            data: {
                ...healthCenter,
                name: payload.name,
                address: payload.address,
                phone_number: payload.phoneNumber,
                email: payload.email,
                head_name: payload.headName,
                head_nip: payload.headNIP,
            }
        });

        return { updatedHealthCenter }
    }
}
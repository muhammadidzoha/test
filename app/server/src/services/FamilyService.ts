import { PrismaClient } from "@prisma/client";
import { IFamily } from "../types/family";
import { InvariantError, NotFoundError } from "../common/exception";

export class FamilyService {
    constructor(public prismaClient: PrismaClient) { }

    async createOrUpdateFamily(id: number | undefined, familyPayload: IFamily) {
        const { family } = await this.getFamilyByHeadFamily(familyPayload.headFamily);

        if (!family) {
            return await this.createFamily(familyPayload);
        }

        return await this.updateFamily(id, familyPayload)
    }


    async getFamilyByHeadFamily(headFamily: string) {
        const family = await this.prismaClient.family.findFirst({
            where: {
                head_family: headFamily
            }
        });

        return {
            family
        }
    }

    async createFamily(payload: IFamily) {
        const family = await this.prismaClient.family.create({
            data: {
                head_family: payload.headFamily,
                head_phone_number: payload.headPhoneNumber,
                kk_number: payload.kkNumber,
                description: payload.description
            }
        })
        return {
            family
        }

    }

    async updateFamily(id: number | undefined, familyPayload: IFamily) {
        if (!id) {
            throw new InvariantError('Family already exists, Family id is required to update');
        }
        const family = await this.getFamilyByHeadFamily(familyPayload.headFamily);

        if (!!family) {
            throw new NotFoundError('Family not found');
        }

        const updatedFamily = await this.prismaClient.family.update({
            where: {
                id
            },
            data: familyPayload
        })

        return {
            family: updatedFamily
        }
    }


}
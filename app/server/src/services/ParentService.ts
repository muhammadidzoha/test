import { PrismaClient } from "@prisma/client";
import { IFamily } from "../types/parent";
import { InvariantError } from "../common/exception";

export class ParentService {
    constructor(public prismaClient: PrismaClient) { }

    async createFamily(payload: IFamily) {
        const { family: isFamilyExists } = await this.getFamilyByHeadFamily(payload.headFamily);
        if (!!isFamilyExists) {
            throw new InvariantError('Family already exsits')
        }

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
}
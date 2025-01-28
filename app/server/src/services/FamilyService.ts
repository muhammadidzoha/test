import { PrismaClient } from "@prisma/client";
import { IFamily, IFamilyMember } from "../types/family";
import { InvariantError, NotFoundError } from "../common/exception";
import { FormatDate } from "../common/utils/FormatDate";
import { calculateBMI } from "../common/utils/CalculateBMI";
import { determineNutritionStatus } from "../common/utils/CalculateZscore";

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

    async addFamilyMember(familyId: number, familyMember: IFamilyMember, createdById: number) {
        const residenceLastRow = await this.getResidenceByDesc();
        const jobLastRow = await this.getJobByDesc();
        const knowledgeNutritionLastRow = await this.getKnowledgeNutritionbyDesc();
        const bmi = calculateBMI(familyMember.nutrition.height, familyMember.nutrition.weight);

        const determinedNutritionStatus = determineNutritionStatus(bmi);

        const newMember = await this.prismaClient.familyMember.create({
            data: {
                full_name: familyMember.fullName,
                birth_date: familyMember.birthDate.toISOString(),
                education: familyMember.education,
                gender: familyMember.gender,
                relation: familyMember.relation,
                job: {
                    connectOrCreate: {
                        where: {
                            id: familyMember.job.id ?? jobLastRow?.id ?? 1
                        },
                        create: {
                            name: familyMember.job.name,
                            income: familyMember.job.income
                        }
                    }
                },
                residence: {
                    connectOrCreate: {
                        where: {
                            id: familyMember.residence.id ?? residenceLastRow?.id ?? 1
                        },
                        create: {
                            status: familyMember.residence.status,
                            address: familyMember.residence.address,
                            description: familyMember.residence.description
                        }
                    }
                },
                family: {
                    connect: {
                        id: familyId
                    }
                },
                ...(familyMember.knowledgeNutrition?.knowledge && ({
                    knowledge_nutrition: {
                        create: {
                            knowledge: familyMember.knowledgeNutrition?.knowledge,
                            score: familyMember.knowledgeNutrition?.score
                        }
                    }
                })),
                ...(familyMember.institutionId && {
                    institution: {
                        connect: {
                            id: familyMember.institutionId
                        }
                    }
                }),
                nutrition: {
                    create: {
                        height: familyMember.nutrition.height,
                        weight: familyMember.nutrition.weight,
                        created_by: createdById,
                        updated_by: createdById,
                        ...(familyMember.nutrition.birth_weight && {
                            birth_weight: familyMember.nutrition.birth_weight
                        }),
                        bmi: familyMember.nutrition.bmi ?? bmi,
                        status_id: determinedNutritionStatus.statusId
                    }
                },
                ...(familyMember.behaviour?.eatFrequency && {
                    behaviour: {
                        create: {
                            drink_frequency: familyMember.behaviour.drinkFrequency,
                            eat_frequency: familyMember.behaviour.eatFrequency,
                            physical_activity: familyMember.behaviour.physicalActivity,
                            sleep_quality: familyMember.behaviour.sleepQuality
                        }
                    }
                }),
            },
            include: {
                residence: true,
                family: true,
                job: true,
                knowledge_nutrition: true,
                institution: true,
                behaviour: true,
                nutrition: true
            }
        })

        return { familyMember: newMember }
    }

    async getJobByDesc() {
        return await this.prismaClient['job'].findFirst({
            orderBy: {
                id: 'desc'
            }
        })
    }

    async getResidenceByDesc() {
        return await this.prismaClient['residence'].findFirst({
            orderBy: {
                id: 'desc'
            }
        })
    }

    async getKnowledgeNutritionbyDesc() {
        return await this.prismaClient['knowledgeNutrition'].findFirst({
            orderBy: {
                id: 'desc'
            }
        });
    }


}
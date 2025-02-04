import { PrismaClient } from "@prisma/client";
import { InvariantError, NotFoundError } from "../common/exception";
import { calculateBMI } from "../common/utils/CalculateBMI";
import { determineNutritionStatus } from "../common/utils/CalculateZscore";
import { calculateBehaviourScore, calculateGajiScore, calculateNutritionScore } from "../common/utils/Family";
import { IFamily, IFamilyMember } from "../types/family";

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
                    create: {
                        income: familyMember.job.income,
                        job_type_id: familyMember.job.jobTypeId
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
                            sleep_quality: familyMember.behaviour.sleepQuality,
                            phbs: familyMember.behaviour.phbs
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

    async getTotalGajiWithCategory(familyId: number, umr: number) {
        const familyMembers = await this.prismaClient.familyMember.findMany({
            where: {
                family_id: familyId
            }
        })
        const totalFamily = familyMembers.length;

        const totalGaji = await this.prismaClient.job.aggregate({
            where: {
                family_members: {
                    every: {
                        family_id: familyId
                    }
                }
            },
            _sum: {
                income: true
            }
        });

        const totalWages = totalGaji._sum.income?.toString() ?? 0;
        const categoryScore = calculateGajiScore(+totalWages, totalFamily, umr);

        return {
            totalGaji: totalWages,
            totalFamily,
            categoryScore
        }
    }

    async getWageScoreOfFamilyMember(familyId: number, familyMemberId: number, umr: number) {
        const familyMember = await this.prismaClient.familyMember.findUnique({
            where: {
                id: familyMemberId
            },
            include: {
                job: {
                    include: {
                        job_type: true
                    }
                }
            }
        });
        const familyMembers = await this.prismaClient.familyMember.findMany({
            where: {
                family_id: familyId
            }
        });

        if (!familyMember) {
            throw new NotFoundError('Family member not found');
        }

        const wage = +familyMember.job.income?.toString();
        const wageScore = calculateGajiScore(wage, familyMembers.length ?? 0, umr);
        return {
            wage: +familyMember.job.income?.toString(),
            wageScore,
            job: familyMember.job.job_type.name,
            jobScore: familyMember.job.job_type.id,
            familyMember: {
                ...familyMember,
                job: {
                    ...familyMember.job,
                    income: wage
                }
            },
        }
    }

    async getChildrenScore(childrenId: number) {
        const children = await this.prismaClient.familyMember.findUnique({
            where: {
                id: childrenId,
                relation: 'ANAK'
            },
            include: {
                nutrition: {
                    take: 1,
                    orderBy: {
                        created_at: 'desc'
                    },
                    include: {
                        nutrition_status: true
                    }
                },
                behaviour: true,
            }
        });

        if (!children) {
            throw new NotFoundError('Children not found');
        }
        if (!children.nutrition.length) {
            throw new NotFoundError('Children nutrition not found');
        }
        const birthWeight = children.nutrition[0]?.birth_weight;
        let score = 0;
        if (birthWeight! > 4) {
            score = 1;
        }
        if (birthWeight! > 0 && birthWeight! <= 4) {
            score = 2;
        }
        const eatDrink = (children.behaviour?.eat_frequency ?? 0) + (children.behaviour?.drink_frequency ?? 0);
        const eatDrinkScore = calculateBehaviourScore(eatDrink);
        const physicalActivityScore = calculateBehaviourScore(children.behaviour?.physical_activity ?? 0);
        const sleepQualityScore = calculateBehaviourScore(children.behaviour?.sleep_quality ?? 0);
        const phbsScore = calculateBehaviourScore(children.behaviour?.phbs ?? 0);
        const nutritionStatusScore = calculateNutritionScore(children.nutrition[0].nutrition_status.id);
        let risk = 0;
        if (!nutritionStatusScore || nutritionStatusScore < 3) {
            risk = 0;
        } else if (nutritionStatusScore >= 3) {
            risk = 1;
        }

        return {
            birthWeight,
            birthWeightScore: score,
            eatDrinkScore,
            physicalActivityScore,
            sleepQualityScore,
            phbsScore,
            nutrition: children.nutrition[0],
            nutritionScore: nutritionStatusScore,
            risk
        }
    }

    async addFamilyMember2(familyId: number, familyMember: IFamilyMember) {
        const residenceLastRow = await this.getResidenceByDesc();

        const newMember = await this.prismaClient.familyMember.create({
            data: {
                full_name: familyMember.fullName,
                birth_date: familyMember.birthDate.toISOString(),
                education: familyMember.education,
                gender: familyMember.gender,
                relation: familyMember.relation,
                job: {
                    create: {
                        income: familyMember.job.income,
                        job_type_id: familyMember.job.jobTypeId
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
                ...(familyMember.institutionId && {
                    institution: {
                        connect: {
                            id: familyMember.institutionId
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

}
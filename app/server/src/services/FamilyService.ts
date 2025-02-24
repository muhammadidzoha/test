import { PrismaClient } from "@prisma/client";
import { InvariantError, NotFoundError } from "../common/exception";
import { calculateBMI } from "../common/utils/CalculateBMI";
import { determineNutritionStatus } from "../common/utils/CalculateZscore";
import {
  calculateBehaviourScore,
  calculateGajiScore,
  calculateNutritionScore,
} from "../common/utils/Family";
import { IFamily, IFamilyMember, IMember } from "../types/family";

export class FamilyService {
  constructor(public prismaClient: PrismaClient) {}

  async createOrUpdateFamily(id: number | undefined, familyPayload: IFamily) {
    const { family } = await this.getFamilyByHeadFamily(
      familyPayload.headFamily
    );

    if (!family) {
      return await this.createFamily(familyPayload);
    }

    return await this.updateFamily(id, familyPayload);
  }

  async getFamilyByHeadFamily(headFamily: string) {
    const family = await this.prismaClient.family.findFirst({
      where: {
        head_family: headFamily,
      },
    });

    return {
      family,
    };
  }

  async createFamily(payload: IFamily) {
    const family = await this.prismaClient.family.create({
      data: {
        head_family: payload.headFamily,
        head_phone_number: payload.headPhoneNumber,
        kk_number: payload.kkNumber,
        description: payload.description,
      },
    });
    return {
      family,
    };
  }

  async updateFamily(id: number | undefined, familyPayload: IFamily) {
    if (!id) {
      throw new InvariantError(
        "Family already exists, Family id is required to update"
      );
    }
    const family = await this.getFamilyByHeadFamily(familyPayload.headFamily);

    if (!!family) {
      throw new NotFoundError("Family not found");
    }

    const updatedFamily = await this.prismaClient.family.update({
      where: {
        id,
      },
      data: familyPayload,
    });

    return {
      family: updatedFamily,
    };
  }

  async addFamilyMember(
    familyId: number,
    familyMember: IFamilyMember,
    createdById: number
  ) {
    const residenceLastRow = await this.getResidenceByDesc();
    const jobLastRow = await this.getJobByDesc();
    const knowledgeNutritionLastRow = await this.getKnowledgeNutritionbyDesc();
    const bmi = calculateBMI(
      familyMember.nutrition.height,
      familyMember.nutrition.weight
    );

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
            job_type_id: familyMember.job.jobTypeId,
          },
        },
        residence: {
          connectOrCreate: {
            where: {
              id: familyMember.residence.id ?? residenceLastRow?.id ?? 1,
            },
            create: {
              status: familyMember.residence.status,
              address: familyMember.residence.address,
              description: familyMember.residence.description,
            },
          },
        },
        family: {
          connect: {
            id: familyId,
          },
        },
        ...(familyMember.knowledgeNutrition?.knowledge && {
          knowledge_nutrition: {
            create: {
              knowledge: familyMember.knowledgeNutrition?.knowledge,
              score: familyMember.knowledgeNutrition?.score,
            },
          },
        }),
        ...(familyMember.institutionId && {
          institution: {
            connect: {
              id: familyMember.institutionId,
            },
          },
        }),
        nutrition: {
          create: {
            height: familyMember.nutrition.height,
            weight: familyMember.nutrition.weight,
            created_by: createdById,
            updated_by: createdById,
            ...(familyMember.nutrition.birth_weight && {
              birth_weight: familyMember.nutrition.birth_weight,
            }),
            bmi: familyMember.nutrition.bmi ?? bmi,
            status_id: determinedNutritionStatus.statusId,
          },
        },
        ...(familyMember.behaviour?.eatFrequency && {
          behaviour: {
            create: {
              drink_frequency: familyMember.behaviour.drinkFrequency,
              eat_frequency: familyMember.behaviour.eatFrequency,
              physical_activity: familyMember.behaviour.physicalActivity,
              sleep_quality: familyMember.behaviour.sleepQuality,
              phbs: familyMember.behaviour.phbs,
            },
          },
        }),
      },
      include: {
        residence: true,
        family: true,
        job: true,
        knowledge_nutrition: true,
        institution: true,
        behaviour: true,
        nutrition: true,
      },
    });

    return { familyMember: newMember };
  }

  async getJobByDesc() {
    return await this.prismaClient["job"].findFirst({
      orderBy: {
        id: "desc",
      },
    });
  }

  async getResidenceByDesc() {
    return await this.prismaClient["residence"].findFirst({
      orderBy: {
        id: "desc",
      },
    });
  }

  async getKnowledgeNutritionbyDesc() {
    return await this.prismaClient["knowledgeNutrition"].findFirst({
      orderBy: {
        id: "desc",
      },
    });
  }

  async getTotalGajiWithCategory(familyId: number, umr: number) {
    const familyMembers = await this.prismaClient.familyMember.findMany({
      where: {
        family_id: familyId,
      },
    });
    const totalFamily = familyMembers.length;

    const test = await this.prismaClient.job.findMany({
      where: {
        family_members: {
          some: {
            family_id: familyId,
          },
        },
      },
    });
    console.log({ test });

    const totalGaji = await this.prismaClient.job.aggregate({
      where: {
        family_members: {
          some: {
            family_id: familyId,
          },
        },
      },
      _sum: {
        income: true,
      },
    });

    const totalWages = totalGaji._sum.income?.toString() ?? 0;
    const categoryScore = calculateGajiScore(+totalWages, totalFamily, umr);

    return {
      totalGaji: totalWages,
      totalFamily,
      categoryScore,
    };
  }

  async getWageScoreOfFamilyMember(
    familyId: number,
    familyMemberId: number,
    umr: number
  ) {
    const familyMember = await this.prismaClient.familyMember.findUnique({
      where: {
        id: familyMemberId,
      },
      include: {
        job: {
          include: {
            job_type: true,
          },
        },
      },
    });
    const familyMembers = await this.prismaClient.familyMember.findMany({
      where: {
        family_id: familyId,
      },
    });

    if (!familyMember) {
      throw new NotFoundError("Family member not found");
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
          income: wage,
        },
      },
    };
  }

  async getChildrenScore(childrenId: number) {
    const children = await this.prismaClient.familyMember.findUnique({
      where: {
        id: childrenId,
        relation: "ANAK",
      },
      include: {
        nutrition: {
          take: 1,
          orderBy: {
            created_at: "desc",
          },
          include: {
            nutrition_status: true,
          },
        },
        behaviour: true,
      },
    });

    if (!children) {
      throw new NotFoundError("Children not found");
    }
    if (!children.nutrition.length) {
      throw new NotFoundError("Children nutrition not found");
    }
    const birthWeight = children.nutrition[0]?.birth_weight;
    let score = 0;
    if (birthWeight! > 4) {
      score = 1;
    }
    if (birthWeight! > 0 && birthWeight! <= 4) {
      score = 2;
    }
    const eatDrink =
      (children.behaviour?.eat_frequency ?? 0) +
      (children.behaviour?.drink_frequency ?? 0);
    const eatDrinkScore = calculateBehaviourScore(eatDrink);
    const physicalActivityScore = calculateBehaviourScore(
      children.behaviour?.physical_activity ?? 0
    );
    const sleepQualityScore = calculateBehaviourScore(
      children.behaviour?.sleep_quality ?? 0
    );
    const phbsScore = calculateBehaviourScore(children.behaviour?.phbs ?? 0);
    const nutritionStatusScore = calculateNutritionScore(
      children.nutrition[0].nutrition_status.id
    );
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
      risk,
    };
  }

  async addFamilyMemberV2(
    familyId: number | undefined,
    familyMember: IFamilyMember,
    createdBy: number
  ) {
    if (familyId) {
      if (!(await this.checkFamilyExist(familyId))) {
        throw new NotFoundError(
          "Family not found, please provide correct familyId"
        );
      }
      const isHeadFamilyExist = await this.checkIfHeadFamilyExist(familyId);
      if (isHeadFamilyExist && familyMember.relation === "AYAH") {
        throw new InvariantError(
          "Cannot add this user as a head family because head family already exists"
        );
      }
      const isMotherExist = await this.checkIfMotherExist(familyId);
      if (isMotherExist && familyMember.relation === "IBU") {
        throw new InvariantError(
          "Cannot add this user as a mother because mother already exists"
        );
      }
    }

    if (familyMember.phoneNumber) {
      const isPhoneNumberExist = await this.checkIfPhoneNumberExist(
        familyMember.phoneNumber
      );
      if (isPhoneNumberExist) {
        throw new InvariantError("Phone number already exist");
      }
    }
    const bmi = calculateBMI(
      familyMember.nutrition.height,
      familyMember.nutrition.weight
    );

    const determinedNutritionStatus = determineNutritionStatus(bmi);
    const newMember = await this.prismaClient.$transaction(async (trx) => {
      const newMember = await trx.familyMember.create({
        data: {
          full_name: familyMember.fullName,
          birth_date: familyMember.birthDate.toISOString(),
          education: familyMember.education,
          gender: familyMember.gender,
          relation: familyMember.relation,
          class: familyMember.class,
          phone_number: familyMember.phoneNumber,
          job: {
            create: {
              income: familyMember.job.income,
              job_type_id: familyMember.job.jobTypeId,
            },
          },
          residence: familyMember.residence?.id
            ? {
                connect: {
                  id: familyMember.residence.id,
                },
              }
            : {
                create: {
                  status: familyMember.residence.status,
                  address: familyMember.residence.address,
                  description: familyMember.residence.description,
                },
              },
          family: familyId
            ? {
                connect: {
                  id: familyId,
                },
              }
            : {
                create: {
                  head_family: familyMember.fullName,
                  head_phone_number: familyMember.phoneNumber!,
                  kk_number: familyMember.kkNumber,
                  description: familyMember.description,
                },
              },
          ...(familyMember.institutionId && {
            institution: {
              connect: {
                id: familyMember.institutionId,
              },
            },
          }),
          nutrition: {
            create: {
              height: familyMember.nutrition.height,
              weight: familyMember.nutrition.weight,
              created_by: createdBy,
              updated_by: createdBy,
              ...(familyMember.nutrition.birth_weight && {
                birth_weight: familyMember.nutrition.birth_weight,
              }),
              bmi: familyMember.nutrition.bmi ?? bmi,
              status_id: determinedNutritionStatus.statusId,
            },
          },
        },
        include: {
          residence: true,
          family: true,
          job: true,
          knowledge_nutrition: true,
          institution: true,
          behaviour: true,
          nutrition: {
            include: {
              nutrition_status: true,
            },
          },
        },
      });
      if (familyMember.relation === "ANAK") {
        await trx.student.create({
          data: {
            class: familyMember.class!,
            class_name: familyMember.className!,
            school_id: familyMember.institutionId!,
          },
        });
      }
      return newMember;
    });

    return { familyMember: newMember };
  }

  async checkFamilyExist(familyId: number) {
    const family = await this.prismaClient.family.findUnique({
      where: {
        id: familyId,
      },
    });
    return !!family;
  }

  async checkIfPhoneNumberExist(phoneNumber: string) {
    const familyMember = await this.prismaClient.familyMember.findUnique({
      where: {
        phone_number: phoneNumber,
      },
    });

    return !!familyMember;
  }

  async checkIfHeadFamilyExist(familyId: number) {
    const family = await this.prismaClient.family.findUnique({
      where: {
        id: familyId,
        head_family: {
          not: undefined,
        },
      },
    });
    return !!family;
  }

  async checkIfMotherExist(familyId: number) {
    const mother = await this.prismaClient.familyMember.findFirst({
      where: {
        family_id: familyId,
        relation: "IBU",
      },
    });

    return !!mother;
  }

  async getFamilyMembers(familyId: number) {
    const familyMembers = await this.prismaClient.familyMember.findMany({
      where: {
        family_id: familyId,
      },
      include: {
        residence: true,
        family: true,
        job: true,
        institution: true,
        nutrition: true,
      },
    });

    return {
      familyMembers: familyMembers.length
        ? familyMembers.map((member) => ({
            ...member,
            job: { ...member.job, income: member.job.income.toString() },
          }))
        : [],
    };
  }

  async getFamilyMember(familyId: number, memberId: number) {
    const familyMember = await this.prismaClient.familyMember.findUnique({
      where: {
        id: memberId,
        family_id: familyId,
      },
      include: {
        residence: true,
        family: true,
        job: true,
        institution: true,
        nutrition: true,
      },
    });

    if (!familyMember) {
      throw new NotFoundError("Family member not found");
    }

    return {
      familyMember: {
        ...familyMember,
        job: {
          ...familyMember.job,
          income: familyMember.job.income.toString(),
        },
      },
    };
  }

  async createFamilyWithMember(members: IMember[], createdBy: number) {
    const [headMember] = members;
    const { familyMembers } = await this.prismaClient.$transaction(
      async (prisma) => {
        const family = await prisma.family.create({
          data: {
            head_family: headMember.fullName,
            head_phone_number: headMember.phoneNumber!,
            kk_number: headMember.kkNumber,
            description: headMember.description,
          },
        });
        if (!family) {
          throw new InvariantError("Failed to create family");
        }
        await Promise.all(
          members.map(async (member) => {
            const memberBMI = calculateBMI(
              member.nutrition.height,
              member.nutrition.weight
            );

            const determinedNutritionStatus =
              determineNutritionStatus(memberBMI);

            if (member.phoneNumber) {
              const isPhoneNumberExists = await this.checkIfPhoneNumberExist(
                member.phoneNumber
              );
              if (isPhoneNumberExists) {
                throw new InvariantError(
                  `Phone number ${member.phoneNumber} already exists`
                );
              }
            }
            await prisma.familyMember.create({
              data: {
                full_name: member.fullName,
                birth_date: member.birthDate,
                education: member.education,
                gender: member.gender,
                relation: member.relation,
                class: member.class,
                phone_number: member.phoneNumber,
                family: {
                  connect: {
                    id: family.id,
                  },
                },
                residence: member.residence?.id
                  ? {
                      connect: {
                        id: member.residence.id,
                      },
                    }
                  : {
                      create: {
                        status: member.residence!.status,
                        address: member.residence!.address,
                        description: member.residence!.description,
                      },
                    },
                ...(member.institutionId && {
                  institution: {
                    connect: {
                      id: member.institutionId,
                    },
                  },
                }),
                nutrition: {
                  create: {
                    height: member.nutrition.height,
                    weight: member.nutrition.weight,
                    ...(member.nutrition.birth_weight && {
                      birth_weight: member.nutrition.birth_weight,
                    }),
                    bmi: memberBMI,
                    status_id: determinedNutritionStatus.statusId,
                    created_by: createdBy,
                    updated_by: createdBy,
                  },
                },
                job: {
                  create: {
                    income: member.job.income,
                    job_type_id: member.job.jobTypeId,
                  },
                },
              },
            });
          })
        );

        const familyMembers = await prisma.familyMember.findMany({
          where: { family_id: family.id },
          include: {
            nutrition: true,
            residence: true,
            institution: true,
          },
        });
        return { familyMembers };
      }
    );

    return { familyMembers };
  }

  async getFamilyMembersByHeadName(headName: string) {
    const familyMembers = await this.prismaClient.familyMember.findMany({
      where: {
        family: {
          head_family: headName,
        },
      },
      include: {
        job: true,
        nutrition: {
          include: {
            nutrition_status: true,
          },
        },
        residence: true,
      },
    });

    return {
      familyMembers: familyMembers.map((member) => ({
        ...member,
        job: {
          ...member.job,
          income: member.job.income.toString(),
        },
      })),
    };
  }

  async getFamilyMemberByHeadPhoneNumber(phoneNumber: string) {
    const familyMembers = await this.prismaClient.familyMember.findMany({
      where: {
        family: {
          head_phone_number: phoneNumber,
        },
      },
      include: {
        job: {
          include: {
            job_type: true,
          },
        },
        nutrition: {
          include: {
            nutrition_status: true,
          },
          take: 1,
          orderBy: {
            created_at: "desc",
          },
        },
        residence: true,
      },
    });

    return {
      familyMembers: familyMembers.map((member) => ({
        ...member,
        job: {
          ...member.job,
          income: member.job.income.toString(),
        },
      })),
    };
  }
}

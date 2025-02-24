import { PrismaClient } from "@prisma/client";

export class InstitutionService {
  constructor(private prismaClient: PrismaClient) {}

  async getInstitutions() {
    const institutions = await this.prismaClient.institution.findMany({});
    return { institutions };
  }

  async getHealthCares() {
    const healthCares = await this.prismaClient.institution.findMany({
      where: {
        institution_type: {
          id: 2,
        },
      },
    });

    return {
      healthCares,
    };
  }
}

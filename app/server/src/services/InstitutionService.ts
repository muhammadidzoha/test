import { PrismaClient } from "@prisma/client";
import { IInstitution } from "../types/auth";
import { NotFoundError } from "../common/exception";

export class InstitutionService {
  constructor(private prismaClient: PrismaClient) {}

  async getInstitutions() {
    const institutions = await this.prismaClient.institution.findMany({
      include: {
        province: true,
        city: true,
      },
    });
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

  async updateInstitution(
    institutionId: number,
    institutionType: number,
    payload: IInstitution & { userId?: number }
  ) {
    const { institution } = await this.getInstitutionById(
      institutionId,
      institutionType
    );
    if (!institution) {
      throw new NotFoundError(
        `${
          institutionId === 1 ? "School" : "Puskesmas"
        } with id ${institutionId} not found`
      );
    }
    const updatedInstitution = await this.prismaClient.institution.update({
      where: {
        id: institutionId,
        type: institutionType,
      },
      data: {
        ...institution,
        name: payload.name,
        address: payload.address,
        phone_number: payload.phoneNumber,
        email: payload.email,
        head_name: payload.headName,
        head_nip: payload.headNIP,
        user_id: payload.userId,
        province_id: payload.provinceId,
        city_id: payload.cityId,
      },
    });

    return { updatedInstitution };
  }

  async getInstitutionById(institutionId: number, institutionType: number) {
    const institution = await this.prismaClient.institution.findUnique({
      where: {
        id: institutionId,
        type: institutionType,
      },
    });

    return { institution };
  }

  async getOnlyInstitutionById(institutionId: number) {
    const institution = await this.prismaClient.institution.findUnique({
      where: {
        id: institutionId,
      },
    });

    return { institution };
  }

  async deleteInstitutionById(institutionId: number) {
    const { institution } = await this.getOnlyInstitutionById(institutionId);
    if (!institution) {
      throw new NotFoundError(`Institution with id ${institutionId} not found`);
    }

    const deletedInstitution = await this.prismaClient.institution.delete({
      where: {
        id: institutionId,
      },
    });
    return { deletedInstitution };
  }

  async addInstitution(
    payload: {
      name: string;
      address: string;
      phoneNumber: string;
      email: string;
      headName?: string;
      headNip?: string;
      userId?: number;
      type: number;
      provinceId?: number;
      cityId?: number;
    },
    institutionType: number
  ) {
    const newInstitution = await this.prismaClient.institution.create({
      data: {
        name: payload.name,
        address: payload.address,
        phone_number: payload.phoneNumber,
        email: payload.email,
        head_name: payload.headName,
        head_nip: payload.headNip,
        type: institutionType,
        province_id: payload.provinceId,
        city_id: payload.cityId,
        user_id: payload.userId ?? null,
      },
    });

    return { newInstitution };
  }

  async addInstitutioWithoutAccount(payload: {
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
  }) {
    const institution = await this.prismaClient.institution.create({
      data: {
        name: payload.name,
        address: payload.address,
        phone_number: payload.phoneNumber,
        email: payload.email,
        type: 2,
      },
    });
    return { institution };
  }
}

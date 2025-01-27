import { PrismaClient } from "@prisma/client";
import { IHealthCare, IHealthCareMember, IHealthEducation, IHealthServicePayload, ISchoolEnvironment } from "../types/school";
import { InvariantError, NotFoundError } from "../common/exception";
import { AuthService } from "./AuthService";

export class SchoolService {
    constructor(public prismaClient: PrismaClient, public authService: AuthService) { }
    // Health Education Services
    async createOrUpdateHealthEducation(schoolId: number, payload: IHealthEducation) {
        const { healthEducation } = await this.getHealthEducation(schoolId);
        if (!healthEducation) {
            return await this.createHealthEducation(schoolId, payload);
        }

        return await this.updateHealthEducation(schoolId, payload);
    }

    async createHealthEducation(schoolId: number, payload: IHealthEducation) {
        const healthEducation = await this.prismaClient.healthEducation.create({
            data: {
                health_education_plan: payload.healthEducationPlan,
                health_education: payload.healthEducation,
                physical_education: payload.physicalEducation,
                cader_coaching: payload.caderCoaching,
                extracurricular_health_activities: payload.extracurricularHealthActivities,
                fitness_test: payload.fitnessTest,
                healthy_breakfast_program: payload.healthyBreakfastProgram,
                healthy_living_implementation: payload.healthyLivingImplementation,
                literacy_health_program: payload.literacyHealthProgram,
                nutrition_education: payload.nutritionEducation,
                parent_involvement: payload.parentInvolvement,
                physical_class_activities: payload.physicalClassActivities,
                school_id: schoolId
            }

        })

        return {
            healthEducation
        }
    }

    async updateHealthEducation(schoolId: number, payload: IHealthEducation) {
        const { healthEducation } = await this.getHealthEducation(schoolId);
        if (!healthEducation) {
            throw new NotFoundError('Health Education not found');
        }

        const updatedHealthEducation = await this.prismaClient.healthEducation.update({
            where: {
                school_id: schoolId
            },
            data: {
                cader_coaching: payload.caderCoaching,
                extracurricular_health_activities: payload.extracurricularHealthActivities,
                fitness_test: payload.fitnessTest,
                health_education: payload.healthEducation,
                health_education_plan: payload.healthEducationPlan,
                healthy_breakfast_program: payload.healthyBreakfastProgram,
                healthy_living_implementation: payload.healthyLivingImplementation,
                literacy_health_program: payload.literacyHealthProgram,
                nutrition_education: payload.nutritionEducation,
                parent_involvement: payload.parentInvolvement,
                physical_class_activities: payload.physicalClassActivities,
                physical_education: payload.physicalEducation,
            }
        })

        return { healthEducation: updatedHealthEducation }
    }

    async getHealthEducation(schoolId: number) {
        const healthEducation = await this.prismaClient.healthEducation.findUnique({
            where: {
                school_id: schoolId
            }
        });

        return { healthEducation };
    }


    // Health Services Service
    async createOrUpdateHealthServices(schoolId: number, payload: IHealthServicePayload) {
        const { healthService } = await this.getHealthService(schoolId);
        if (!healthService) {
            return await this.createHealthService(schoolId, payload);
        }

        return await this.updateHealthService(schoolId, payload);
    }

    async getHealthService(schoolId: number) {
        const healthService = await this.prismaClient.healthService.findUnique({
            where: {
                school_id: schoolId
            }
        });

        return {
            healthService
        }
    }

    async createHealthService(schoolId: number, payload: IHealthServicePayload) {
        const healthService = await this.prismaClient.healthService.create({
            data: {
                health_check_routine: payload.healthCheckRoutine,
                referral_handling: payload.referralHandling,
                consuling_facility: payload.consulingFacility,
                periodic_screening_inspection: payload.periodicScreeningInspection,
                school_id: schoolId
            }
        });

        return { healthService };
    }

    async updateHealthService(schoolId: number, payload: IHealthServicePayload) {
        const healthService = await this.prismaClient.healthService.update({
            where: {
                school_id: schoolId
            },
            data: {
                referral_handling: payload.referralHandling,
                consuling_facility: payload.consulingFacility,
                periodic_screening_inspection: payload.periodicScreeningInspection,
                health_check_routine: payload.healthCheckRoutine
            }
        })

        return { healthService };
    }

    // School Environment Service
    async createOrUpdateSchoolEnvironment(schoolId: number, payload: ISchoolEnvironment) {
        const { schoolEnvironment } = await this.getSchoolEnvironment(schoolId);
        if (!schoolEnvironment) {
            return await this.createSchoolEnvironment(schoolId, payload);
        }

        return await this.updateSchoolEnvironment(schoolId, payload);
    }

    async getSchoolEnvironment(schoolId: number) {
        const schoolEnvironment = await this.prismaClient.schoolEnvironment.findUnique({
            where: {
                school_id: schoolId
            }
        });

        return { schoolEnvironment };
    }

    async createSchoolEnvironment(schoolId: number, payload: ISchoolEnvironment) {
        const schoolEnvironment = await this.prismaClient.schoolEnvironment.create({
            data: {
                canteen: payload.canteen,
                green_space: payload.greenSpace,
                trash_can: payload.trashCan,
                unprotected_area_policy: payload.unprotectedAreaPolicy,
                school_id: schoolId
            }
        });

        return { schoolEnvironment };
    }

    async updateSchoolEnvironment(schoolId: number, payload: ISchoolEnvironment) {
        const schoolEnvironment = await this.prismaClient.schoolEnvironment.update({
            where: {
                school_id: schoolId
            },
            data: {
                canteen: payload.canteen,
                green_space: payload.greenSpace,
                trash_can: payload.trashCan,
                unprotected_area_policy: payload.unprotectedAreaPolicy,
            }
        });

        return { schoolEnvironment };
    }

    async createOrUpdateHealthCare(schoolId: number, payload: IHealthCare, senderEmail: string) {
        const { healthCare } = await this.getHealthCareBySchoolId(schoolId);
        if (!healthCare) {
            return await this.createInitHealthCare(schoolId, payload, senderEmail);
        }
        return await this.updateHealthCare(schoolId, payload);
    }

    async createInitHealthCare(schoolId: number, payload: IHealthCare, senderEmail: string) {
        const { healthCare } = await this.createHealthCare(schoolId, payload)
        await this.authService.sendEmailRegistration({ schoolId, healthCareId: healthCare.id, email: payload.email, name: payload.leadName, senderEmail, positionId: payload.positionId })
        return {
            healthCare
        }
    }

    async createHealthCare(schoolId: number, payload: IHealthCare) {
        const newHealthCare = await this.prismaClient.healthCare.create({
            data: {
                school_id: schoolId,
                lead_name: payload.leadName,
                name: payload.name,
            }
        });

        return {
            healthCare: newHealthCare
        }
    }

    async updateHealthCare(schoolId: number, payload: IHealthCare) {
        const updatedHealthCare = await this.prismaClient.healthCare.update({
            where: {
                school_id: schoolId
            },
            data: {
                lead_name: payload.leadName,
                name: payload.name
            }
        });

        return {
            healthCare: updatedHealthCare
        }
    }

    async getHealthCareBySchoolId(schoolId: number) {
        const healthCare = await this.prismaClient.healthCare.findUnique({
            where: {
                school_id: schoolId
            },
        });

        return { healthCare };
    }

    async addHealthCareMember(payload: IHealthCareMember) {
        const { healthCareMember } = await this.getHealthCareMemberByName(payload.name);

        if (payload.positionId === 1) {
            await this.ensureLeadPositionIsNotOccupied(payload.positionId);
        }

        if (!!healthCareMember) {
            throw new InvariantError('Health Care Member already exists');
        }

        const createdHealthCareMember = await this.prismaClient.healthCareMember.create({
            data: {
                name: payload.name,
                health_care: {
                    connect: {
                        id: payload.healthCareId
                    }
                },
                position: {
                    connect: {
                        id: payload.positionId
                    }
                },
                ...(payload.userId && ({
                    user: {
                        connect: {
                            id: payload.userId
                        }
                    }
                }))
            },
            include: {
                health_care: true,
                position: true,
                user: true
            }
        })

        return {
            healthCareMember: createdHealthCareMember
        };
    }

    async getHealthCareMemberByName(name: string) {
        const healthCareMember = await this.prismaClient.healthCareMember.findFirst({
            where: {
                name: {
                    contains: name
                }
            }
        });

        return {
            healthCareMember
        }
    }

    async ensureLeadPositionIsNotOccupied(positionId: number) {
        const position = await this.prismaClient.healthCareMember.findFirst({
            where: {
                position_id: positionId
            }
        });

        if (!!position) {
            throw new InvariantError('Lead Position is already occupied');
        }

        return {
            position
        }
    }
}
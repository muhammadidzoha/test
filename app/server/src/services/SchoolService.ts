import { PrismaClient } from "@prisma/client";
import { IHealthEducation } from "../types/school";
import { NotFoundError } from "../common/exception";

export class SchoolService {
    constructor(public prismaClient: PrismaClient) { }

    async createOrUpdateHealthEducation(schoolId: number, payload: IHealthEducation) {
        const { healthEducation } = await this.getHealthEducation(schoolId);
        console.log({ healthEducation });
        if (!healthEducation) {
            return this.createHealthEducation(schoolId, payload);
        }

        return this.updateHealthEducation(schoolId, payload);
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
}
import { PrismaClient } from "@prisma/client";
import { IIntervention } from "../types/puskesmas";

export class InterventionService {
    constructor(public prismaClient: PrismaClient) { }

    async createIntervention(payload: IIntervention) {
        const intervention = await this.prismaClient.intervention.create({
            data: {
                recommendation: payload.recommendation,
                family_member_id: payload.familyMemberId,
                institution_id: payload.instituonId,
                created_by: payload.createdBy,
                program_recommendation: payload.programRecommendation
            },
            include: {
                institution: true,
                family_member: true,
                program: true,
                user: true
            }
        });

        return { intervention };
    }

    async getInterventionsBelongToFamily(institutionId: number, familyId: number) {
        const interventions = await this.prismaClient.intervention.findMany({
            where: {
                institution_id: institutionId,
                family_member: {
                    family: {
                        id: familyId
                    }
                }
            },
            include: {
                institution: true,
                family_member: true,
                program: true,
                user: true
            }
        });

        return { interventions };
    }

    async getInterventionsBelongToInstitution(institutionId: number) {
        const interventions = await this.prismaClient.intervention.findMany({
            where: {
                institution_id: institutionId
            },
            include: {
                institution: true,
                family_member: true,
                program: true,
                user: true
            }
        });

        return { interventions }
    }

    async getInterventionById(interventionId: number) {
        const intervention = await this.prismaClient.intervention.findUnique({
            where: {
                id: interventionId
            },
            include: {
                institution: true,
                family_member: true,
                program: true,
                user: true
            }
        });

        return { intervention };
    }
};
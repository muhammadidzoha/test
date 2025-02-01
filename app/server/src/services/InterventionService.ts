import { PrismaClient } from "@prisma/client";
import { IIntervention, IRequestIntervention } from "../types/puskesmas";

export class InterventionService {
    constructor(public prismaClient: PrismaClient) { }

    async requestIntervention(payload: IRequestIntervention) {
        const intervention = await this.prismaClient.requestIntervention.create({
            data: {
                puskesmas_id: payload.institutionId,
                created_by: payload.createdBy,
                family_member_id: payload.familyId,
            },
            include: {
                institution: true,
                family_member: true,
                user: {
                    include: {
                        institution: true
                    }
                },
            }
        });

        return { intervention }
    }

    async createIntervention(payload: IIntervention) {
        const intervention = await this.prismaClient.intervention.create({
            data: {
                recommendation: payload.recommendation,
                request_intervention_id: payload.requestInterventionId,
                puskesmas_id: payload.puskesmasId,
                created_by: payload.createdBy
            },
            include: {
                institution: true,
                program: true,
                user: true,
                request_intervention: true
            }
        });

        return { intervention };
    }

    async getRequestedInterventionBelongToSchool(puskesmasId: number, schoolId: number) {
        const requestInterventions = await this.prismaClient.requestIntervention.findMany({
            where: {
                puskesmas_id: puskesmasId,
                user: {
                    institution: {
                        id: schoolId
                    }
                }
            },
            include: {
                family_member: true,
                user: {
                    include: {
                        institution: true
                    }
                },
                institution: true,
                intervention: true
            }
        });

        return { requestInterventions }
    }

    async getRequestInterventionBelongToFamily(puskesmasId: number, familyId: number) {
        const requestInterventions = await this.prismaClient.requestIntervention.findMany({
            where: {
                puskesmas_id: puskesmasId,
                family_member: {
                    family: {
                        id: familyId
                    }
                }
            },
            include: {
                family_member: {
                    include: {
                        family: true
                    }
                },
                user: {
                    include: {
                        institution: true
                    }
                },
                institution: true,
                intervention: true
            }
        });

        return { requestInterventions }
    }

    async getAllRequestInterventionBelongToInstitution(puskesmasId: number) {
        const requestInterventions = await this.prismaClient.requestIntervention.findMany({
            where: {
                puskesmas_id: puskesmasId
            },
            include: {
                family_member: {
                    include: {
                        family: true
                    }
                },
                user: {
                    include: {
                        institution: true
                    }
                },
                institution: true,
                intervention: true
            }
        });

        return { requestInterventions }
    }

    // async getInterventionsBelongToFamily(institutionId: number, familyId: number) {
    //     const interventions = await this.prismaClient.intervention.findMany({
    //         where: {
    //             institution_id: institutionId,
    //             family_member: {
    //                 family: {
    //                     id: familyId
    //                 }
    //             }
    //         },
    //         include: {
    //             institution: true,
    //             family_member: {
    //                 select: {
    //                     institution: true
    //                 }
    //             },
    //             program: true,
    //             user: true
    //         }
    //     });

    //     return { interventions };
    // }

    // async getInterventionsBelongToInstitution(institutionId: number) {
    //     const interventions = await this.prismaClient.intervention.findMany({
    //         where: {
    //             institution_id: institutionId
    //         },
    //         include: {
    //             institution: true,
    //             family_member: true,
    //             program: true,
    //             user: true
    //         }
    //     });

    //     return { interventions }
    // }

    // async getInterventionBelongsToSchool(schoolId: number) {
    //     const interventions = await this.prismaClient.intervention.findMany({
    //         where: {
    //             family_member: {
    //                 institution_id: schoolId
    //             }
    //         }
    //     });

    //     return { interventions }
    // }

    // async getInterventionById(interventionId: number) {
    //     const intervention = await this.prismaClient.intervention.findUnique({
    //         where: {
    //             id: interventionId
    //         },
    //         include: {
    //             institution: true,
    //             family_member: true,
    //             program: true,
    //             user: true
    //         }
    //     });

    //     return { intervention };
    // }
};
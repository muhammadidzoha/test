"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterventionService = void 0;
class InterventionService {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    createIntervention(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const intervention = yield this.prismaClient.intervention.create({
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
        });
    }
    getInterventionsBelongToFamily(institutionId, familyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const interventions = yield this.prismaClient.intervention.findMany({
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
                    family_member: {
                        select: {
                            institution: true
                        }
                    },
                    program: true,
                    user: true
                }
            });
            return { interventions };
        });
    }
    getInterventionsBelongToInstitution(institutionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const interventions = yield this.prismaClient.intervention.findMany({
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
            return { interventions };
        });
    }
    getInterventionBelongsToSchool(schoolId) {
        return __awaiter(this, void 0, void 0, function* () {
            const interventions = yield this.prismaClient.intervention.findMany({
                where: {
                    family_member: {
                        institution_id: schoolId
                    }
                }
            });
            return { interventions };
        });
    }
    getInterventionById(interventionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const intervention = yield this.prismaClient.intervention.findUnique({
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
        });
    }
}
exports.InterventionService = InterventionService;
;

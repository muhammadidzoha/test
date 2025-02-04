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
exports.FamilyService = void 0;
const exception_1 = require("../common/exception");
const CalculateBMI_1 = require("../common/utils/CalculateBMI");
const CalculateZscore_1 = require("../common/utils/CalculateZscore");
class FamilyService {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    createOrUpdateFamily(id, familyPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { family } = yield this.getFamilyByHeadFamily(familyPayload.headFamily);
            if (!family) {
                return yield this.createFamily(familyPayload);
            }
            return yield this.updateFamily(id, familyPayload);
        });
    }
    getFamilyByHeadFamily(headFamily) {
        return __awaiter(this, void 0, void 0, function* () {
            const family = yield this.prismaClient.family.findFirst({
                where: {
                    head_family: headFamily
                }
            });
            return {
                family
            };
        });
    }
    createFamily(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const family = yield this.prismaClient.family.create({
                data: {
                    head_family: payload.headFamily,
                    head_phone_number: payload.headPhoneNumber,
                    kk_number: payload.kkNumber,
                    description: payload.description
                }
            });
            return {
                family
            };
        });
    }
    updateFamily(id, familyPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new exception_1.InvariantError('Family already exists, Family id is required to update');
            }
            const family = yield this.getFamilyByHeadFamily(familyPayload.headFamily);
            if (!!family) {
                throw new exception_1.NotFoundError('Family not found');
            }
            const updatedFamily = yield this.prismaClient.family.update({
                where: {
                    id
                },
                data: familyPayload
            });
            return {
                family: updatedFamily
            };
        });
    }
    addFamilyMember(familyId, familyMember, createdById) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            const residenceLastRow = yield this.getResidenceByDesc();
            const jobLastRow = yield this.getJobByDesc();
            const knowledgeNutritionLastRow = yield this.getKnowledgeNutritionbyDesc();
            const bmi = (0, CalculateBMI_1.calculateBMI)(familyMember.nutrition.height, familyMember.nutrition.weight);
            const determinedNutritionStatus = (0, CalculateZscore_1.determineNutritionStatus)(bmi);
            const newMember = yield this.prismaClient.familyMember.create({
                data: Object.assign(Object.assign(Object.assign(Object.assign({ full_name: familyMember.fullName, birth_date: familyMember.birthDate.toISOString(), education: familyMember.education, gender: familyMember.gender, relation: familyMember.relation, job: {
                        connectOrCreate: {
                            where: {
                                id: (_b = (_a = familyMember.job.id) !== null && _a !== void 0 ? _a : jobLastRow === null || jobLastRow === void 0 ? void 0 : jobLastRow.id) !== null && _b !== void 0 ? _b : 1
                            },
                            create: {
                                name: familyMember.job.name,
                                income: familyMember.job.income
                            }
                        }
                    }, residence: {
                        connectOrCreate: {
                            where: {
                                id: (_d = (_c = familyMember.residence.id) !== null && _c !== void 0 ? _c : residenceLastRow === null || residenceLastRow === void 0 ? void 0 : residenceLastRow.id) !== null && _d !== void 0 ? _d : 1
                            },
                            create: {
                                status: familyMember.residence.status,
                                address: familyMember.residence.address,
                                description: familyMember.residence.description
                            }
                        }
                    }, family: {
                        connect: {
                            id: familyId
                        }
                    } }, (((_e = familyMember.knowledgeNutrition) === null || _e === void 0 ? void 0 : _e.knowledge) && ({
                    knowledge_nutrition: {
                        create: {
                            knowledge: (_f = familyMember.knowledgeNutrition) === null || _f === void 0 ? void 0 : _f.knowledge,
                            score: (_g = familyMember.knowledgeNutrition) === null || _g === void 0 ? void 0 : _g.score
                        }
                    }
                }))), (familyMember.institutionId && {
                    institution: {
                        connect: {
                            id: familyMember.institutionId
                        }
                    }
                })), { nutrition: {
                        create: Object.assign(Object.assign({ height: familyMember.nutrition.height, weight: familyMember.nutrition.weight, created_by: createdById, updated_by: createdById }, (familyMember.nutrition.birth_weight && {
                            birth_weight: familyMember.nutrition.birth_weight
                        })), { bmi: (_h = familyMember.nutrition.bmi) !== null && _h !== void 0 ? _h : bmi, status_id: determinedNutritionStatus.statusId })
                    } }), (((_j = familyMember.behaviour) === null || _j === void 0 ? void 0 : _j.eatFrequency) && {
                    behaviour: {
                        create: {
                            drink_frequency: familyMember.behaviour.drinkFrequency,
                            eat_frequency: familyMember.behaviour.eatFrequency,
                            physical_activity: familyMember.behaviour.physicalActivity,
                            sleep_quality: familyMember.behaviour.sleepQuality
                        }
                    }
                })),
                include: {
                    residence: true,
                    family: true,
                    job: true,
                    knowledge_nutrition: true,
                    institution: true,
                    behaviour: true,
                    nutrition: true
                }
            });
            return { familyMember: newMember };
        });
    }
    getJobByDesc() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prismaClient['job'].findFirst({
                orderBy: {
                    id: 'desc'
                }
            });
        });
    }
    getResidenceByDesc() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prismaClient['residence'].findFirst({
                orderBy: {
                    id: 'desc'
                }
            });
        });
    }
    getKnowledgeNutritionbyDesc() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prismaClient['knowledgeNutrition'].findFirst({
                orderBy: {
                    id: 'desc'
                }
            });
        });
    }
}
exports.FamilyService = FamilyService;

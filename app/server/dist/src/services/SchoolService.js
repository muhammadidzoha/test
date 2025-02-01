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
exports.SchoolService = void 0;
const exception_1 = require("../common/exception");
const CalculateServiceScore_1 = require("../common/utils/CalculateServiceScore");
class SchoolService {
    constructor(prismaClient, authService) {
        this.prismaClient = prismaClient;
        this.authService = authService;
    }
    // Health Education Services
    createOrUpdateHealthEducation(schoolId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { healthEducation } = yield this.getHealthEducation(schoolId);
            if (!healthEducation) {
                return yield this.createHealthEducation(schoolId, payload);
            }
            return yield this.updateHealthEducation(schoolId, payload);
        });
    }
    createHealthEducation(schoolId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceScore = (0, CalculateServiceScore_1.calculateServiceScore)(Object.values(payload));
            const categorize_id = (0, CalculateServiceScore_1.categorizeServiceScore)(serviceScore);
            console.log({ serviceScore, categorize_id });
            const healthEducation = yield this.prismaClient.healthEducation.create({
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
                    school_id: schoolId,
                    category_id: categorize_id,
                    score: serviceScore,
                },
                include: {
                    service_category: true
                }
            });
            return {
                healthEducation
            };
        });
    }
    updateHealthEducation(schoolId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceScore = (0, CalculateServiceScore_1.calculateServiceScore)(Object.values(payload));
            const categorize_id = (0, CalculateServiceScore_1.categorizeServiceScore)(serviceScore);
            const { healthEducation } = yield this.getHealthEducation(schoolId);
            if (!healthEducation) {
                throw new exception_1.NotFoundError('Health Education not found');
            }
            const updatedHealthEducation = yield this.prismaClient.healthEducation.update({
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
                    score: serviceScore,
                    category_id: categorize_id
                },
                include: {
                    service_category: true
                }
            });
            return { healthEducation: updatedHealthEducation };
        });
    }
    getHealthEducation(schoolId) {
        return __awaiter(this, void 0, void 0, function* () {
            const healthEducation = yield this.prismaClient.healthEducation.findUnique({
                where: {
                    school_id: schoolId
                },
                include: {
                    service_category: true
                }
            });
            return { healthEducation };
        });
    }
    // Health Services Service
    createOrUpdateHealthServices(schoolId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { healthService } = yield this.getHealthService(schoolId);
            if (!healthService) {
                return yield this.createHealthService(schoolId, payload);
            }
            return yield this.updateHealthService(schoolId, payload);
        });
    }
    getHealthService(schoolId) {
        return __awaiter(this, void 0, void 0, function* () {
            const healthService = yield this.prismaClient.healthService.findUnique({
                where: {
                    school_id: schoolId
                }
            });
            return {
                healthService
            };
        });
    }
    createHealthService(schoolId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceScore = (0, CalculateServiceScore_1.calculateServiceScore)(Object.values(payload));
            const categorize_id = (0, CalculateServiceScore_1.categorizeServiceScore)(serviceScore);
            const healthService = yield this.prismaClient.healthService.create({
                data: {
                    health_check_routine: payload.healthCheckRoutine,
                    referral_handling: payload.referralHandling,
                    consuling_facility: payload.consulingFacility,
                    periodic_screening_inspection: payload.periodicScreeningInspection,
                    school_id: schoolId,
                    category_id: categorize_id,
                    score: serviceScore,
                },
                include: {
                    service_category: true
                }
            });
            return { healthService };
        });
    }
    updateHealthService(schoolId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceScore = (0, CalculateServiceScore_1.calculateServiceScore)(Object.values(payload));
            const categorize_id = (0, CalculateServiceScore_1.categorizeServiceScore)(serviceScore);
            const healthService = yield this.prismaClient.healthService.update({
                where: {
                    school_id: schoolId
                },
                data: {
                    referral_handling: payload.referralHandling,
                    consuling_facility: payload.consulingFacility,
                    periodic_screening_inspection: payload.periodicScreeningInspection,
                    health_check_routine: payload.healthCheckRoutine,
                    score: serviceScore,
                    category_id: categorize_id
                },
                include: {
                    service_category: true
                }
            });
            return { healthService };
        });
    }
    // School Environment Service
    createOrUpdateSchoolEnvironment(schoolId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { schoolEnvironment } = yield this.getSchoolEnvironment(schoolId);
            if (!schoolEnvironment) {
                return yield this.createSchoolEnvironment(schoolId, payload);
            }
            return yield this.updateSchoolEnvironment(schoolId, payload);
        });
    }
    getSchoolEnvironment(schoolId) {
        return __awaiter(this, void 0, void 0, function* () {
            const schoolEnvironment = yield this.prismaClient.schoolEnvironment.findUnique({
                where: {
                    school_id: schoolId
                },
                include: {
                    service_category: true
                }
            });
            return { schoolEnvironment };
        });
    }
    createSchoolEnvironment(schoolId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceScore = (0, CalculateServiceScore_1.calculateServiceScore)(Object.values(payload));
            const categorize_id = (0, CalculateServiceScore_1.categorizeServiceScore)(serviceScore);
            const schoolEnvironment = yield this.prismaClient.schoolEnvironment.create({
                data: {
                    canteen: payload.canteen,
                    green_space: payload.greenSpace,
                    trash_can: payload.trashCan,
                    unprotected_area_policy: payload.unprotectedAreaPolicy,
                    school_id: schoolId,
                    category_id: categorize_id,
                    score: serviceScore,
                },
                include: {
                    service_category: true
                }
            });
            return { schoolEnvironment };
        });
    }
    updateSchoolEnvironment(schoolId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceScore = (0, CalculateServiceScore_1.calculateServiceScore)(Object.values(payload));
            const categorize_id = (0, CalculateServiceScore_1.categorizeServiceScore)(serviceScore);
            const schoolEnvironment = yield this.prismaClient.schoolEnvironment.update({
                where: {
                    school_id: schoolId
                },
                data: {
                    canteen: payload.canteen,
                    green_space: payload.greenSpace,
                    trash_can: payload.trashCan,
                    unprotected_area_policy: payload.unprotectedAreaPolicy,
                    score: serviceScore,
                    category_id: categorize_id
                },
                include: {
                    service_category: true
                }
            });
            return { schoolEnvironment };
        });
    }
    createOrUpdateHealthCare(schoolId, payload, senderEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const { healthCare } = yield this.getHealthCareBySchoolId(schoolId);
            if (!healthCare) {
                return yield this.createInitHealthCare(schoolId, payload, senderEmail);
            }
            return yield this.updateHealthCare(schoolId, payload);
        });
    }
    createInitHealthCare(schoolId, payload, senderEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const { healthCare } = yield this.createHealthCare(schoolId, payload);
            yield this.authService.sendEmailRegistration({ schoolId, healthCareId: healthCare.id, email: payload.email, name: payload.leadName, senderEmail, positionId: payload.positionId });
            return {
                healthCare
            };
        });
    }
    createHealthCare(schoolId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const newHealthCare = yield this.prismaClient.healthCare.create({
                data: {
                    school_id: schoolId,
                    lead_name: payload.leadName,
                    name: payload.name,
                }
            });
            return {
                healthCare: newHealthCare
            };
        });
    }
    updateHealthCare(schoolId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedHealthCare = yield this.prismaClient.healthCare.update({
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
            };
        });
    }
    getHealthCareBySchoolId(schoolId) {
        return __awaiter(this, void 0, void 0, function* () {
            const healthCare = yield this.prismaClient.healthCare.findUnique({
                where: {
                    school_id: schoolId
                },
            });
            return { healthCare };
        });
    }
    addHealthCareMember(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { healthCareMember } = yield this.getHealthCareMemberByName(payload.name);
            if (payload.positionId === 1) {
                yield this.ensureLeadPositionIsNotOccupied(payload.positionId);
            }
            if (!!healthCareMember) {
                throw new exception_1.InvariantError('Health Care Member already exists');
            }
            const createdHealthCareMember = yield this.prismaClient.healthCareMember.create({
                data: Object.assign({ name: payload.name, health_care: {
                        connect: {
                            id: payload.healthCareId
                        }
                    }, position: {
                        connect: {
                            id: payload.positionId
                        }
                    } }, (payload.userId && ({
                    user: {
                        connect: {
                            id: payload.userId
                        }
                    }
                }))),
                include: {
                    health_care: true,
                    position: true,
                    user: true
                }
            });
            return {
                healthCareMember: createdHealthCareMember
            };
        });
    }
    getHealthCareMemberByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const healthCareMember = yield this.prismaClient.healthCareMember.findFirst({
                where: {
                    name: {
                        contains: name
                    }
                }
            });
            return {
                healthCareMember
            };
        });
    }
    ensureLeadPositionIsNotOccupied(positionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const position = yield this.prismaClient.healthCareMember.findFirst({
                where: {
                    position_id: positionId
                }
            });
            if (!!position) {
                throw new exception_1.InvariantError('Lead Position is already occupied');
            }
            return {
                position
            };
        });
    }
    createFacility(schoolId, payload, facilityType) {
        return __awaiter(this, void 0, void 0, function* () {
            const facility = yield this.prismaClient.schoolFacility.create({
                data: {
                    name: payload.name,
                    description: payload.description,
                    school_id: schoolId,
                    facility_type_id: facilityType
                },
                include: {
                    facility_type: true
                }
            });
            return {
                facility
            };
        });
    }
    getFacilityBySchoolId(schoolId) {
        return __awaiter(this, void 0, void 0, function* () {
            const facilities = yield this.prismaClient.schoolFacility.findMany({
                where: {
                    school_id: schoolId
                },
                include: {
                    school: true,
                    facility_type: true
                }
            });
            return {
                facilities
            };
        });
    }
    getFacilityById(facilityId, schoolId) {
        return __awaiter(this, void 0, void 0, function* () {
            const facility = yield this.prismaClient.schoolFacility.findUnique({
                where: {
                    id: facilityId,
                    school_id: schoolId
                },
                include: {
                    facility_type: true,
                    school: true
                }
            });
            return {
                facility
            };
        });
    }
    ;
    deleteFacility(facilityId, schoolId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedFacility = yield this.prismaClient.schoolFacility.delete({
                where: {
                    id: facilityId,
                    school_id: schoolId
                },
                include: {
                    facility_type: true,
                    school: true
                }
            });
            return {
                facility: deletedFacility
            };
        });
    }
    updateFacility(facilityId, payload, schoolId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { facility } = yield this.getFacilityById(facilityId, schoolId);
            if (!facility) {
                throw new exception_1.NotFoundError('Facility not found');
            }
            ;
            const updatedFacility = yield this.prismaClient.schoolFacility.update({
                where: {
                    id: facilityId,
                    school_id: schoolId
                },
                data: {
                    name: payload.name,
                    description: payload.description,
                    facility_type_id: payload.facilityTypeId
                },
                include: {
                    facility_type: true,
                    school: true
                }
            });
            return {
                facility: updatedFacility
            };
        });
    }
    getUKSQuisioner(schoolId) {
        return __awaiter(this, void 0, void 0, function* () {
            const uksQuisioner = yield this.prismaClient.uKSManagementQuisioner.findUnique({
                where: {
                    school_id: schoolId
                },
                include: {
                    service_category: true
                }
            });
            return {
                uksQuisioner
            };
        });
    }
    getSchoolStratifications(schoolId) {
        return __awaiter(this, void 0, void 0, function* () {
            const schoolStratification = yield this.prismaClient.institution.findUnique({
                where: {
                    id: schoolId
                },
                include: {
                    health_education: {
                        include: {
                            service_category: true
                        }
                    },
                    health_service: {
                        include: {
                            service_category: true
                        }
                    },
                    school_environment: {
                        include: {
                            service_category: true
                        }
                    },
                    uks_management_quisioner: {
                        include: {
                            service_category: true
                        }
                    }
                }
            });
            return {
                schoolStratification
            };
        });
    }
}
exports.SchoolService = SchoolService;

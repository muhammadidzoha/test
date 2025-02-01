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
exports.SchoolController = void 0;
const http_1 = require("../common/http");
const HealthEducationValidator_1 = require("../common/http/requestvalidator/HealthEducationValidator");
const exception_1 = require("../common/exception");
const HealthServiceValidator_1 = require("../common/http/requestvalidator/HealthServiceValidator");
const SchoolEnvironmentValidator_1 = require("../common/http/requestvalidator/SchoolEnvironmentValidator");
const HealhCareValidator_1 = require("../common/http/requestvalidator/HealhCareValidator");
const SchoolValidator_1 = require("../common/http/requestvalidator/SchoolValidator");
class SchoolController {
    constructor(schoolService) {
        this.schoolService = schoolService;
    }
    createOrUpdateHealthEducation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(HealthEducationValidator_1.HealthEducationSchema, req.body);
                const { schoolId } = req.params;
                if (!schoolId) {
                    throw new exception_1.InvariantError('School Id is required in Parameter');
                }
                console.log({ schoolId });
                const reqPayload = req.body;
                const { healthEducation } = yield this.schoolService.createOrUpdateHealthEducation(+schoolId, reqPayload);
                res.status(201).json({
                    status: 'Success',
                    message: `Health Education for School ${schoolId} is Created or Updated`,
                    data: healthEducation
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    createOrUpdateHealthService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(HealthServiceValidator_1.HealthServiceSchema, req.body);
                const { schoolId } = req.params;
                if (!schoolId) {
                    throw new exception_1.InvariantError('School Id is required in Parameter');
                }
                const payload = req.body;
                const { healthService } = yield this.schoolService.createOrUpdateHealthServices(+schoolId, payload);
                res.status(201).json({
                    status: 'Success',
                    message: `Health Service for School ${schoolId} is Created or Updated`,
                    data: healthService
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    createOrUpdateSchoolEnvironment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(SchoolEnvironmentValidator_1.schoolEnvironmentSchema, req.body);
                const { schoolId } = req.params;
                if (!schoolId) {
                    throw new exception_1.InvariantError('School Id is required in Parameter');
                }
                const payload = req.body;
                const { schoolEnvironment } = yield this.schoolService.createOrUpdateSchoolEnvironment(+schoolId, payload);
                res.status(201).json({
                    status: 'Success',
                    message: `School Environment for School ${schoolId} is Created or Updated`,
                    data: schoolEnvironment
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    createOrUpdateHealthCare(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(HealhCareValidator_1.CreateHealthCareSchema, req.body);
                const { schoolId } = req.params;
                if (!schoolId) {
                    throw new exception_1.InvariantError('School Id is required in Parameter');
                }
                const user = req.user;
                const payload = req.body;
                const { healthCare } = yield this.schoolService.createOrUpdateHealthCare(+schoolId, payload, user.email);
                res.status(201).json({
                    status: 'Success',
                    message: `Health Care for School ${schoolId} is Created or Updated`,
                    data: healthCare
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    addHealthCareMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(HealhCareValidator_1.addHealthCareMemberSchema, req.body);
                const { healthCareId } = req.params;
                if (!healthCareId) {
                    throw new exception_1.InvariantError('School Id and Health Care Id is required in Parameter');
                }
                const { name, positionId, userId } = req.body;
                const { healthCareMember } = yield this.schoolService.addHealthCareMember({ healthCareId: +healthCareId, name, positionId, userId });
                res.status(201).json({
                    status: 'Success',
                    message: 'Health Care Member is added',
                    data: healthCareMember
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    createFacility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(SchoolValidator_1.createFacilitySchema, req.body);
                const { schoolId } = req.params;
                const payload = req.body;
                const { facility } = yield this.schoolService.createFacility(+schoolId, payload, +payload.facilityTypeId);
                res.status(201).json({
                    status: 'Success',
                    message: 'Facility is created',
                    data: facility
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getFacilityOwnedBySchool(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { schoolId } = req.params;
                if (!schoolId) {
                    throw new exception_1.InvariantError('School Id is required in Parameter');
                }
                ;
                const { facilities } = yield this.schoolService.getFacilityBySchoolId(+schoolId);
                res.status(200).json({
                    status: 'Success',
                    message: 'Facilities owned by School',
                    data: facilities
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getFacilityById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { facilityId, schoolId } = req.params;
                if (!facilityId || !schoolId) {
                    throw new exception_1.InvariantError('Facility Id is required in Parameter');
                }
                const { facility } = yield this.schoolService.getFacilityById(+facilityId, +schoolId);
                res.status(200).json({
                    status: 'Success',
                    message: 'Facility Data',
                    data: facility
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    deleteFacility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { facilityId, schoolId } = req.params;
                if (!facilityId) {
                    throw new exception_1.InvariantError('Facility Id is required in Parameter');
                }
                const { facility } = yield this.schoolService.deleteFacility(+facilityId, +schoolId);
                res.status(200).json({
                    status: 'Success',
                    message: 'Facility is deleted',
                    data: facility
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    updateFacility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(SchoolValidator_1.createFacilitySchema, req.body);
                const { schoolId, facilityId } = req.params;
                if (!schoolId || !facilityId) {
                    throw new exception_1.InvariantError('School Id and Facility Id is required in Parameter');
                }
                const payload = req.body;
                const { facility } = yield this.schoolService.updateFacility(+facilityId, payload, +schoolId);
                res.status(200).json({
                    status: 'Success',
                    message: 'Facility is updated',
                    data: facility
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getHealthCareBySchoolId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { schoolId } = req.params;
                if (!schoolId) {
                    throw new exception_1.InvariantError('School Id is required in Parameter');
                }
                const { healthCare } = yield this.schoolService.getHealthCareBySchoolId(+schoolId);
                res.status(200).json({
                    status: 'Success',
                    message: 'Health Care Data',
                    data: healthCare
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getHealthServiceBySchoolId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { schoolId } = req.params;
                if (!schoolId) {
                    throw new exception_1.InvariantError('School Id is required in Parameter');
                }
                const { healthService } = yield this.schoolService.getHealthService(+schoolId);
                res.status(200).json({
                    status: 'Success',
                    message: 'Health Service Data',
                    data: healthService
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    schoolEnvironment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { schoolId } = req.params;
                if (!schoolId) {
                    throw new exception_1.InvariantError('School Id is required in Parameter');
                }
                const { schoolEnvironment } = yield this.schoolService.getSchoolEnvironment(+schoolId);
                res.status(200).json({
                    status: 'Success',
                    message: 'School Environment Data',
                    data: schoolEnvironment
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getUKSManagementQuisioner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { schoolId } = req.params;
                if (!schoolId) {
                    throw new exception_1.InvariantError('School Id is required in Parameter');
                }
                const { uksQuisioner } = yield this.schoolService.getUKSQuisioner(+schoolId);
                res.status(200).json({
                    status: 'Success',
                    message: 'UKS Management Data',
                    data: uksQuisioner
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getAllSchoolStratification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { schoolId } = req.params;
                if (!schoolId) {
                    throw new exception_1.InvariantError('School Id is required in Parameter');
                }
                const { schoolStratification } = yield this.schoolService.getSchoolStratifications(+schoolId);
                res.status(200).json({
                    status: 'Success',
                    message: 'School Stratification Data',
                    data: schoolStratification
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
}
exports.SchoolController = SchoolController;
;

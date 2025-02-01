"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schoolRouter = void 0;
const express_1 = __importDefault(require("express"));
const AuthorizationMiddleware_1 = require("../middlewares/AuthorizationMiddleware");
const services_1 = require("../services");
const prisma_1 = require("../../config/prisma");
const SchoolController_1 = require("../controllers/SchoolController");
const services_2 = require("../services");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const services_3 = require("../services");
const emailService = new services_3.EmailService();
const authService = new services_2.AuthService(prisma_1.prismaDBClient, bcrypt_1.default, jsonwebtoken_1.default, emailService);
const schoolService = new services_1.SchoolService(prisma_1.prismaDBClient, authService);
const schoolController = new SchoolController_1.SchoolController(schoolService);
exports.schoolRouter = express_1.default.Router();
// Health Education
exports.schoolRouter.put('/:schoolId/health-education', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['school', 'admin']), (req, res) => {
    schoolController.createOrUpdateHealthEducation(req, res);
});
// Health Service
exports.schoolRouter.put('/:schoolId/health-service', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['school', 'admin']), (req, res) => {
    schoolController.createOrUpdateHealthService(req, res);
});
// School Environment
exports.schoolRouter.put('/:schoolId/school-environment', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['school', 'admin']), (req, res) => {
    schoolController.createOrUpdateSchoolEnvironment(req, res);
});
// Health Care (UKS)
exports.schoolRouter.put('/:schoolId/health-care', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['school', 'admin']), (req, res) => {
    schoolController.createOrUpdateHealthCare(req, res);
});
exports.schoolRouter.post('/:schoolId/health-care/:healthCareId/member', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school']), (req, res) => {
    schoolController.addHealthCareMember(req, res);
});
exports.schoolRouter.get('/:schoolId/stratifications', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['school', 'admin', 'uks', 'healthcare']), (req, res) => {
    schoolController.getAllSchoolStratification(req, res);
});
// Facility
exports.schoolRouter.post('/:schoolId/facilities', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['school', 'admin', 'uks']), (req, res) => {
    schoolController.createFacility(req, res);
});
exports.schoolRouter.get('/:schoolId/facilities', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)([]), (req, res) => {
    schoolController.getFacilityOwnedBySchool(req, res);
});
exports.schoolRouter.get('/:schoolId/facilities/:facilityId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)([]), (req, res) => {
    schoolController.getFacilityById(req, res);
});
exports.schoolRouter.delete('/:schoolId/facilities/:facilityId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['school', 'admin', 'uks']), (req, res) => {
    schoolController.deleteFacility(req, res);
});
exports.schoolRouter.put('/:schoolId/facilities/:facilityId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['school', 'admin', 'uks']), (req, res) => {
    schoolController.updateFacility(req, res);
});

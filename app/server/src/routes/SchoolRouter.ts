import express from 'express';
import { AuthorizationMiddleware } from '../middlewares/AuthorizationMiddleware';
import { SchoolService } from '../services';
import { prismaDBClient } from '../../config/prisma';
import { SchoolController } from '../controllers/SchoolController';
import { AuthService } from '../services';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { EmailService } from '../services';

const emailService = new EmailService();
const authService = new AuthService(prismaDBClient, bcrypt, jwt, emailService);
const schoolService = new SchoolService(prismaDBClient, authService);


const schoolController = new SchoolController(schoolService);

export const schoolRouter = express.Router();


// Health Education

schoolRouter.put('/:schoolId/health-education', AuthorizationMiddleware(['school', 'admin']), (req, res) => {
    schoolController.createOrUpdateHealthEducation(req, res);
});


// Health Service
schoolRouter.put('/:schoolId/health-service', AuthorizationMiddleware(['school', 'admin']), (req, res) => {
    schoolController.createOrUpdateHealthService(req, res);
})

// School Environment
schoolRouter.put('/:schoolId/school-environment', AuthorizationMiddleware(['school', 'admin']), (req, res) => {
    schoolController.createOrUpdateSchoolEnvironment(req, res);
})

// UKS MANAGEMENT QUISIONER
schoolRouter.put('/:schoolId/uks-quisioner', AuthorizationMiddleware(['school', 'admin']), (req, res) => {
    schoolController.createOrUpdateUKSManagementQuisioner(req, res);
})

// Health Care (UKS)
schoolRouter.put('/:schoolId/health-care', AuthorizationMiddleware(['school', 'admin']), (req, res) => {
    schoolController.createOrUpdateHealthCare(req, res);
})

schoolRouter.post('/:schoolId/health-care/:healthCareId/member', AuthorizationMiddleware(['admin', 'school']), (req, res) => {
    schoolController.addHealthCareMember(req, res);
})

schoolRouter.get('/:schoolId/stratifications', AuthorizationMiddleware(['school', 'admin', 'uks', 'healthcare']), (req, res) => {
    schoolController.getAllSchoolStratification(req, res);
})

// Facility
schoolRouter.post('/:schoolId/facilities', AuthorizationMiddleware(['school', 'admin', 'uks']), (req, res) => {
    schoolController.createFacility(req, res);
});

schoolRouter.get('/:schoolId/facilities', AuthorizationMiddleware([]), (req, res) => {
    schoolController.getFacilityOwnedBySchool(req, res);
})

schoolRouter.get('/:schoolId/facilities/:facilityId', AuthorizationMiddleware([]), (req, res) => {
    schoolController.getFacilityById(req, res);
});

schoolRouter.delete('/:schoolId/facilities/:facilityId', AuthorizationMiddleware(['school', 'admin', 'uks']), (req, res) => {
    schoolController.deleteFacility(req, res);
})

schoolRouter.put('/:schoolId/facilities/:facilityId', AuthorizationMiddleware(['school', 'admin', 'uks']), (req, res) => {
    schoolController.updateFacility(req, res);
})
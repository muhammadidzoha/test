import express from 'express';
import { AuthorizationMiddleware } from '../middlewares/AuthorizationMiddleware';
import { SchoolService } from '../services';
import { prismaDBClient } from '../../config/prisma';
import { SchoolController } from '../controllers/SchoolController';

const schoolService = new SchoolService(prismaDBClient);

const schoolController = new SchoolController(schoolService);

export const schoolRouter = express.Router();

schoolRouter.put('/:schoolId/health-education', AuthorizationMiddleware(['school', 'admin']), (req, res) => {
    schoolController.createOrUpdateHealthEducation(req, res);
});

schoolRouter.put('/:schoolId/health-service', AuthorizationMiddleware(['school', 'admin']), (req, res) => {
    schoolController.createOrUpdateHealthService(req, res);
})

schoolRouter.put('/:schoolId/school-environment', AuthorizationMiddleware(['school', 'admin']), (req, res) => {
    schoolController.createOrUpdateSchoolEnvironment(req, res);
})

schoolRouter.put('/:schoolId/health-care', AuthorizationMiddleware(['school', 'admin']), (req, res) => {
    schoolController.createOrUpdateHealthCare(req, res);
})

schoolRouter.post('/:schoolId/health-care/:healthCareId/member', AuthorizationMiddleware(['admin', 'school']), (req, res) => {
    schoolController.addHealthCareMember(req, res);
})
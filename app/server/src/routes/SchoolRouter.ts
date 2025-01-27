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
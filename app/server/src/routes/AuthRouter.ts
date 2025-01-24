
import express from 'express';

import { AuthService, EmailService } from '../services';
import { AuthController } from "../controllers/AuthController";
import { prismaDBClient } from "../../config/prisma";

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Middlewares
import { multerMiddleware } from '../middlewares/MulterMiddleware';
import { AuthorizationMiddleware } from '../middlewares/AuthorizationMiddleware';


const emailService = new EmailService();
const authService = new AuthService(prismaDBClient, bcrypt, jwt, emailService);

const authController = new AuthController(authService);

export const authRouter = express.Router();

authRouter.post('/register/parent', async (req, res) => {
    await authController.registerForParent(req, res);
});

authRouter.post('/login', async (req, res) => {
    await authController.login(req, res);
});

authRouter.post('/register/institution', multerMiddleware.single('image'), async (req, res) => {
    await authController.registerForInstitution(req, res);
})

authRouter.post('/email', AuthorizationMiddleware(['admin']), async (req, res) => {
    await authController.sendEmailVerification(req, res);
});

authRouter.get('/email/verify', async (req, res) => {
    await authController.verifyEmail(req, res);
})

authRouter.post('/email/register', AuthorizationMiddleware(['admin', 'school']), async (req, res) => {
    await authController.sendEmailCompleteRegistration(req, res);
})
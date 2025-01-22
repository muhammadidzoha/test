
import express from 'express';

import { AuthService, EmailService } from '../services';
import { AuthController } from "../controllers/AuthController";
import { prismaDBClient } from "../../config/prisma";

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Middlewares
import { multerMiddleware } from '../middlewares/MulterMiddleware';


const authService = new AuthService(prismaDBClient, bcrypt, jwt);
const emailService = new EmailService();

const authController = new AuthController(authService, emailService);

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

authRouter.post('/', multerMiddleware.single('image'), (req, res) => {
    console.log(req.file);
    res.send('ok');
})

authRouter.post('/email', async (req, res) => {
    await authController.sendEmailVerification(req, res);
});
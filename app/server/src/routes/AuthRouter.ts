
import express from 'express';

import { AuthService } from "../services/AuthService";
import { AuthController } from "../controllers/AuthController";
import { prismaDBClient } from "../../config/prisma";

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { multerMiddleware } from '../middlewares/MulterMiddleware';
import { payloadCheckMiddleware } from '../middlewares/PayloadCheckMiddleware';
import { institutionRegisterPayloadSchema } from '../common/http/requestvalidator/RegisterValidator';

const authService = new AuthService(prismaDBClient, bcrypt, jwt);

const authController = new AuthController(authService);

export const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
    await authController.register(req, res);
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
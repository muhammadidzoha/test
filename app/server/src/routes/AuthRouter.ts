
import express from 'express';

import { AuthService } from "../services/AuthService";
import { AuthController } from "../controllers/AuthController";
import { prismaDBClient } from "../../config/prisma";

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authService = new AuthService(prismaDBClient, bcrypt, jwt);

const authController = new AuthController(authService);

export const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
    await authController.register(req, res);
});

authRouter.post('/login', async (req, res) => {
    await authController.login(req, res);
});
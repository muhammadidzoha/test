import jwt from 'jsonwebtoken';
import fs from 'fs';

import { Request, Response } from "express";
import { handleError, validatePayload, registerPayloadSchema, verifyEmailSchema } from "../common/http";
import { IInstitution, RegisterPayloadType } from "../types/auth";
import { InvariantError, PayloadError } from "../common/exception";
import { EmailService, AuthService } from "../services";
import { INodemailerMessage } from '../types/email';
import { generateFutureDate } from '../common/utils';

export class AuthController {
    constructor(public authService: AuthService, public emailService: EmailService) {
    }

    async register(req: Request, res: Response) {
        try {
            validatePayload(registerPayloadSchema, req.body);
            const { username, password, email, role } = req.body;
            const { newUser } = await this.authService.register({ username, email, password, roleId: role, isVerified: false });

            res.status(201).json({
                status: 'Success',
                message: 'User Registered Successfully',
                data: newUser
            })
        } catch (error: any) {
            handleError(error, res);
        }
    }

    async registerForParent(req: Request, res: Response) {
        try {
            validatePayload(registerPayloadSchema, req.body);
            const { username, password, email } = req.body;
            console.log({ username, password, email });
            const { newUser } = await this.authService.register({ username, email, password, roleId: 4, isVerified: true });

            res.status(201).json({
                status: 'Success',
                message: 'User Registered Successfully',
                data: newUser
            })
        } catch (error: any) {
            handleError(error, res);
        }
    }



    async registerForInstitution(req: Request, res: Response) {
        try {
            if (!req.file) {
                throw new PayloadError('License Document is Required (upload legal document to prove legal institute)');
            }
            if (+req.body.roleId !== 2 && +req.body.roleId !== 3) {
                throw new InvariantError('Role must be 2 (School) or 3 (Healthcare)');
            }

            const { username, email, password, roleId, address, headNIP, headName, name, phoneNumber, institutionId }: Omit<IInstitution, 'licenseDocument'> & Omit<RegisterPayloadType, 'is_verified'> & {
                institutionId: string
            } = req.body;
            const licenseDocument = req.file.filename;

            const { userInstitution } = await this.authService.registerForInstitution({ username, email, password, roleId: +roleId, address, headNIP, headName, licenseDocument, name, phoneNumber });


            res.status(201).json({
                status: 'Success',
                message: 'User Registered Successfully',
                data: userInstitution
            })
        } catch (error: any) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            };
            handleError(error, res);
        }
    }

    async login(req: Request, res: Response) {
        const { uniqueIdentity, password } = req.body;

        try {
            const { accessToken } = await this.authService.login(uniqueIdentity, password);
            res.status(200).json({
                status: 'Success',
                message: 'User Logged In Successfully',
                data: {
                    accessToken
                }
            })
        } catch (error: any) {
            handleError(error, res);
        }

    }

    async sendEmailVerification(req: Request, res: Response) {
        try {
            validatePayload(verifyEmailSchema, req.body);
            const { email } = req.body;
            const { user } = await this.authService.getUserByUniqueIdentity(email);
            const generatedToken = jwt.sign({
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role_id
            }, process.env.SECRET_ACCESS_TOKEN ?? 'SECRET_TOKEN_RAHASIA', {
                expiresIn: '7h'
            });

            const generatedDate = generateFutureDate(7);

            const payload: INodemailerMessage = {
                from: process.env.SMTP_EMAIL,
                to: email,
                subject: 'Email Verification',
                html: `
                <h1>Email Verification</h1>
                <p>Click this link before <strong>${generatedDate}</strong> to verify your email: <a href="${process.env.API_BASE_URL}/auth/email/verify?token=${generatedToken}">Verify Email</a></p>
                `
            }

            await this.emailService.sendEmail(payload);

            res.status(200).json({
                status: 'Success',
                message: 'Email Verification Sent Successfully',
            })
        } catch (error: any) {
            handleError(error, res);
        }
    }
}
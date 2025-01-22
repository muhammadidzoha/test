import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { handleError, validatePayload, registerPayloadSchema } from "../common/http";
import { IInstitution, RegisterPayloadType } from "../types/auth";
import { InvariantError } from "../common/exception";
import { PayloadError } from "../common/exception/PayloadError";
import fs from 'fs';

export class AuthController {
    constructor(public authService: AuthService) {
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

    async login(req: Request, res: Response) {
        const { username, password } = req.body;

        try {
            const { accessToken } = await this.authService.login(username, password);
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
}
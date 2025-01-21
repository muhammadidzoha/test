import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { handleError, validatePayload, registerPayloadSchema } from "../common/http";

export class AuthController {
    constructor(public authService: AuthService) {
    }

    async register(req: Request, res: Response) {
        try {
            validatePayload(registerPayloadSchema, req.body);
            const { username, password, email, role } = req.body;
            console.log({ username, password, email, role });
            const { newUser } = await this.authService.register({ username, email, password, roleId: role ?? 4, isVerified: false });

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
}
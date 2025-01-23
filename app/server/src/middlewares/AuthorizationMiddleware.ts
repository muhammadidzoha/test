import { NextFunction, Request, Response } from "express";
import { AuthenticationError, AuthorizationError } from "../common/exception";
import jwt, { decode } from 'jsonwebtoken';
import { IPayloadToken, Role } from "../types/auth";

export const AuthorizationMiddleware = (role: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { authorization } = req.headers;
        if (!authorization) {
            res.status(401).json({
                status: 'Fail',
                message: 'Authentication needed'
            });
            return;
        }
        const [, token] = authorization ? authorization.split(' ') : [, ''];
        if (!token || !authorization) {
            res.status(401).json({
                status: 'Fail',
                message: 'Authentication needed'
            });
            return;
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN! ?? 'secrettokenrahasia') as IPayloadToken;
        if (!role.includes(decodedToken.role)) {
            res.status(403).json({
                status: 'Fail',
                message: 'You are not authorized to access this resource'
            })
            return;
        }
        (req as any).user = decodedToken;
        next();
    }
}
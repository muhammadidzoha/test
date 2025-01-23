import { NextFunction, Request, Response } from "express";
import { AuthenticationError, AuthorizationError } from "../common/exception";
import jwt, { decode } from 'jsonwebtoken';
import { IPayloadToken, Role } from "../types/auth";
import { handleError } from "../common/http";

export const AuthorizationMiddleware = (role: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
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
            if (!role.length) {
                (req as any).user = decodedToken;
                next();
            }
            if (!role.includes(decodedToken.role)) {
                res.status(403).json({
                    status: 'Fail',
                    message: `Only ${role} can access this resource`
                })
                return;
            }
            (req as any).user = decodedToken;
            next();
        } catch (err) {
            handleError(err, res);
        }

    }
}
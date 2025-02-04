"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_1 = require("../common/http");
const AuthorizationMiddleware = (role) => {
    return (req, res, next) => {
        var _a;
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
            const decodedToken = jsonwebtoken_1.default.verify(token, (_a = process.env.SECRET_ACCESS_TOKEN) !== null && _a !== void 0 ? _a : 'secrettokenrahasia');
            if (!role.length) {
                req.user = decodedToken;
                next();
                return;
            }
            if (!role.includes(decodedToken.role)) {
                res.status(403).json({
                    status: 'Fail',
                    message: `Only ${role} can access this resource`
                });
                return;
            }
            req.user = decodedToken;
            next();
        }
        catch (err) {
            (0, http_1.handleError)(err, res);
        }
    };
};
exports.AuthorizationMiddleware = AuthorizationMiddleware;

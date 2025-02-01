"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const AuthController_1 = require("../controllers/AuthController");
const prisma_1 = require("../../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middlewares
const MulterMiddleware_1 = require("../middlewares/MulterMiddleware");
const AuthorizationMiddleware_1 = require("../middlewares/AuthorizationMiddleware");
const emailService = new services_1.EmailService();
const authService = new services_1.AuthService(prisma_1.prismaDBClient, bcrypt_1.default, jsonwebtoken_1.default, emailService);
const authController = new AuthController_1.AuthController(authService);
exports.authRouter = express_1.default.Router();
exports.authRouter.post('/register/parent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield authController.registerForParent(req, res);
}));
exports.authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield authController.login(req, res);
}));
exports.authRouter.post('/register/institution', MulterMiddleware_1.multerMiddleware.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield authController.registerForInstitution(req, res);
}));
exports.authRouter.post('/email', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield authController.sendEmailVerification(req, res);
}));
exports.authRouter.get('/email/verify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield authController.verifyEmail(req, res);
}));
exports.authRouter.post('/register/schools/:schoolId/health-care/:healthCareId/email', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school', 'uks']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield authController.sendEmailCompleteRegistration(req, res);
}));
exports.authRouter.post('/register/schools/:schoolId/health-care/:healthCareId/member', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school', 'uks']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield authController.verifyEmailCompleteRegistration(req, res);
}));

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
exports.AuthController = void 0;
const fs_1 = __importDefault(require("fs"));
const exception_1 = require("../common/exception");
const http_1 = require("../common/http");
const CompleteRegistrationValidator_1 = require("../common/http/requestvalidator/CompleteRegistrationValidator");
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(http_1.registerPayloadSchema, req.body);
                const { username, password, email, role } = req.body;
                const { newUser } = yield this.authService.register({ username, email, password, roleId: role, isVerified: false });
                res.status(201).json({
                    status: 'Success',
                    message: 'User Registered Successfully',
                    data: newUser
                });
            }
            catch (error) {
                (0, http_1.handleError)(error, res);
            }
        });
    }
    registerForParent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(http_1.registerPayloadSchema, req.body);
                const { username, password, email } = req.body;
                const { newUser } = yield this.authService.register({ username, email, password, roleId: 4, isVerified: true });
                res.status(201).json({
                    status: 'Success',
                    message: 'User Registered Successfully',
                    data: newUser
                });
            }
            catch (error) {
                (0, http_1.handleError)(error, res);
            }
        });
    }
    registerForInstitution(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    throw new exception_1.PayloadError('License Document is Required (upload legal document to prove legal institute)');
                }
                if (+req.body.roleId !== 2 && +req.body.roleId !== 3) {
                    throw new exception_1.InvariantError('Role must be 2 (School) or 3 (Healthcare)');
                }
                const { username, email, password, roleId, address, headNIP, headName, name, phoneNumber, institutionId } = req.body;
                const licenseDocument = req.file.filename;
                const { userInstitution } = yield this.authService.registerForInstitution({ username, email, password, roleId: +roleId, address, headNIP, headName, licenseDocument, name, phoneNumber });
                res.status(201).json({
                    status: 'Success',
                    message: 'User Registered Successfully',
                    data: userInstitution
                });
            }
            catch (error) {
                if (req.file) {
                    fs_1.default.unlinkSync(req.file.path);
                }
                ;
                (0, http_1.handleError)(error, res);
            }
        });
    }
    sendEmailCompleteRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(CompleteRegistrationValidator_1.CompleteRegistrationSchema, req.body);
                const { schoolId, healthCareId } = req.params;
                const { email, fullName, positionId } = req.body;
                const { email: senderEmail } = req.user;
                yield this.authService.sendEmailRegistration({ schoolId: +schoolId, healthCareId: +healthCareId, email, name: fullName, senderEmail, positionId });
                res.status(200).json({
                    status: 'Success',
                    message: 'Email for Registration Sent Successfully',
                });
            }
            catch (error) {
                (0, http_1.handleError)(error, res);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { uniqueIdentity, password } = req.body;
                const { accessToken } = yield this.authService.login(uniqueIdentity, password);
                res.status(200).json({
                    status: 'Success',
                    message: 'User Logged In Successfully',
                    data: {
                        accessToken
                    }
                });
            }
            catch (error) {
                (0, http_1.handleError)(error, res);
            }
        });
    }
    sendEmailVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(http_1.verifyEmailSchema, req.body);
                const { email } = req.body;
                const { user } = yield this.authService.sendEmailVerification(email);
                if (!user) {
                    return res.status(200).json({
                        status: 'Not Changed',
                        message: 'User Already Verified'
                    });
                }
                res.status(200).json({
                    status: 'Success',
                    message: 'Email Verification Sent Successfully',
                });
            }
            catch (error) {
                (0, http_1.handleError)(error, res);
            }
        });
    }
    verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.query;
                if (typeof token !== 'string') {
                    throw new exception_1.PayloadError('Token is required');
                }
                const { user, message } = yield this.authService.verifyEmail(token);
                if (!user) {
                    return res.status(200).json({
                        status: 'Not Changed',
                        message: 'User Already Verified'
                    });
                }
                res.status(200).json({
                    status: 'Success',
                    message,
                    data: user
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    verifyEmailCompleteRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.query;
                if (!token) {
                    throw new exception_1.PayloadError('Token is required');
                }
                const payload = req.body;
                if (!payload.username || !payload.password) {
                    throw new exception_1.PayloadError('Username and Password is required');
                }
                const { healthCareMember } = yield this.authService.verifyHealthcareMemberRegistrationEmail(token, payload);
                res.status(200).json({
                    status: 'Success',
                    message: `User Registered Successfully as Health Care Member`,
                    data: healthCareMember
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
}
exports.AuthController = AuthController;

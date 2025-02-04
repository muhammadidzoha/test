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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const exception_1 = require("../common/exception");
const AuthenticationError_1 = require("../common/exception/AuthenticationError");
const utils_1 = require("../common/utils");
class AuthService {
    constructor(prismaClient, bcrypt, jwt, emailService) {
        this.prismaClient = prismaClient;
        this.bcrypt = bcrypt;
        this.jwt = jwt;
        this.emailService = emailService;
    }
    register(_a) {
        return __awaiter(this, arguments, void 0, function* ({ username, email, password, roleId = 4, isVerified = false }) {
            const isUserExistsOnDatabase = yield this.isUserExistsOnDatabase(username, email);
            if (isUserExistsOnDatabase) {
                throw new exception_1.InvariantError('User already exists');
            }
            const newPassword = yield this.bcrypt.hash(password, 10);
            const newUser = yield this.prismaClient.user.create({
                data: {
                    username,
                    email,
                    password: newPassword,
                    role_id: roleId,
                    is_verified: roleId === 4 ? true : isVerified
                },
            });
            return {
                newUser: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    password: newUser.password,
                    roleId: newUser.role_id,
                    isVerified: newUser.is_verified
                }
            };
        });
    }
    registerForInstitution(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserExistsOnDatabase = yield this.isUserExistsOnDatabase(payload.username, payload.email);
            if (isUserExistsOnDatabase) {
                throw new exception_1.InvariantError('User already exists');
            }
            const newPassword = yield this.bcrypt.hash(payload.password, 10);
            const userInstitution = yield this.prismaClient.user.create({
                data: {
                    username: payload.username,
                    email: payload.email,
                    password: newPassword,
                    role_id: payload.roleId,
                    is_verified: false,
                    institution: {
                        create: {
                            name: payload.name,
                            address: payload.address,
                            phone_number: payload.phoneNumber,
                            email: payload.email,
                            head_name: payload.headName,
                            head_nip: payload.headNIP,
                            license_document: payload.licenseDocument,
                            institution_type: {
                                connect: {
                                    id: payload.roleId === 2 ? 1 : 2
                                }
                            }
                        }
                    }
                },
                include: {
                    institution: {
                        select: {
                            id: true,
                            name: true,
                            address: true,
                            phone_number: true,
                            email: true,
                            head_name: true,
                            head_nip: true,
                            license_document: true,
                            institution_type: {
                                select: {
                                    name: true,
                                    id: true
                                }
                            }
                        }
                    }
                }
            });
            return {
                userInstitution
            };
        });
    }
    sendEmailVerification(email) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { user } = yield this.getUserByUniqueIdentity(email);
            const generatedToken = this.jwt.sign({
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role_id
            }, (_a = process.env.SECRET_ACCESS_TOKEN) !== null && _a !== void 0 ? _a : 'SECRET_TOKEN_RAHASIA', {
                expiresIn: 3600 * 24 * 7
            });
            if (user.is_verified) {
                return {
                    user: null
                };
            }
            const generatedDate = (0, utils_1.generateFutureDate)(7);
            const payload = {
                from: (_b = process.env.SMTP_EMAIL) !== null && _b !== void 0 ? _b : 'admin@gmail.com',
                to: email,
                subject: 'Email Verification',
                html: `
                        <p>Click this link before <strong>${generatedDate}</strong> to verify your email: <a href="${(_c = process.env.API_BASE_URL) !== null && _c !== void 0 ? _c : 'http://localhost:5000'}/auth/email/verify?token=${generatedToken}">Verify Email</a></p>
                        `
            };
            yield this.emailService.sendEmail(payload);
            return { user };
        });
    }
    sendEmailRegistration(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield this.getUserByKey("email", payload.email);
            if (!!user) {
                throw new AuthenticationError_1.AuthenticationError('User already exists');
            }
            const generatedToken = this.jwt.sign(Object.assign({}, payload), process.env.SECRET_ACCESS_TOKEN, {
                expiresIn: 3600 * 24 * 7
            });
            const generatedDate = (0, utils_1.generateFutureDate)(7);
            yield this.emailService.sendEmail({
                from: payload.senderEmail,
                to: payload.email,
                subject: 'Email Registration',
                html: `
                <p>Click this link to complete your registration before <strong>${generatedDate}</strong> <a href="${process.env.FRONT_END_COMPLETE_REGISTRATION_URL}?token=${generatedToken}">Complete Registration</a></p>
            `
            });
        });
    }
    getUserByKey(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prismaClient.user.findFirst({
                where: {
                    [key]: value
                }
            });
            return { user };
        });
    }
    isUserExistsOnDatabase(username, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userOnDatabase = yield this.prismaClient.user.findFirst({
                where: {
                    OR: [{ username }, { email }]
                }
            });
            return !!userOnDatabase;
        });
    }
    login(uniqueIdentity, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userOnDatabase = yield this.prismaClient.user.findFirst({
                where: {
                    OR: [
                        { username: uniqueIdentity },
                        { email: uniqueIdentity }
                    ]
                }
            });
            if (!userOnDatabase) {
                throw new exception_1.NotFoundError('User not found');
            }
            const isPasswordMatch = yield this.bcrypt.compare(password, userOnDatabase.password);
            if (!isPasswordMatch) {
                throw new AuthenticationError_1.AuthenticationError('Password is incorrect');
            }
            if (!userOnDatabase.is_verified) {
                throw new AuthenticationError_1.AuthenticationError('User not verified');
            }
            const userRole = yield this.prismaClient.role.findUnique({
                where: {
                    id: userOnDatabase.role_id
                }
            });
            const accessToken = this.jwt.sign({
                id: userOnDatabase.id,
                username: userOnDatabase.username,
                email: userOnDatabase.email,
                role: (_a = userRole === null || userRole === void 0 ? void 0 : userRole.name) !== null && _a !== void 0 ? _a : 'parent'
            }, (_b = process.env.SECRET_ACCESS_TOKEN) !== null && _b !== void 0 ? _b : 'accesstokenrahasia', {
                expiresIn: 3600 * 3
            });
            return {
                accessToken
            };
        });
    }
    ;
    getUserByUniqueIdentity(uniqueIdentity) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prismaClient.user.findFirst({
                where: {
                    OR: [
                        { username: uniqueIdentity },
                        { email: uniqueIdentity }
                    ]
                }
            });
            if (!user) {
                throw new exception_1.NotFoundError('User not found');
            }
            return {
                user
            };
        });
    }
    verifyEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const decodedToken = this.jwt.verify(token, (_a = process.env.SECRET_ACCESS_TOKEN) !== null && _a !== void 0 ? _a : 'secretaccesstoken');
            const user = yield this.prismaClient.user.findUnique({
                where: {
                    id: decodedToken.id
                }
            });
            if (!user) {
                throw new exception_1.NotFoundError('User not found');
            }
            if (!user.is_verified) {
                const updatedUser = yield this.prismaClient.user.update({
                    data: {
                        is_verified: true
                    },
                    where: {
                        id: decodedToken.id
                    }
                });
                return { user: updatedUser, message: 'User Verified Successfully' };
            }
            return { user: null, message: 'User already verified' };
        });
    }
    verifyHealthcareMemberRegistrationEmail(token, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const decodedToken = this.jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
            const { newUser } = yield this.register({
                username: payload.username,
                email: decodedToken.email,
                password: payload.password,
                roleId: 5,
                isVerified: true
            });
            const newHealthCaremember = yield this.prismaClient.healthCareMember.create({
                data: {
                    user: {
                        connect: {
                            id: newUser.id
                        }
                    },
                    health_care: {
                        connect: {
                            id: decodedToken.healthCareId
                        }
                    },
                    name: decodedToken.name,
                    position: {
                        connect: {
                            id: (_a = decodedToken.positionId) !== null && _a !== void 0 ? _a : 2
                        }
                    }
                }
            });
            return {
                healthCareMember: newHealthCaremember
            };
        });
    }
}
exports.AuthService = AuthService;

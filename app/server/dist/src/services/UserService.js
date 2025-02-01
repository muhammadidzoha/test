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
exports.UserService = void 0;
const exception_1 = require("../common/exception");
class UserService {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    checkUserExists(uniqueIdentity) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserByUniqueIdentity(uniqueIdentity);
            return !!user;
        });
    }
    getUserByUniqueIdentity(uniqueIdentity, includeParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prismaClient.user.findFirst(Object.assign({ where: {
                    OR: [
                        {
                            email: uniqueIdentity
                        },
                        {
                            username: uniqueIdentity
                        }
                    ]
                } }, (Object.keys(includeParams).length && {
                include: includeParams
            })));
            return { user };
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (username.includes('admin')) {
                throw new exception_1.AuthorizationError('You are not authorized to view this resource');
            }
            const user = yield this.prismaClient.user.findUnique({
                where: {
                    username
                }
            });
            if (!user) {
                throw new exception_1.NotFoundError('User not found');
            }
            return { user };
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (email.includes('admin')) {
                throw new exception_1.AuthorizationError('You are not authorized to view this resource');
            }
            ;
            const user = yield this.prismaClient.user.findUnique({
                where: {
                    email
                }
            });
            if (!user) {
                throw new exception_1.NotFoundError('User not found');
            }
            return { user };
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.prismaClient.user.findMany();
            return { users };
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id === 1) {
                throw new exception_1.AuthorizationError('You are not authorized to view this resource');
            }
            const user = yield this.prismaClient.user.findUnique({
                where: {
                    id
                }
            });
            return { user };
        });
    }
    getUserWithRelation(uniqueValue, includeParams) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof uniqueValue === 'string') {
                const user = yield this.prismaClient.user.findFirst(Object.assign({ where: {
                        OR: [
                            {
                                email: uniqueValue
                            },
                            {
                                username: uniqueValue
                            }
                        ]
                    } }, (!!includeParams && {
                    include: includeParams
                })));
                return { user };
            }
            const user = yield this.prismaClient.user.findUnique(Object.assign({ where: {
                    id: +uniqueValue
                } }, (includeParams && {
                include: includeParams
            })));
            return { user };
        });
    }
}
exports.UserService = UserService;
;

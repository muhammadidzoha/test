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
exports.UserController = void 0;
const http_1 = require("../common/http");
const exception_1 = require("../common/exception");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getUserByUniqueIdentity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { uniqueIdentity } = req.params;
                if (!uniqueIdentity) {
                    throw new exception_1.InvariantError('Unique identity is required to get user');
                }
                const { user } = yield this.userService.getUserByUniqueIdentity(uniqueIdentity);
                if (!user) {
                    throw new exception_1.NotFoundError('User not Found');
                }
                res.status(200).json({
                    status: 'Success',
                    message: 'User retrieved',
                    data: user
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getUserByUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params;
                if (!username) {
                    throw new exception_1.InvariantError('Username is required to get user');
                }
                const { user } = yield this.userService.getUserByUsername(username);
                res.status(200).json({
                    status: 'Success',
                    message: `User ${username} retrieved`,
                    data: user
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getUserByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                if (!email) {
                    throw new exception_1.InvariantError('Email is required to get user');
                }
                const { user } = yield this.userService.getUserByEmail(email);
                res.status(200).json({
                    status: 'Success',
                    message: `User ${email} retrieved`,
                    data: user
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    throw new exception_1.InvariantError('Id is required to get user');
                }
                ;
                const { user } = yield this.userService.getUserById(+id);
                res.status(200).json({
                    status: 'Success',
                    message: 'User retrieved',
                    data: user
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { users } = yield this.userService.getUsers();
                res.status(200).json({
                    status: 'Success',
                    message: 'Users retrieved',
                    data: users
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getUserWithRelation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const { uniqueValue } = req.params;
                const mappedQuery = Object.keys(query).reduce((acc, key) => {
                    return Object.assign(Object.assign({}, acc), { [key]: !!query[key] });
                }, {});
                console.log({ mappedQuery, query });
                console.log(query['family_member']);
                const { user } = yield this.userService.getUserWithRelation(uniqueValue, mappedQuery);
                res.status(200).json({
                    status: 'Success',
                    message: 'User retrieved',
                    data: user
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
}
exports.UserController = UserController;

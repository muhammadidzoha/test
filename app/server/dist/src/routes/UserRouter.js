"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const AuthorizationMiddleware_1 = require("../middlewares/AuthorizationMiddleware");
const UserService_1 = require("../services/UserService");
const UserController_1 = require("../controllers/UserController");
const prisma_1 = require("../../config/prisma");
const userService = new UserService_1.UserService(prisma_1.prismaDBClient);
const userController = new UserController_1.UserController(userService);
exports.userRouter = express_1.default.Router();
exports.userRouter.get('/email/:email', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school']), (req, res) => {
    userController.getUserByEmail(req, res);
});
exports.userRouter.get('/username/:username', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school']), (req, res) => {
    userController.getUserByUsername(req, res);
});
exports.userRouter.get('/:id', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school']), (req, res) => {
    userController.getUserById(req, res);
});
exports.userRouter.get('/', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school']), (req, res) => {
    userController.getUsers(req, res);
});
exports.userRouter.get('/with-relation/:uniqueValue', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school']), (req, res) => {
    userController.getUserWithRelation(req, res);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.familyRouter = void 0;
const express_1 = __importDefault(require("express"));
const AuthorizationMiddleware_1 = require("../middlewares/AuthorizationMiddleware");
const FamilyService_1 = require("../services/FamilyService");
const prisma_1 = require("../../config/prisma");
const FamilyController_1 = require("../controllers/FamilyController");
const familyService = new FamilyService_1.FamilyService(prisma_1.prismaDBClient);
const familyController = new FamilyController_1.FamilyController(familyService);
exports.familyRouter = express_1.default.Router();
exports.familyRouter.put('/:familyId?', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'parent']), (req, res) => {
    familyController.createOrUpdateFamily(req, res);
});
exports.familyRouter.post('/:familyId/members', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'parent']), (req, res) => {
    familyController.addFamilyMember(req, res);
});

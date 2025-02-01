"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberRouter = void 0;
const express_1 = __importDefault(require("express"));
const AuthorizationMiddleware_1 = require("../middlewares/AuthorizationMiddleware");
const NutritionController_1 = require("../controllers/NutritionController");
const NutritionService_1 = require("../services/NutritionService");
const prisma_1 = require("../../config/prisma");
const nutritionService = new NutritionService_1.NutritionService(prisma_1.prismaDBClient);
const nutritionController = new NutritionController_1.NutritionController(nutritionService);
exports.memberRouter = express_1.default.Router();
exports.memberRouter.post('/:familyMemberId/nutrition', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school', 'uks', 'parent']), (req, res) => {
    nutritionController.addNutrition(req, res);
});
exports.memberRouter.put('/:familyMemberId/nutrition/:nutritionId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school', 'uks', 'parent']), (req, res) => {
    nutritionController.updateNutrition(req, res);
});

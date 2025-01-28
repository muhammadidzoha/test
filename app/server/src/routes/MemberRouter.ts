import express from 'express';
import { AuthorizationMiddleware } from '../middlewares/AuthorizationMiddleware';
import { NutritionController } from '../controllers/NutritionController';
import { NutritionService } from '../services/NutritionService';
import { prismaDBClient } from '../../config/prisma';

const nutritionService = new NutritionService(prismaDBClient);
const nutritionController = new NutritionController(nutritionService);

export const memberRouter = express.Router();

memberRouter.post('/:familyMemberId/nutrition', AuthorizationMiddleware(['admin', 'school', 'uks', 'parent']), (req, res) => {
    nutritionController.addNutrition(req, res);
})
import express, { Request, Response } from "express";
import { NutritionService } from "../services/NutritionService";
import { prismaDBClient } from "../../config/prisma";
import { NutritionController } from "../controllers/NutritionController";
import { AuthorizationMiddleware } from "../middlewares/AuthorizationMiddleware";

export const nutritionRouter = express.Router();

const nutritionService = new NutritionService(prismaDBClient);
const nutritionController = new NutritionController(nutritionService);

nutritionRouter.post(
  "/members/:familyMemberId/nutrient",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    nutritionController.addNutrition(req, res);
  }
);

nutritionRouter.put(
  "/members/:familyMemberId/nutrient/:nutritionId",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    nutritionController.updateNutrition(req, res);
  }
);

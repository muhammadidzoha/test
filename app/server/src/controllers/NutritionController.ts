import { Request, Response } from "express";
import { InvariantError } from "../common/exception";
import { NutritionService } from "../services/NutritionService";
import { handleError, validatePayload } from "../common/http";
import { addNutritionSchema } from "../common/http/requestvalidator/NutritionValidator";
import { INutrition } from "../types/family";

export class NutritionController {
  constructor(public nutritionService: NutritionService) {}

  async addNutrition(req: Request, res: Response) {
    try {
      const { familyMemberId } = req.params;
      console.log({ familyMemberId });
      validatePayload(addNutritionSchema, req.body);

      if (!familyMemberId) {
        throw new InvariantError(
          "Family Member Id is required to add nutrition"
        );
      }

      const user = (req as any).user;

      const payload: INutrition = req.body;

      const { nutrition } = await this.nutritionService.createNutrition(
        +familyMemberId,
        { ...payload, createdBy: user.id, updatedBy: user.id }
      );

      res.status(201).json({
        status: "Success",
        message: "Nutrition added",
        data: nutrition,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async updateNutrition(req: Request, res: Response) {
    try {
      validatePayload(addNutritionSchema, req.body);
      const { familyMemberId, nutritionId } = req.params;
      if (!familyMemberId || !nutritionId) {
        throw new InvariantError(
          "Family Member Id and Nutrition Id is required to update nutrition"
        );
      }

      const payload: INutrition = req.body;
      const user = (req as any).user;
      const { nutrition } = await this.nutritionService.updateNutrition(
        +nutritionId,
        +familyMemberId,
        {
          ...payload,
          updatedBy: user.id,
        }
      );

      res.status(200).json({
        status: "Success",
        message: "Nutrition updated",
        data: nutrition,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }
}

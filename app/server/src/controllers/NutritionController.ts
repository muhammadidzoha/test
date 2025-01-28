import { Request, Response } from "express";
import { InvariantError } from "../common/exception";
import { NutritionService } from "../services/NutritionService";
import { handleError, validatePayload } from "../common/http";
import { addNutritionSchema } from "../common/http/requestvalidator/NutritionValidator";
import { INutrition } from "../types/family";

export class NutritionController {
    constructor(public nutritionService: NutritionService) {
    }

    async addNutrition(req: Request, res: Response) {
        try {
            const { familyMemberId } = req.params;
            console.log({ familyMemberId });
            validatePayload(addNutritionSchema, req.body);

            if (!familyMemberId) {
                throw new InvariantError('Family Member Id is required to add nutrition');
            }

            const user = (req as any).user;

            const payload: INutrition = req.body

            const { nutrition } = await this.nutritionService.createNutrition(+familyMemberId, { ...payload, createdBy: user.id });

            res.status(201).json({
                status: 'Success',
                message: 'Nutrition added',
                data: nutrition
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }
};
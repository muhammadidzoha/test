import { PrismaClient } from "@prisma/client";
import { INutrition } from "../types/family";
import { calculateBMI } from "../common/utils/CalculateBMI";

export class NutritionService {
    constructor(public prismaClient: PrismaClient) {

    }

    async createNutrition(familyMemberId: number, nutritionPayload: INutrition) {
        const nutrition = await this.prismaClient.nutrition.create({
            data: {
                height: nutritionPayload.height,
                weight: nutritionPayload.weight,
                family_member_id: familyMemberId,
                ...(nutritionPayload.birth_weight && {
                    birth_weight: nutritionPayload.birth_weight
                }),
                bmi: nutritionPayload.bmi ?? calculateBMI(nutritionPayload.height, nutritionPayload.weight),
                created_by: nutritionPayload.createdBy
            }
        });

        return { nutrition };
    }
};


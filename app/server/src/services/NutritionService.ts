import { PrismaClient } from "@prisma/client";
import { INutrition } from "../types/family";
import { calculateBMI } from "../common/utils/CalculateBMI";
import { NotFoundError } from "../common/exception";

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
                created_by: nutritionPayload.createdBy,
                updated_by: nutritionPayload.updatedBy
            }
        });

        return { nutrition };
    }

    async updateNutrition(nutritionId: number, familyMemberId: number, nutritionPayload: INutrition) {
        const isNutritionExists = await this.getNutritionById(nutritionId);
        if (!isNutritionExists) {
            throw new NotFoundError('Nutrition not found');
        }

        const nutrition = await this.prismaClient.nutrition.update({
            where: {
                id: nutritionId
            },
            data: {
                height: nutritionPayload.height,
                weight: nutritionPayload.weight,
                family_member_id: familyMemberId,
                ...(nutritionPayload.birth_weight && {
                    birth_weight: nutritionPayload.birth_weight
                }),
                bmi: nutritionPayload.bmi ?? calculateBMI(nutritionPayload.height, nutritionPayload.weight),
                updated_by: nutritionPayload.updatedBy
            }
        });

        return {
            nutrition
        }
    }

    async getNutritionById(id: number) {
        const nutrition = await this.prismaClient.nutrition.findUnique({
            where: {
                id
            }
        });

        return nutrition;
    }
};


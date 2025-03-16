import { PrismaClient } from "@prisma/client";
import { INutrition } from "../types/family";
import { calculateBMI } from "../common/utils/CalculateBMI";
import { NotFoundError } from "../common/exception";
import { Prisma } from "@prisma/client";

export class NutritionService {
  constructor(public prismaClient: PrismaClient) {}

  async createNutrition(familyMemberId: number, nutritionPayload: INutrition) {
    const nutrition = await this.prismaClient.nutrition.create({
      data: {
        height: nutritionPayload.height,
        weight: nutritionPayload.weight,
        family_member_id: familyMemberId,
        ...(nutritionPayload.birth_weight && {
          birth_weight: nutritionPayload.birth_weight,
        }),
        bmi:
          nutritionPayload.bmi ??
          calculateBMI(nutritionPayload.height, nutritionPayload.weight),
        created_by: nutritionPayload.createdBy,
        updated_by: nutritionPayload.updatedBy,
      },
    });

    return { nutrition };
  }

  async updateNutrition(
    nutritionId: number,
    familyMemberId: number,
    nutritionPayload: INutrition
  ) {
    const isNutritionExists = await this.getNutritionById(nutritionId);
    if (!isNutritionExists) {
      throw new NotFoundError("Nutrition not found");
    }

    const nutrition = await this.prismaClient.nutrition.update({
      where: {
        id: nutritionId,
      },
      data: {
        ...isNutritionExists,
        height: nutritionPayload.height,
        weight: nutritionPayload.weight,
        family_member_id: familyMemberId,
        ...(nutritionPayload.birth_weight && {
          birth_weight: nutritionPayload.birth_weight,
        }),
        bmi:
          nutritionPayload.bmi ??
          calculateBMI(nutritionPayload.height, nutritionPayload.weight),
        updated_by: nutritionPayload.updatedBy,
      },
    });

    return {
      nutrition,
    };
  }

  async getNutritionById(id: number) {
    const nutrition = await this.prismaClient.nutrition.findUnique({
      where: {
        id,
      },
    });

    return nutrition;
  }

  async getNutritionStatistics(statusTypeId: number | undefined = undefined) {
    const nutritions: any[] = await this.prismaClient
      .$queryRaw` SELECT i.name AS institution_name, CASE
        WHEN n.status_id = 1 THEN "Kekurangan Gizi Tingkat Berat"
        WHEN n.status_id = 2 THEN "Kekurangan Gizi Tingkat Ringan"
        WHEN n.status_id = 3 THEN "Gizi Normal"
        WHEN n.status_id = 4 THEN "Beresiko Kelebihan Gizi Tingkat Ringan"
        WHEN n.status_id = 5 THEN "Beresiko Kelebihan Gizi Tingkat Berat"
        ELSE "Tidak Diketahui"
    END AS "nutrition_status",
    n.status_id,
      COUNT(n.id) AS total
      FROM nutritions n
      JOIN family_members fm ON n.family_member_id = fm.id
      JOIN institutions i ON fm.institution_id = i.id
      ${
        statusTypeId
          ? Prisma.sql`WHERE n.status_id = ${statusTypeId}`
          : Prisma.empty
      }
      GROUP BY i.name, n.status_id
      ORDER BY total DESC;`;

    return { statistic: nutritions };
  }

  async getNutritionStatisticsFromFamily(
    userId: number,
    institutionId: number,
    statusTypeId?: number
  ) {
    const nutritions: any[] = await this.prismaClient.$queryRaw`
    SELECT n.status_id, 
    CASE
      WHEN n.status_id = 1 THEN "Kekurangan Gizi Tingkat Berat"
      WHEN n.status_id = 2 THEN "Kekurangan Gizi Tingkat Ringan"
      WHEN n.status_id = 3 THEN "Gizi Normal"
      WHEN n.status_id = 4 THEN "Beresiko Kelebihan Gizi Tingkat Ringan"
      WHEN n.status_id = 5 THEN "Beresiko Kelebihan Gizi Tingkat Berat"
      ELSE "Tidak Diketahui"
    END AS "nutrition_status",
    COUNT(n.id) AS total
      FROM nutritions n
      JOIN family_members fm ON n.family_member_id = fm.id
      JOIN institutions i ON fm.institution_id = i.id
      JOIN families f ON fm.family_id = f.id
      JOIN users u ON f.user_id = u.id
      WHERE i.id = ${institutionId} && u.id = ${userId}
      ${
        statusTypeId
          ? Prisma.sql`&& n.status_id = ${statusTypeId}`
          : Prisma.empty
      }
      GROUP BY n.status_id
      ORDER BY total DESC;`;

    return { statistic: nutritions };
  }
}

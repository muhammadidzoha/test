"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionService = void 0;
const CalculateBMI_1 = require("../common/utils/CalculateBMI");
const exception_1 = require("../common/exception");
class NutritionService {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    createNutrition(familyMemberId, nutritionPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const nutrition = yield this.prismaClient.nutrition.create({
                data: Object.assign(Object.assign({ height: nutritionPayload.height, weight: nutritionPayload.weight, family_member_id: familyMemberId }, (nutritionPayload.birth_weight && {
                    birth_weight: nutritionPayload.birth_weight
                })), { bmi: (_a = nutritionPayload.bmi) !== null && _a !== void 0 ? _a : (0, CalculateBMI_1.calculateBMI)(nutritionPayload.height, nutritionPayload.weight), created_by: nutritionPayload.createdBy, updated_by: nutritionPayload.updatedBy })
            });
            return { nutrition };
        });
    }
    updateNutrition(nutritionId, familyMemberId, nutritionPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const isNutritionExists = yield this.getNutritionById(nutritionId);
            if (!isNutritionExists) {
                throw new exception_1.NotFoundError('Nutrition not found');
            }
            const nutrition = yield this.prismaClient.nutrition.update({
                where: {
                    id: nutritionId
                },
                data: Object.assign(Object.assign({ height: nutritionPayload.height, weight: nutritionPayload.weight, family_member_id: familyMemberId }, (nutritionPayload.birth_weight && {
                    birth_weight: nutritionPayload.birth_weight
                })), { bmi: (_a = nutritionPayload.bmi) !== null && _a !== void 0 ? _a : (0, CalculateBMI_1.calculateBMI)(nutritionPayload.height, nutritionPayload.weight), updated_by: nutritionPayload.updatedBy })
            });
            return {
                nutrition
            };
        });
    }
    getNutritionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const nutrition = yield this.prismaClient.nutrition.findUnique({
                where: {
                    id
                }
            });
            return nutrition;
        });
    }
}
exports.NutritionService = NutritionService;
;

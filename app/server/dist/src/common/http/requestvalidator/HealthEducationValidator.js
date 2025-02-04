"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthEducationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.HealthEducationSchema = joi_1.default.object({
    healthEducationPlan: joi_1.default.boolean().required(),
    healthEducation: joi_1.default.boolean().required(),
    physicalEducation: joi_1.default.boolean().required(),
    extracurricularHealthActivities: joi_1.default.boolean().required(),
    literacyHealthProgram: joi_1.default.boolean().required(),
    caderCoaching: joi_1.default.boolean().required(),
    healthyBreakfastProgram: joi_1.default.boolean().required(),
    physicalClassActivities: joi_1.default.boolean().required(),
    fitnessTest: joi_1.default.boolean().required(),
    nutritionEducation: joi_1.default.boolean().required(),
    healthyLivingImplementation: joi_1.default.boolean().required(),
    parentInvolvement: joi_1.default.boolean().required(),
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNutritionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.addNutritionSchema = joi_1.default.object({
    height: joi_1.default.number().required(),
    weight: joi_1.default.number().required(),
    bmi: joi_1.default.number(),
    birthWeight: joi_1.default.number()
});

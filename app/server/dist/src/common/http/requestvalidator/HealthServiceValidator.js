"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthServiceSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.HealthServiceSchema = joi_1.default.object({
    healthCheckRoutine: joi_1.default.boolean().required(),
    referralHandling: joi_1.default.boolean().required(),
    consulingFacility: joi_1.default.boolean().required(),
    periodicScreeningInspection: joi_1.default.boolean().required()
});

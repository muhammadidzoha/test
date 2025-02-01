"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addHealthCareMemberSchema = exports.CreateHealthCareSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateHealthCareSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    leadName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    positionId: joi_1.default.number().required()
});
exports.addHealthCareMemberSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    positionId: joi_1.default.number().required(),
    userId: joi_1.default.number()
});

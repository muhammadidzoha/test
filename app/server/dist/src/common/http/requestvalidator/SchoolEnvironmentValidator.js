"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schoolEnvironmentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.schoolEnvironmentSchema = joi_1.default.object({
    canteen: joi_1.default.boolean().required(),
    greenSpace: joi_1.default.boolean().required(),
    trashCan: joi_1.default.boolean().required(),
    unprotectedAreaPolicy: joi_1.default.boolean().required()
});

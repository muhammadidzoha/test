"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.institutionRegisterPayloadSchema = exports.registerPayloadSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerPayloadSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    role: joi_1.default.number().custom((value, helpers) => {
        if (value !== 4) {
            return helpers.error('Role must be 1, 2, 3, or 4');
        }
        return value;
    })
});
exports.institutionRegisterPayloadSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).required(),
    password: joi_1.default.string().min(6).required(),
    roleId: joi_1.default.number().required(),
    address: joi_1.default.string().required(),
    headNip: joi_1.default.string().required(),
    headName: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    institutionId: joi_1.default.number().integer().custom((value, helpers) => {
        if (value !== 1 && value !== 2) {
            return helpers.error('error');
        }
        return value;
    })
});

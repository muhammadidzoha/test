"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMemberSchema = exports.createFamilySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createFamilySchema = joi_1.default.object({
    headFamily: joi_1.default.string().required(),
    headPhoneNumber: joi_1.default.string().required(),
    kkNumber: joi_1.default.string(),
    description: joi_1.default.string()
});
exports.addMemberSchema = joi_1.default.object({
    fullName: joi_1.default.string().required(),
    birthDate: joi_1.default.date().required(),
    education: joi_1.default.string().required().custom((value, helpers) => {
        if (!['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'].includes(value)) {
            return helpers.error('Only allowed SD, SMP, SMA, D3, S1, S2, S3');
        }
        return value;
    }),
    job: joi_1.default.object({
        id: joi_1.default.number(),
        name: joi_1.default.string().required(),
        income: joi_1.default.number().required()
    }).required(),
    knowledgeNutrition: {
        knowledge: joi_1.default.string().required(),
        score: joi_1.default.number()
    },
    residence: joi_1.default.object({
        id: joi_1.default.number(),
        address: joi_1.default.string(),
        description: joi_1.default.string(),
        status: joi_1.default.string().custom((value, helpers) => {
            if (!['OWN', 'RENT', 'OTHER'].includes(value)) {
                return helpers.error('Only allowed OWN, RENT, OTHER');
            }
            return value;
        }).required()
    }).required(),
    gender: joi_1.default.string().required().custom((value, helpers) => {
        if (!['L', 'P'].includes(value)) {
            return helpers.error('Only allowed L, P');
        }
        return value;
    }),
    relation: joi_1.default.string().required().custom((value, helpers) => {
        if (!['AYAH', 'IBU', 'ANAK', 'LAINNYA'].includes(value)) {
            return helpers.error('Only allowed AYAH, IBU, LAINNYA');
        }
        return value;
    }),
    institutionId: joi_1.default.number(),
    nutrition: joi_1.default.object({
        height: joi_1.default.number().required(),
        weight: joi_1.default.number().required(),
        bmi: joi_1.default.number(),
        birth_weight: joi_1.default.number(),
    }).required(),
    behaviour: joi_1.default.object({
        eatFrequency: joi_1.default.number().required(),
        drinkFrequency: joi_1.default.number().required(),
        physicalActivity: joi_1.default.number().required(),
        sleepQuality: joi_1.default.number().required()
    })
});

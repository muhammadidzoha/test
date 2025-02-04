"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAssigneeSchema = exports.updateApprovalSchema = exports.createActivityPlanSchema = exports.createKIEArticleSchema = exports.addBookSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.addBookSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string(),
});
exports.createKIEArticleSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string(),
    content: joi_1.default.string().required(),
    bannerUrl: joi_1.default.string(),
    thumbnailUrl: joi_1.default.string(),
    tags: joi_1.default.array().items(joi_1.default.string()).required()
});
exports.createActivityPlanSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string(),
    schedule: joi_1.default.date().required(),
    budget: joi_1.default.number(),
    status: joi_1.default.string().required().custom((value, helpers) => {
        if (!['DRAFT', 'SCHEDULED', 'APPROVED', 'ONGOING', 'COMPLETED'].includes(value)) {
            return helpers.error('only allowed values are DRAFT, SCHEDULED, APPROVED, ONGOING, COMPLETED');
        }
        return value;
    }),
});
exports.updateApprovalSchema = joi_1.default.object({
    status: joi_1.default.string().required().custom((value, helpers) => {
        if (!['APPROVED', 'REJECTED'].includes(value)) {
            return helpers.error('only allowed values are APPROVED, REJECTED');
        }
        return value;
    }),
    comment: joi_1.default.string()
});
exports.addAssigneeSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string(),
    progress: joi_1.default.string().custom((value, helpers) => {
        if (!['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].includes(value)) {
            return helpers.error('only allowed values are NOT_STARTED, IN_PROGRESS, COMPLETED');
        }
        return value;
    })
});

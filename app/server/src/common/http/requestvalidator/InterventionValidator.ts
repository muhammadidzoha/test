import joi from 'joi';

export const createInterventionSchema = joi.object({
    recommendation: joi.string().required(),
    programRecommendation: joi.number(),
})

export const requestInterventionSchema = joi.object({
    institutionId: joi.number().required(),
    familyId: joi.number().required(),
})
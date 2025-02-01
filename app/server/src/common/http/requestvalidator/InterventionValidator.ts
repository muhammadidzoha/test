import joi from 'joi';

export const createInterventionSchema = joi.object({
    recommendation: joi.string().required(),
    programRecommendation: joi.number(),
})
import joi from 'joi';

export const createQuisionerSchema = joi.object({
    title: joi.string().required(),
    description: joi.string(),
    stratification: joi.string().valid('MINIMAL', 'STANDAR', 'OPTIMAL', 'PARIPURNA'),
    questions: joi.array().items(joi.object({
        question: joi.string().required(),
        type: joi.string().valid('MULTIPLE_CHOICE', 'BOOLEAN', 'SCALE', 'TEXT').required(),
        isRequired: joi.boolean().required(),
        options: joi.when('type', {
            is: 'MULTIPLE_CHOICE',
            then: joi.array().items(joi.object({
                title: joi.string().required(),
                score: joi.number()
            })).min(1).required(),
            otherwise: joi.forbidden()
        })
    }).required()).required()
});
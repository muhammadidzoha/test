import joi from 'joi';

export const addBookSchema = joi.object({
    name: joi.string().required(),
    description: joi.string(),
})

export const createKIEArticleSchema = joi.object({
    title: joi.string().required(),
    description: joi.string(),
    content: joi.string().required(),
    bannerUrl: joi.string(),
    thumbnailUrl: joi.string(),
    tags: joi.array().items(joi.string()).required()
})

export const createActivityPlanSchema = joi.object({
    title: joi.string().required(),
    description: joi.string(),
    schedule: joi.date().required(),
    budget: joi.number(),
    status: joi.string().required().custom((value, helpers) => {
        if (!['DRAFT', 'SCHEDULED', 'APPROVED', 'ONGOING', 'COMPLETED'].includes(value)) {
            return helpers.error('only allowed values are DRAFT, SCHEDULED, APPROVED, ONGOING, COMPLETED');
        }
        return value;
    }),
})
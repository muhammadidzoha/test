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
    type: joi.number().required().min(1).max(3),
    tags: joi.array().items(joi.string()).required()
})
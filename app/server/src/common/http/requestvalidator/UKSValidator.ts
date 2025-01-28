import joi from 'joi';

export const addBookSchema = joi.object({
    name: joi.string().required(),
    description: joi.string(),
})
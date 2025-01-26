import joi from 'joi';

export const createFamilySchema = joi.object({
    headFamily: joi.string().required(),
    headPhoneNumber: joi.string().required(),
    kkNumber: joi.string(),
    description: joi.string()
});
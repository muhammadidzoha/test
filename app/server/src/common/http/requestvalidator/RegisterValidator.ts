import joi from 'joi';

export const registerPayloadSchema = joi.object({
    username: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    role: joi.number().custom((value, helpers) => {
        if (value !== 4) {
            return helpers.error('Role must be 1, 2, 3, or 4');
        }
        return value;
    })
})

export const institutionRegisterPayloadSchema = joi.object({
    username: joi.string().min(3).required(),
    password: joi.string().min(6).required(),
    roleId: joi.number().required(),
    address: joi.string().required(),
    headNip: joi.string().required(),
    headName: joi.string().required(),
    name: joi.string().required(),
    phoneNumber: joi.string().required(),
    email: joi.string().email().required(),
    institutionId: joi.number().integer().custom((value, helpers) => {
        if (value !== 1 && value !== 2) {
            return helpers.error('error');
        }
        return value;
    })
})

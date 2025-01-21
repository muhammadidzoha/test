import joi from 'joi';

export const registerPayloadSchema = joi.object({
    username: joi.string().min(3).required(),
    password: joi.string().min(6).required(),
    role: joi.number().custom((value, helpers) => {
        console.log({ value });
        if (value !== 1 && value !== 2 && value !== 3 && value !== 4) {
            return helpers.error('error');
        }
        return value;
    })
})

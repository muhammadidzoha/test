import joi from 'joi'

export const CompleteRegistrationSchema = joi.object({
    email: joi.string().email().required(),
    fullName: joi.string().required()
});
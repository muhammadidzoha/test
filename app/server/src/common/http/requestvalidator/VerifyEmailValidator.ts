import joi from 'joi'
export const verifyEmailSchema = joi.object({
    email: joi.string().email().required()
})
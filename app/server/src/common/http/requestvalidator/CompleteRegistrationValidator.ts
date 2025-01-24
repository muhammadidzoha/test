import joi from 'joi'

export const CompleteRegistrationSchema = joi.object({
    schoolId: joi.number().required(),
    healthCareId: joi.number().required(),
    email: joi.string().email().required()
});
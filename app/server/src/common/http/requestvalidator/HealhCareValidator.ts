import joi from 'joi'
export const CreateHealthCareSchema = joi.object({
    name: joi.string().required(),
    leadName: joi.string().required()
})

export const addHealthCareMemberSchema = joi.object({
    name: joi.string().required(),
    positionId: joi.number().required(),
    userId: joi.number()
})
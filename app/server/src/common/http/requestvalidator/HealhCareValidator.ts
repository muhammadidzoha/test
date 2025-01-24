import joi from 'joi'
export const CreateHealthCareSchema = joi.object({
    name: joi.string().required(),
    leadName: joi.string().required()
})
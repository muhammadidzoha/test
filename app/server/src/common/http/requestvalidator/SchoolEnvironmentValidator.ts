import joi from 'joi'

export const schoolEnvironmentSchema = joi.object({
    canteen: joi.boolean().required(),
    greenSpace: joi.boolean().required(),
    trashCan: joi.boolean().required(),
    unprotectedAreaPolicy: joi.boolean().required()
})
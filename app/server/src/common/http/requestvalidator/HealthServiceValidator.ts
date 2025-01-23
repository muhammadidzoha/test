import joi from 'joi';
export const HealthServiceSchema = joi.object({
    healthCheckRoutine: joi.boolean().required(),
    referralHandling: joi.boolean().required(),
    consulingFacility: joi.boolean().required(),
    periodicScreeningInspection: joi.boolean().required()
})
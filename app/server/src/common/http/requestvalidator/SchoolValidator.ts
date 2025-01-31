import joi from 'joi';

export const createFacilitySchema = joi.object({
    name: joi.string().required(),
    description: joi.string(),
    facilityTypeId: joi.number().required()
});
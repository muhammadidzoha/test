import joi from "joi";

export const createInstitutionSchema = joi.object({
  name: joi.string().required(),
  address: joi.string().required(),
  phoneNumber: joi.string().required(),
  email: joi.string().required(),
  headName: joi.string(),
  headNip: joi.string(),
  userId: joi.number(),
  institutionType: joi.number().required(),
});

export const updatedInstitutionSchema = joi.object({
  name: joi.string().required(),
  address: joi.string().required(),
  phoneNumber: joi.string().required(),
  email: joi.string().required(),
  headName: joi.string(),
  headNip: joi.string(),
  userId: joi.number(),
});

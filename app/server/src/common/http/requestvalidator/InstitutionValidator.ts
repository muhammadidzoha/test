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
  provinceId: joi.number(),
  cityId: joi.number(),
});

export const updatedInstitutionSchema = joi.object({
  name: joi.string().required(),
  address: joi.string().required(),
  phoneNumber: joi.string().required(),
  email: joi.string().required(),
  headName: joi.string(),
  headNip: joi.string(),
  userId: joi.number(),
  provinceId: joi.number(),
  cityId: joi.number(),
});

export const addInstitutionSchema = joi.object({
  name: joi.string().required(),
  address: joi.string().required(),
  phoneNumber: joi.string().required(),
  email: joi.string().required(),
});

import joi, { number } from "joi";

export const createFacilitySchema = joi.object({
  name: joi.string().required(),
  description: joi.string(),
  facilityTypeId: joi.number().required(),
});

export const createUKSQuisionerSchema = joi.object({
  healthHandBook: joi.boolean().required(),
  personInCharge: joi.boolean().required(),
  healthKie: joi.boolean().required(),
  sportInfrastructure: joi.boolean().required(),
  budget: joi.boolean().required(),
  healthCarePartnership: joi.boolean().required(),
  activityPlan: joi.boolean().required(),
});

export const createSchoolSchema = joi.object({
  name: joi.string(),
  address: joi.string(),
  phone: joi.string(),
  email: joi.string().email(),
  headName: joi.string(),
  headNIP: joi.string(),
  licenseDocument: joi.string(),
});

export const createClassSchema = joi.object({
  classNumbers: joi.array().items(joi.string()).required().min(1),
});

export const createCategorySchema = joi.object({
  classCategories: joi.array().items(joi.string()).required().min(1),
});

export const connectCategoryOnClassSchema = joi.object({
  classCategoriesId: joi.array().items(joi.number()).required().min(1),
});

export const addStudentSchema = joi.object({
  schoolYear: joi.string(),
  semester: joi.string().required(),
  categoryOnClassId: joi.number().required(),
});

export const addTeacherSchema = joi.object({
  name: joi.string().required(),
  userId: joi.number().required(),
});

export const enrolledTeacherSchema = joi.object({
  teacherId: joi.number().required(),
  schoolYear: joi.string().required(),
});

export const addSchoolSchema = joi.object({
  name: joi.string().required(),
  address: joi.string().required(),
  phoneNumber: joi.string().required(),
  email: joi.string().required(),
});

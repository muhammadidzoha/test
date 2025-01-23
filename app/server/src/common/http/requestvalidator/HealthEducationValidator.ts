import joi from 'joi'
export const HealthEducationSchema = joi.object({
    healthEducationPlan: joi.boolean().required(),
    healthEducation: joi.boolean().required(),
    physicalEducation: joi.boolean().required(),
    extracurricularHealthActivities: joi.boolean().required(),
    literacyHealthProgram: joi.boolean().required(),
    caderCoaching: joi.boolean().required(),
    healthyBreakfastProgram: joi.boolean().required(),
    physicalClassActivities: joi.boolean().required(),
    fitnessTest: joi.boolean().required(),
    nutritionEducation: joi.boolean().required(),
    healthyLivingImplementation: joi.boolean().required(),
    parentInvolvement: joi.boolean().required(),
});

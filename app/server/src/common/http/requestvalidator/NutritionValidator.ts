import joi from "joi";

export const addNutritionSchema = joi.object({
  height: joi.number().required(),
  weight: joi.number().required(),
  bmi: joi.number(),
  birth_weight: joi.number(),
});

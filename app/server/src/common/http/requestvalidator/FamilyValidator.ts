import joi from "joi";

export const createFamilySchema = joi.object({
  headFamily: joi.string().required(),
  headPhoneNumber: joi.string().required(),
  kkNumber: joi.string(),
  description: joi.string(),
});

export const addMemberSchema = joi.object({
  fullName: joi.string().required(),
  birthDate: joi.date().required(),
  education: joi
    .string()
    .required()
    .custom((value, helpers) => {
      if (!["SD", "SMP", "SMA", "D3", "S1", "S2", "S3"].includes(value)) {
        return helpers.error("Only allowed SD, SMP, SMA, D3, S1, S2, S3");
      }
      return value;
    }),
  job: joi
    .object({
      id: joi.number(),
      jobTypeId: joi.number().required(),
      income: joi.number().required(),
    })
    .required(),
  knowledgeNutrition: {
    knowledge: joi.string().required(),
    score: joi.number(),
  },
  residence: joi
    .object({
      id: joi.number(),
      address: joi.string(),
      description: joi.string(),
      status: joi
        .string()
        .custom((value, helpers) => {
          if (!["OWN", "RENT", "OTHER"].includes(value)) {
            return helpers.error("Only allowed OWN, RENT, OTHER");
          }
          return value;
        })
        .required(),
    })
    .required(),
  gender: joi
    .string()
    .required()
    .custom((value, helpers) => {
      if (!["L", "P"].includes(value)) {
        return helpers.error("Only allowed L, P");
      }
      return value;
    }),
  relation: joi
    .string()
    .required()
    .custom((value, helpers) => {
      if (!["AYAH", "IBU", "ANAK", "LAINNYA"].includes(value)) {
        return helpers.error("Only allowed AYAH, IBU, LAINNYA");
      }
      return value;
    }),
  institutionId: joi.number(),
  nutrition: joi
    .object({
      height: joi.number().required(),
      weight: joi.number().required(),
      bmi: joi.number(),
      birth_weight: joi.number(),
    })
    .required(),
  behaviour: joi.object({
    eatFrequency: joi.number().required(),
    drinkFrequency: joi.number().required(),
    physicalActivity: joi.number().required(),
    sleepQuality: joi.number().required(),
    phbs: joi.number().required(),
  }),
});

export const addMemberSchemaV2 = joi.object({
  fullName: joi.string().required(),
  birthDate: joi.date().required(),
  education: joi
    .string()
    .required()
    .custom((value, helpers) => {
      if (!["SD", "SMP", "SMA", "D3", "S1", "S2", "S3"].includes(value)) {
        return helpers.error("Only allowed SD, SMP, SMA, D3, S1, S2, S3");
      }
      return value;
    }),
  job: joi
    .object({
      id: joi.number(),
      jobTypeId: joi.number().required(),
      income: joi.number().required(),
    })
    .required(),
  residenceId: joi.number(),
  residence: joi.when("residenceId", {
    is: joi.exist(),
    then: joi.forbidden(),
    otherwise: joi.object({
      address: joi.string().required(),
      description: joi.string(),
      status: joi
        .string()
        .custom((value, helpers) => {
          if (!["OWN", "RENT", "OTHER"].includes(value)) {
            return helpers.error("Only allowed OWN, RENT, OTHER");
          }
          return value;
        })
        .required(),
    }),
  }),
  gender: joi
    .string()
    .required()
    .custom((value, helpers) => {
      if (!["L", "P"].includes(value)) {
        return helpers.error("Only allowed L, P");
      }
      return value;
    }),
  relation: joi
    .string()
    .required()
    .custom((value, helpers) => {
      if (!["AYAH", "IBU", "ANAK", "LAINNYA"].includes(value)) {
        return helpers.error("Only allowed AYAH, IBU, LAINNYA");
      }
      return value;
    }),
  institutionId: joi.number(),
  nutrition: joi
    .object({
      height: joi.number().required(),
      weight: joi.number().required(),
      bmi: joi.number(),
      birth_weight: joi.number(),
    })
    .required(),
  phoneNumber: joi.when("relation", {
    is: joi.valid("AYAH", "IBU"),
    then: joi.string().required(),
    otherwise: joi.string(),
  }),
  classId: joi.when("relation", {
    is: "ANAK",
    then: joi.number().required(),
    otherwise: joi.number(),
  }),
  semester: joi.when("relation", {
    is: "ANAK",
    then: joi.valid("1", "2").required(),
    otherwise: joi.number(),
  }),
  kkNumber: joi.string(),
  schoolYear: joi.string(),
  nis: joi.when("relation", {
    is: "ANAK",
    then: joi.string().required(),
    otherwise: joi.string(),
  }),
});

export const addMemberSchemaV3 = joi.object({
  members: joi
    .array()
    .items(
      joi.object({
        fullName: joi.string().required(),
        birthDate: joi.date().required(),
        education: joi
          .string()
          .required()
          .custom((value, helpers) => {
            if (!["SD", "SMP", "SMA", "D3", "S1", "S2", "S3"].includes(value)) {
              return helpers.error("Only allowed SD, SMP, SMA, D3, S1, S2, S3");
            }
            return value;
          }),
        job: joi
          .object({
            id: joi.number(),
            jobTypeId: joi.number().required(),
            income: joi.number().required(),
          })
          .required(),
        residenceId: joi.number(),
        residence: joi.when("residenceId", {
          is: joi.exist(),
          then: joi.forbidden(),
          otherwise: joi.object({
            address: joi.string().required(),
            description: joi.string().default("").allow(""),
            status: joi
              .string()
              .custom((value, helpers) => {
                if (!["OWN", "RENT", "OTHER"].includes(value)) {
                  return helpers.error("Only allowed OWN, RENT, OTHER");
                }
                return value;
              })
              .required(),
          }),
        }),
        gender: joi
          .string()
          .required()
          .custom((value, helpers) => {
            if (!["L", "P"].includes(value)) {
              return helpers.error("Only allowed L, P");
            }
            return value;
          }),
        relation: joi
          .string()
          .required()
          .custom((value, helpers) => {
            if (!["AYAH", "IBU", "ANAK", "LAINNYA"].includes(value)) {
              return helpers.error("Only allowed AYAH, IBU, LAINNYA");
            }
            return value;
          }),
        institutionId: joi.number(),
        nutrition: joi
          .object({
            height: joi.number().required(),
            weight: joi.number().required(),
            bmi: joi.number(),
            birth_weight: joi.number(),
          })
          .required(),
        phoneNumber: joi.when("relation", {
          is: joi.valid("AYAH", "IBU"),
          then: joi.string().required(),
          otherwise: joi.string(),
        }),
        class: joi.when("relation", {
          is: "ANAK",
          then: joi.string().required(),
          otherwise: joi.string(),
        }),
        kkNumber: joi.string(),
      })
    )
    .min(1)
    .required(),
});

export const updateMemberSchema = joi.object({
  fullName: joi.string().required(),
  birthDate: joi.string().required(),
  education: joi.valid("SD", "SMP", "SMA", "D3", "S1", "S2", "S3").required(),
  job: joi
    .object({
      jobTypeId: joi.number().required(),
      income: joi.number().required(),
    })
    .required(),
  relation: joi.valid("AYAH", "IBU", "ANAK", "LAINNYA").required(),
  residence: joi
    .object({
      status: joi.valid("OWN", "RENT", "OTHER").required(),
      description: joi.string(),
      address: joi.string().required(),
    })
    .required(),
  gender: joi.valid("L", "P").required(),
  phoneNumber: joi.string(),
  institutionId: joi.number().required(),
});

import joi from 'joi';

export const createFamilySchema = joi.object({
    headFamily: joi.string().required(),
    headPhoneNumber: joi.string().required(),
    kkNumber: joi.string(),
    description: joi.string()
});

export const addMemberSchema = joi.object({
    fullName: joi.string().required(),
    birthDate: joi.date().required(),
    education: joi.string().required().custom((value, helpers) => {
        if (!['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'].includes(value)) {
            return helpers.error('Only allowed SD, SMP, SMA, D3, S1, S2, S3');
        }
        return value
    }),
    job: joi.object({
        id: joi.number(),
        name: joi.string().required(),
        income: joi.number().required()
    }).required(),
    knowledgeNutrition: {
        knowledge: joi.string().required(),
        score: joi.number()
    },
    residence: joi.object({
        id: joi.number(),
        address: joi.string(),
        description: joi.string(),
        status: joi.string().custom((value, helpers) => {
            if (!['OWN', 'RENT', 'OTHER'].includes(value)) {
                return helpers.error('Only allowed OWN, RENT, OTHER');
            }
            return value;
        }).required()
    }).required(),
    gender: joi.string().required().custom((value, helpers) => {
        if (!['L', 'P'].includes(value)) {
            return helpers.error('Only allowed L, P');
        }
        return value;
    }),
    relation: joi.string().required().custom((value, helpers) => {
        if (!['AYAH', 'IBU', 'ANAK', 'LAINNYA'].includes(value)) {
            return helpers.error('Only allowed AYAH, IBU, LAINNYA');
        }
        return value;
    }),
    institutionId: joi.number()
})
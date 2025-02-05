import joi from 'joi';

export const createQuisionerSchema = joi.object({
    title: joi.string().required(),
    description: joi.string(),
    stratification: joi.string(),
    questions: joi.array().items(joi.object({
        question: joi.string().required(),
        type: joi.string().valid('MULTIPLE_CHOICE', 'BOOLEAN', 'SCALE', 'TEXT').required(),
        isRequired: joi.boolean().required(),
        options: joi.when('type', {
            is: joi.valid('MULTIPLE_CHOICE', 'SCALE'),
            then: joi.array().items(joi.object({
                title: joi.string().required(),
                score: joi.number()
            })).min(1).required(),
            otherwise: joi.forbidden()
        })
    })).min(1).required(),
    for: joi.valid('SCHOOL', 'PARENT', 'PUSKESMAS', 'CHILDREN').required()
});

export const createResponseQuisioner = joi.object({
    familyMemberId: joi.number(),
    institutionId: joi.number(),
    answers: joi.array().items(
        joi.object({
            questionId: joi.number().required(),
            score: joi.number(),
            booleanValue: joi.boolean(),
            textValue: joi.string(),
            optionId: joi.number(),
            scaleValue: joi.number()
        })
    ).min(1).required()
})

export const addQuestionToQuisionerSchema = joi.object({
    question: joi.string().required(),
    type: joi.string().valid('MULTIPLE_CHOICE', 'BOOLEAN', 'SCALE', 'TEXT').required(),
    isRequired: joi.boolean().required(),
    options: joi.when('type', {
        is: joi.valid('MULTIPLE_CHOICE', 'SCALE'),
        then: joi.array().items(
            joi.object({
                title: joi.string().required(),
                score: joi.number()
            })
        ).min(1).required()
    })
})
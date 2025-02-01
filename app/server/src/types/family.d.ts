import { EDUCATION, GENDER, RELATION, RESIDENCESTATUS } from "@prisma/client";

export interface IFamily {
    headFamily: string;
    kkNumber: string?;
    headPhoneNumber: string;
    description: string?;
}

export interface IJob {
    income: number;
    jobTypeId: number;
}

export interface IResidence {
    status: RESIDENCESTATUS,
    address: string?;
    description: string?;
}

export interface IKnowledgeNutritions {
    knowledge: string;
    score: int?
}

export interface INutrition {
    height: number;
    weight: number;
    bmi: number?;
    birth_weight: number?;
    createdBy: number;
    updatedBy: number;
}


export interface IBehaviour {
    eatFrequency: 1 | 2 | 3 | 4;
    drinkFrequency: 1 | 2 | 3 | 4;
    sleepQuality: 1 | 2 | 3 | 4;
    physicalActivity: 1 | 2 | 3 | 4;
}

export interface IFamilyMember {
    fullName: string;
    birthDate: Date;
    education: EDUCATION;
    job: IJOB & { id: number };
    knowledgeNutrition: (IKnowledgeNutritions & { id: number })?;
    residence: IResidence & { id: number }
    gender: GENDER;
    relation: RELATION;
    institutionId: number?;
    nutrition: INutrition;
    behaviour: IBehaviour?;
}

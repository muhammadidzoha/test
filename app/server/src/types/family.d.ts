import { EDUCATION, GENDER, RELATION, RESIDENCESTATUS } from "@prisma/client";

export interface IFamily {
    headFamily: string;
    kkNumber: string?;
    headPhoneNumber: string;
    description: string?;
}

export interface IJob {
    name: string;
    income: number;
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
}
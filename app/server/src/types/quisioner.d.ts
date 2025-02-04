export interface IOption {
    questionId: number;
    title: string;
    score: number?;
    createdAt: Date;
}


export interface IQuestions {
    quisionerId: number;
    question: string;
    type: 'MULTIPLE_CHOICE' | 'BOOLEAN' | 'SCALE' | 'TEXT';
    isRequired: boolean;
    options: IOption[]?;
}


export interface IQuisioner {
    title: string;
    description: string?;
    questions: IQuestions[]
    stratification: ('MINIMAL' | 'STANDAR' | 'OPTIMAL' | 'PARIPURNA')?;
    for: string?
}

export interface QuisionerPayload extends IQuisioner extends IQuestions {
}

export interface IResponse {
    quisionerId: number;
    familyMemberId: number?;
    institutionId: number?;
}
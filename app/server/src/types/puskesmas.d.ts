export interface IIntervention {
    recommendation: string;
    requestInterventionId: number;
    puskesmasId: number;
    createdBy: number;
}

export interface IRequestIntervention {
    institutionId: number;
    familyId: number;
    createdBy: number;
}

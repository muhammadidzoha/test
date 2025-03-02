import { boolean } from "joi";

export interface IHealthEducation {
  healthEducationPlan: boolean;
  healthEducation: boolean;
  physicalEducation: boolean;
  extracurricularHealthActivities: boolean;
  literacyHealthProgram: boolean;
  caderCoaching: boolean;
  healthyBreakfastProgram: boolean;
  physicalClassActivities: boolean;
  fitnessTest: boolean;
  nutritionEducation: boolean;
  healthyLivingImplementation: boolean;
  parentInvolvement: boolean;
}

export interface IHealthServicePayload {
  healthCheckRoutine: boolean;
  referralHandling: boolean;
  consulingFacility: boolean;
  periodicScreeningInspection: boolean;
}

export interface ISchoolEnvironment {
  canteen: boolean;
  greenSpace: boolean;
  trashCan: boolean;
  unprotectedAreaPolicy: boolean;
}

export interface IHealthCare {
  name: string;
  leadName: string;
  email: string;
  positionId: number;
}

export interface IHealthCareMember {
  name: string;
  healthCareId: number;
  positionId: number;
  userId?: number;
}

export interface IFacility {
  name: string;
  description: string?;
}

export interface IUKSQuisioner {
  healthHandBook: boolean;
  personInCharge: boolean;
  healthKie: boolean;
  sportInfrastructure: boolean;
  budget: boolean;
  healthCarePartnership: boolean;
  activityPlan: boolean;
}

export interface ICreateClass {
  class: string;
  schoolId: number;
  categories: string[];
}

export interface IStudentPayload {
  schoolId: number;
  studentId: number;
  categoryOnClassId: number;
  schoolYear: string?;
  semester: string;
}

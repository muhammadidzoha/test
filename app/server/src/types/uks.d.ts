import { ACTIVITYSTATUS, APPROVALSTATUS } from "@prisma/client";

export interface IBookUKS {
    name: string;
    description: string?;
    thumbnailUrl: string?;
    fileUrl: string;
}

export interface ICreatePlan {
    title: string;
    description: string?;
    schedule: Date;
    budget: number?;
    status: ACTIVITYSTATUS;
    atachedDocument: string?;
}

export interface IActivityApproval {
    status: APPROVALSTATUS;
    comment: string?;
}
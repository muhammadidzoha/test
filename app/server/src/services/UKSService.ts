import { PrismaClient } from "@prisma/client";
import { IBookUKS, ICreatePlan } from "../types/uks";
import { NotFoundError } from "../common/exception";
import { FormatDate } from "../common/utils/FormatDate";

export class UKSService {
    constructor(public prismaClient: PrismaClient) {

    }

    async addBook(healthCareId: number, createdBy: number, payload: IBookUKS) {
        const book = await this.prismaClient.uKSBook.create({
            data: {
                name: payload.name,
                description: payload.description,
                created_by: createdBy,
                updated_by: createdBy,
                file_url: payload.fileUrl,
                health_care_id: healthCareId,
                thumbnail_url: payload.thumbnailUrl
            }
        });

        return { book };
    }

    async getBooks(healthCareId: number) {
        const books = await this.prismaClient.uKSBook.findMany({
            where: {
                health_care_id: healthCareId
            }
        });

        return { books };
    }

    async deleteBookOwnedByHealthCare(healthCareId: number, bookId: number) {
        const { book: isBookExists } = await this.getbookOwnedByHealthCare(healthCareId, bookId);
        if (!isBookExists) {
            throw new NotFoundError('Book not found');
        }
        const book = await this.prismaClient.uKSBook.delete({
            where: {
                id: bookId,
                health_care_id: healthCareId
            }
        });

        return { book };
    }

    async getbookOwnedByHealthCare(healthCareId: number, bookId: number) {
        const book = await this.prismaClient.uKSBook.findFirst({
            where: {
                id: bookId,
                health_care_id: healthCareId
            }
        });

        return { book };
    }

    async updateBookOwnedByHealthCare(healthCareId: number, bookId: number, payload: IBookUKS & { updatedBy: number }) {
        const { book: isBookExists } = await this.getbookOwnedByHealthCare(healthCareId, bookId);
        if (!isBookExists) {
            throw new NotFoundError('Book not found');
        }
        const book = await this.prismaClient.uKSBook.update({
            where: {
                id: bookId,
                health_care_id: healthCareId
            },
            data: {
                name: payload.name,
                description: payload.description,
                file_url: payload.fileUrl,
                thumbnail_url: payload.thumbnailUrl,
                updated_by: payload.updatedBy
            }
        });

        return { book };
    }


    async createActivityPlan(activityPlanPayload: ICreatePlan & { createdBy: number, healthCareId: number }) {
        console.log({ formattedDate: FormatDate(activityPlanPayload.schedule) });

        return this.prismaClient.$transaction(async (prisma) => {
            const activityPlan = await prisma.uKSActivityPlan.create({
                data: {
                    title: activityPlanPayload.title,
                    description: activityPlanPayload.description,
                    schedule: activityPlanPayload.schedule,
                    budget: activityPlanPayload.budget ?? 0,
                    status: activityPlanPayload.status,
                    atached_document: activityPlanPayload.atachedDocument,
                    created_by: activityPlanPayload.createdBy,
                    updated_by: activityPlanPayload.createdBy,
                    health_care_id: activityPlanPayload.healthCareId
                }
            })

            const activityApproval = await prisma.uKSActivityApproval.create({
                data: {
                    status: 'PENDING',
                    comment: '',
                    activity_plan_id: activityPlan.id
                }
            });

            return { activityPlan, activityApproval };
        })
    }

    async getUKSActivityById(uksActivityId: number, healthCareId: number) {
        const activity = await this.prismaClient.uKSActivityPlan.findUnique({
            where: {
                id: uksActivityId,
                health_care_id: healthCareId
            },
            include: {
                uks_approval: true,
            }
        });
        return { activity }
    }

    async deleteUKSActivityById(uksActivityId: number, healthCareId: number) {
        const { activity: isActivityExist } = await this.getUKSActivityById(uksActivityId, healthCareId);
        if (!isActivityExist) {
            throw new NotFoundError('Activity not found');
        }


        const deletedActivity = await this.prismaClient.uKSActivityPlan.delete({
            where: {
                id: uksActivityId,
                health_care_id: healthCareId
            },
        });

        return {
            deletedActivity
        }
    }

    async getUKSActivities(healthCareId: number) {
        const activities = await this.prismaClient.uKSActivityPlan.findMany({
            where: {
                health_care_id: healthCareId
            },
            include: {
                uks_approval: true
            }
        });

        return { activities };
    }
};
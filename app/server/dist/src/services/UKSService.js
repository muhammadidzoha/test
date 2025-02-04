"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UKSService = void 0;
const exception_1 = require("../common/exception");
const FormatDate_1 = require("../common/utils/FormatDate");
class UKSService {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    addBook(healthCareId, createdBy, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield this.prismaClient.uKSBook.create({
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
        });
    }
    getBooks(healthCareId) {
        return __awaiter(this, void 0, void 0, function* () {
            const books = yield this.prismaClient.uKSBook.findMany({
                where: {
                    health_care_id: healthCareId
                }
            });
            return { books };
        });
    }
    deleteBookOwnedByHealthCare(healthCareId, bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { book: isBookExists } = yield this.getbookOwnedByHealthCare(healthCareId, bookId);
            if (!isBookExists) {
                throw new exception_1.NotFoundError('Book not found');
            }
            const book = yield this.prismaClient.uKSBook.delete({
                where: {
                    id: bookId,
                    health_care_id: healthCareId
                }
            });
            return { book };
        });
    }
    getbookOwnedByHealthCare(healthCareId, bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield this.prismaClient.uKSBook.findFirst({
                where: {
                    id: bookId,
                    health_care_id: healthCareId
                }
            });
            return { book };
        });
    }
    updateBookOwnedByHealthCare(healthCareId, bookId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { book: isBookExists } = yield this.getbookOwnedByHealthCare(healthCareId, bookId);
            if (!isBookExists) {
                throw new exception_1.NotFoundError('Book not found');
            }
            const book = yield this.prismaClient.uKSBook.update({
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
        });
    }
    createActivityPlan(activityPlanPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log({ formattedDate: (0, FormatDate_1.FormatDate)(activityPlanPayload.schedule) });
            return this.prismaClient.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const activityPlan = yield prisma.uKSActivityPlan.create({
                    data: {
                        title: activityPlanPayload.title,
                        description: activityPlanPayload.description,
                        schedule: activityPlanPayload.schedule,
                        budget: (_a = activityPlanPayload.budget) !== null && _a !== void 0 ? _a : 0,
                        status: activityPlanPayload.status,
                        atached_document: activityPlanPayload.atachedDocument,
                        created_by: activityPlanPayload.createdBy,
                        updated_by: activityPlanPayload.createdBy,
                        health_care_id: activityPlanPayload.healthCareId
                    }
                });
                const activityApproval = yield prisma.uKSActivityApproval.create({
                    data: {
                        status: 'PENDING',
                        comment: '',
                        activity_plan_id: activityPlan.id
                    }
                });
                return { activityPlan, activityApproval };
            }));
        });
    }
    getUKSActivityById(uksActivityId, healthCareId) {
        return __awaiter(this, void 0, void 0, function* () {
            const activity = yield this.prismaClient.uKSActivityPlan.findUnique({
                where: {
                    id: uksActivityId,
                    health_care_id: healthCareId
                },
                include: {
                    uks_approval: true,
                }
            });
            return { activity };
        });
    }
    deleteUKSActivityById(uksActivityId, healthCareId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { activity: isActivityExist } = yield this.getUKSActivityById(uksActivityId, healthCareId);
            if (!isActivityExist) {
                throw new exception_1.NotFoundError('Activity not found');
            }
            const deletedActivity = yield this.prismaClient.uKSActivityPlan.delete({
                where: {
                    id: uksActivityId,
                    health_care_id: healthCareId
                },
            });
            return {
                deletedActivity
            };
        });
    }
    getUKSActivities(healthCareId) {
        return __awaiter(this, void 0, void 0, function* () {
            const activities = yield this.prismaClient.uKSActivityPlan.findMany({
                where: {
                    health_care_id: healthCareId
                },
                include: {
                    uks_approval: true,
                    uks_assigned: true
                }
            });
            return { activities };
        });
    }
    updateActivityPlanApproval(uksActivityId, healthCareId, approvalPayload, approvedBy) {
        return __awaiter(this, void 0, void 0, function* () {
            const { activity: isActivityExist } = yield this.getUKSActivityById(uksActivityId, healthCareId);
            if (!isActivityExist) {
                throw new exception_1.NotFoundError('Activity not found');
            }
            console.log({ approveStatus: approvalPayload.status, approvalPayload: approvalPayload.status === "APPROVED" ? "APPROVED" : approvalPayload.status === "REJECTED" ? "REJECTED" : "DRAFT" });
            const updatedApprovalStatus = yield this.prismaClient.uKSActivityPlan.update({
                where: {
                    id: uksActivityId
                },
                data: {
                    status: approvalPayload.status === "APPROVED" ? "APPROVED" : approvalPayload.status === "REJECTED" ? "REJECTED" : "DRAFT",
                    uks_approval: {
                        update: {
                            status: approvalPayload.status,
                            comment: approvalPayload.comment,
                            approved_by: approvedBy
                        }
                    },
                },
                include: {
                    uks_approval: {
                        select: {
                            status: true,
                            comment: true,
                            user: true
                        },
                    },
                }
            });
            return {
                activityPlan: updatedApprovalStatus
            };
        });
    }
    addActivityPlanAssignee(uksActivityId, healthCareId, assigneeId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { activity: isActivityExist } = yield this.getUKSActivityById(uksActivityId, healthCareId);
            if (!isActivityExist) {
                throw new exception_1.NotFoundError('Activity not found');
            }
            const assignee = yield this.prismaClient.uKSActivityAssigned.create({
                data: {
                    activity_plan_id: uksActivityId,
                    assigned_to: assigneeId,
                    title: payload.title,
                    job_description: payload.description,
                    progress: (_a = payload.progress) !== null && _a !== void 0 ? _a : 'NOT_STARTED'
                },
                include: {
                    activity_plan: true,
                    health_care_member: true
                }
            });
            return { assignee };
        });
    }
    getActivityPlanAssignee(uksActivityId, healthCareId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { activity: isActivityExist } = yield this.getUKSActivityById(uksActivityId, healthCareId);
            if (!isActivityExist) {
                throw new exception_1.NotFoundError('Activity not found');
            }
            const assignees = yield this.prismaClient.uKSActivityAssigned.findMany({
                where: {
                    activity_plan_id: uksActivityId
                },
                include: {
                    activity_plan: true,
                    health_care_member: true
                }
            });
            return { assignees };
        });
    }
}
exports.UKSService = UKSService;
;

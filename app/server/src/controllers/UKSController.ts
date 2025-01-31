import { Request, Response } from "express";
import { UKSService } from "../services/UKSService";
import { handleError, validatePayload } from "../common/http";
import { addBookSchema, createActivityPlanSchema, createKIEArticleSchema, updateApprovalSchema } from "../common/http/requestvalidator/UKSValidator";
import { InvariantError, NotFoundError } from "../common/exception";
import { IBookUKS, ICreatePlan } from "../types/uks";
import fs from 'fs';

export class UKSController {
    constructor(public UKSService: UKSService) {

    }

    async addBook(req: Request, res: Response) {
        try {
            validatePayload(addBookSchema, req.body);
            const { healthCareId } = req.params;
            if (!healthCareId) {
                throw new InvariantError('Health care id is required in params');
            }

            const { thumbnail, file } = req.files as any;
            console.log({ thumbnail, file })

            const user = (req as any).user;
            const payload: IBookUKS = req.body;

            const { book } = await this.UKSService.addBook(+healthCareId, user.id, {
                ...payload,
                thumbnailUrl: thumbnail[0].filename,
                fileUrl: file[0].filename
            });

            res.status(201).json({
                status: 'Success',
                message: 'Book added successfully',
                data: book
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getBooks(req: Request, res: Response) {
        try {
            const { healthCareId } = req.params;
            if (!healthCareId) {
                throw new InvariantError('Health care id is required in params');
            }
            const { books } = await this.UKSService.getBooks(+healthCareId);

            res.status(200).json({
                status: 'Success',
                message: 'Books fetched successfully',
                data: books
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async deleteBook(req: Request, res: Response) {
        try {
            const { healthCareId, bookId } = req.params;
            if (!healthCareId || !bookId) {
                throw new InvariantError('Health care id and book id is required in params');
            }

            const { book } = await this.UKSService.deleteBookOwnedByHealthCare(+healthCareId, +bookId);

            res.status(200).json({
                status: 'Success',
                message: `Book with id ${bookId} deleted successfully`,
                data: book
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getBookOwnedByHealthCare(req: Request, res: Response) {
        try {
            const { healthCareId, bookId } = req.params;

            if (!healthCareId || !bookId) {
                throw new InvariantError('Health care id and book id is required in params');
            }

            const { book } = await this.UKSService.getbookOwnedByHealthCare(+healthCareId, +bookId);

            if (!book) {
                throw new NotFoundError(`Book with id ${bookId} not found`);
            }

            res.status(200).json({
                status: 'Success',
                message: `Book with id ${bookId} fetched successfully`,
                data: book
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async updateBookOwnedByHealthCare(req: Request, res: Response) {
        try {
            validatePayload(addBookSchema, req.body);
            const { healthCareId, bookId } = req.params;
            if (!healthCareId || !bookId) {
                throw new InvariantError('Health care id and book id is required in params');
            }
            const user = (req as any).user;
            const { thumbnail, file } = req.files as any;
            const { book: oldBookData } = await this.UKSService.getbookOwnedByHealthCare(+healthCareId, +bookId);
            const isThumbnailExists = fs.existsSync('uploads/' + oldBookData!.thumbnail_url);
            const isFileExists = fs.existsSync(`uploads/${oldBookData!.file_url}`);
            const { book } = await this.UKSService.updateBookOwnedByHealthCare(+healthCareId, +bookId, {
                description: req.body.description,
                fileUrl: file[0].filename ?? oldBookData!.file_url,
                name: req.body.name,
                thumbnailUrl: thumbnail[0].filename ?? oldBookData!.thumbnail_url,
                updatedBy: user.id
            });
            if (isThumbnailExists) {
                fs.unlinkSync(`uploads/${oldBookData!.thumbnail_url}`)
            }
            if (isFileExists) {
                fs.unlinkSync(`uploads/${oldBookData!.file_url}`)
            }


            res.status(200).json({
                status: 'Success',
                message: `Book with id ${bookId} updated successfully`,
                data: book
            })

        } catch (err: any) {
            handleError(err, res);
        }
    }

    async createActivityPlan(req: Request, res: Response) {
        try {
            validatePayload(createActivityPlanSchema, req.body);
            const { healthCareId } = req.params;
            if (!healthCareId) {
                throw new InvariantError('Health care id is required in params');
            };

            const user = (req as any).user;
            const file = req.file;
            const payload: ICreatePlan = req.body;
            console.log({ date: payload.schedule, dateObject: new Date(payload.schedule) });

            const { activityPlan, activityApproval } = await this.UKSService.createActivityPlan({
                title: payload.title,
                budget: payload.budget,
                description: payload.description,
                atachedDocument: file?.filename ?? null,
                healthCareId: +healthCareId,
                status: payload.status,
                schedule: new Date(payload.schedule),
                createdBy: user.id,
            })
            res.status(201).json({
                status: 'Success',
                message: 'Activity plan created successfully',
                data: {
                    activityPlan,
                    activityApproval
                }
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async deleteActivityPlanById(req: Request, res: Response) {
        try {
            const { healthCareId, activityPlanId } = req.params;
            if (!healthCareId || !activityPlanId) {
                throw new InvariantError('Health care id and activity plan id is required in params');
            }
            const { deletedActivity } = await this.UKSService.deleteUKSActivityById(+activityPlanId, +healthCareId);

            res.status(200).json({
                status: 'Success',
                message: `Activity plan with id ${activityPlanId} deleted successfully`,
                data: deletedActivity
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getActivityPlanById(req: Request, res: Response) {
        try {
            const { healthCareId, activityPlanId } = req.params;
            if (!healthCareId || !activityPlanId) {
                throw new InvariantError('Health care id is required in params');
            }

            const { activity } = await this.UKSService.getUKSActivityById(+activityPlanId, +healthCareId);

            res.status(200).json({
                status: 'Success',
                message: 'Activities fetched successfully',
                data: activity
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getActivityPlans(req: Request, res: Response) {
        try {
            const { healthCareId } = req.params;
            if (!healthCareId) {
                throw new InvariantError('Health care id is required in params');
            }

            const { activities } = await this.UKSService.getUKSActivities(+healthCareId);

            res.status(200).json({
                status: 'Success',
                message: 'Activities fetched successfully',
                data: activities
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async updateActivityPlanApproval(req: Request, res: Response) {
        try {
            validatePayload(updateApprovalSchema, req.body);
            const { healthCareId, activityPlanId } = req.params;
            const { status, comment } = req.body;
            const user = (req as any).user;
            const { activityPlan } = await this.UKSService.updateActivityPlanApproval(+activityPlanId, +healthCareId, { status, comment }, user.id)
            res.status(200).json({
                status: 'Success',
                message: `Activity plan with id ${activityPlanId} updated successfully`,
                data: activityPlan
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }
}
import { Request, Response } from "express";
import { handleError, validatePayload } from "../common/http";
import { HealthCenterService } from "../services/HealthCenterService";
import { NotFoundError } from "../common/exception";
import { createSchoolSchema } from "../common/http/requestvalidator/SchoolValidator";

export class HealthCenterController {
    constructor(public healthCenterService: HealthCenterService) {

    }

    async getAllHealthCenter(req: Request, res: Response) {
        try {
            const { healthCenter } = await this.healthCenterService.getAllHealthCenter();
            res.status(200).json({
                status: 'Success',
                message: 'Health Center fetched successfully',
                data: healthCenter
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }


    async getHealthCenterById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new Error('Health Center ID is required');
            }
            const { healthCenter } = await this.healthCenterService.getHealthCenterById(+id);
            if (!healthCenter) {
                throw new NotFoundError('Health Center not found');
            }
            res.status(200).json({
                status: 'Success',
                message: 'Health Center fetched successfully',
                data: healthCenter
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async updateHealthCenter(req: Request, res: Response) {
        try {
            validatePayload(createSchoolSchema, req.body);
            const { id } = req.params;
            if (!id) {
                throw new Error('Health Center ID is required');
            }
            const payload = req.body;
            const { updatedHealthCenter } = await this.healthCenterService.updateHealthCenter(+id, payload);
            res.status(200).json({
                status: 'Success',
                message: 'Health Center updated successfully',
                data: updatedHealthCenter
            })
        } catch (err: any) {
            handleError(err, res)
        }
    }
}
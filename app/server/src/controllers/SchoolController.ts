import { Request, Response } from "express";
import { SchoolService } from "../services/SchoolService";
import { handleError, validatePayload } from "../common/http";
import { HealthEducationSchema } from "../common/http/requestvalidator/HealthEducationValidator";
import { IHealthEducation, IHealthServicePayload } from "../types/school";
import { InvariantError } from "../common/exception";
import { HealthServiceSchema } from "../common/http/requestvalidator/HealthServiceValidator";

export class SchoolController {
    constructor(public schoolService: SchoolService) { }

    async createOrUpdateHealthEducation(req: Request, res: Response) {
        try {
            validatePayload(HealthEducationSchema, req.body);
            const { schoolId } = req.params;
            if (!schoolId) {
                throw new InvariantError('School Id is required in Parameter');
            }

            const reqPayload: IHealthEducation = req.body;
            console.log({ reqPayload });


            const { healthEducation } = await this.schoolService.createOrUpdateHealthEducation(+schoolId, reqPayload);

            res.status(201).json({
                status: 'Success',
                message: `Health Education for School ${schoolId} is Created or Updated`,
                data: healthEducation
            })
        } catch (err) {
            handleError(err, res);
        }
    }

    async createOrUpdateHealthService(req: Request, res: Response) {
        try {
            validatePayload(HealthServiceSchema, req.body);
            const { schoolId } = req.params;
            if (!schoolId) {
                throw new InvariantError('School Id is required in Parameter');
            }

            const payload: IHealthServicePayload = req.body;
            const { healthService } = await this.schoolService.createOrUpdateHealthServices(+schoolId, payload);
            res.status(201).json({
                status: 'Success',
                message: `Health Service for School ${schoolId} is Created or Updated`,
                data: healthService
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

};
import { Request, Response } from "express";
import { SchoolService } from "../services/SchoolService";
import { handleError, validatePayload } from "../common/http";
import { HealthEducationSchema } from "../common/http/requestvalidator/HealthEducationValidator";
import { IHealthEducation } from "../types/school";
import { InvariantError } from "../common/exception";

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
                message: `Health Education for School ${schoolId} is Created`,
                data: healthEducation
            })
        } catch (err) {
            handleError(err, res);
        }
    }
};
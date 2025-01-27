import { Request, Response } from "express";
import { SchoolService } from "../services/SchoolService";
import { handleError, validatePayload } from "../common/http";
import { HealthEducationSchema } from "../common/http/requestvalidator/HealthEducationValidator";
import { IHealthCare, IHealthEducation, IHealthServicePayload } from "../types/school";
import { InvariantError } from "../common/exception";
import { HealthServiceSchema } from "../common/http/requestvalidator/HealthServiceValidator";
import { schoolEnvironmentSchema } from "../common/http/requestvalidator/SchoolEnvironmentValidator";
import { addHealthCareMemberSchema, CreateHealthCareSchema } from "../common/http/requestvalidator/HealhCareValidator";

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


    async createOrUpdateSchoolEnvironment(req: Request, res: Response) {
        try {
            validatePayload(schoolEnvironmentSchema, req.body);
            const { schoolId } = req.params;
            if (!schoolId) {
                throw new InvariantError('School Id is required in Parameter');
            }

            const payload = req.body;
            const { schoolEnvironment } = await this.schoolService.createOrUpdateSchoolEnvironment(+schoolId, payload);
            res.status(201).json({
                status: 'Success',
                message: `School Environment for School ${schoolId} is Created or Updated`,
                data: schoolEnvironment
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async createOrUpdateHealthCare(req: Request, res: Response) {
        try {
            validatePayload(CreateHealthCareSchema, req.body);
            const { schoolId } = req.params;
            if (!schoolId) {
                throw new InvariantError('School Id is required in Parameter');
            }
            const user = (req as any).user;
            const payload: IHealthCare = req.body

            const { healthCare } = await this.schoolService.createOrUpdateHealthCare(+schoolId, payload, user.email);
            res.status(201).json({
                status: 'Success',
                message: `Health Care for School ${schoolId} is Created or Updated`,
                data: healthCare
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async addHealthCareMember(req: Request, res: Response) {
        try {
            validatePayload(addHealthCareMemberSchema, req.body);
            const { healthCareId } = req.params;
            if (!healthCareId) {
                throw new InvariantError('School Id and Health Care Id is required in Parameter');
            }

            const { name, positionId, userId } = req.body;
            const { healthCareMember } = await this.schoolService.addHealthCareMember({ healthCareId: +healthCareId, name, positionId, userId });

            res.status(201).json({
                status: 'Success',
                message: 'Health Care Member is added',
                data: healthCareMember
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }
};
import { Request, Response } from "express";
import { SchoolService } from "../services/SchoolService";
import { handleError, validatePayload } from "../common/http";
import { HealthEducationSchema } from "../common/http/requestvalidator/HealthEducationValidator";
import { IFacility, IHealthCare, IHealthEducation, IHealthServicePayload } from "../types/school";
import { InvariantError, NotFoundError } from "../common/exception";
import { HealthServiceSchema } from "../common/http/requestvalidator/HealthServiceValidator";
import { schoolEnvironmentSchema } from "../common/http/requestvalidator/SchoolEnvironmentValidator";
import { addHealthCareMemberSchema, CreateHealthCareSchema } from "../common/http/requestvalidator/HealhCareValidator";
import { createFacilitySchema, createSchoolSchema, createUKSQuisionerSchema } from "../common/http/requestvalidator/SchoolValidator";

export class SchoolController {
    constructor(public schoolService: SchoolService) { }

    async createOrUpdateHealthEducation(req: Request, res: Response) {
        try {
            validatePayload(HealthEducationSchema, req.body);
            const { schoolId } = req.params;
            if (!schoolId) {
                throw new InvariantError('School Id is required in Parameter');
            }

            console.log({ schoolId });

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

    async createFacility(req: Request, res: Response) {
        try {
            validatePayload(createFacilitySchema, req.body);
            const { schoolId } = req.params;
            const payload: IFacility & { facilityTypeId: number } = req.body;

            const { facility } = await this.schoolService.createFacility(+schoolId, payload, +payload.facilityTypeId);

            res.status(201).json({
                status: 'Success',
                message: 'Facility is created',
                data: facility
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getFacilityOwnedBySchool(req: Request, res: Response) {
        try {
            const { schoolId } = req.params;
            if (!schoolId) {
                throw new InvariantError('School Id is required in Parameter');
            };

            const { facilities } = await this.schoolService.getFacilityBySchoolId(+schoolId);

            res.status(200).json({
                status: 'Success',
                message: 'Facilities owned by School',
                data: facilities
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getFacilityById(req: Request, res: Response) {
        try {
            const { facilityId, schoolId } = req.params;
            if (!facilityId || !schoolId) {
                throw new InvariantError('Facility Id is required in Parameter');
            }
            const { facility } = await this.schoolService.getFacilityById(+facilityId, +schoolId);
            res.status(200).json({
                status: 'Success',
                message: 'Facility Data',
                data: facility
            });

        } catch (err: any) {
            handleError(err, res);
        }
    }

    async deleteFacility(req: Request, res: Response) {
        try {
            const { facilityId, schoolId } = req.params;
            if (!facilityId) {
                throw new InvariantError('Facility Id is required in Parameter');
            }
            const { facility } = await this.schoolService.deleteFacility(+facilityId, +schoolId);
            res.status(200).json({
                status: 'Success',
                message: 'Facility is deleted',
                data: facility
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async updateFacility(req: Request, res: Response) {
        try {
            validatePayload(createFacilitySchema, req.body)
            const { schoolId, facilityId } = req.params;
            if (!schoolId || !facilityId) {
                throw new InvariantError('School Id and Facility Id is required in Parameter');
            }
            const payload: IFacility & { facilityTypeId: number } = req.body;
            const { facility } = await this.schoolService.updateFacility(+facilityId, payload, +schoolId);
            res.status(200).json({
                status: 'Success',
                message: 'Facility is updated',
                data: facility
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getHealthCareBySchoolId(req: Request, res: Response) {
        try {
            const { schoolId } = req.params;
            if (!schoolId) {
                throw new InvariantError('School Id is required in Parameter');
            }
            const { healthCare } = await this.schoolService.getHealthCareBySchoolId(+schoolId);
            res.status(200).json({
                status: 'Success',
                message: 'Health Care Data',
                data: healthCare
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getHealthServiceBySchoolId(req: Request, res: Response) {
        try {
            const { schoolId } = req.params;
            if (!schoolId) {
                throw new InvariantError('School Id is required in Parameter');
            }
            const { healthService } = await this.schoolService.getHealthService(+schoolId);
            res.status(200).json({
                status: 'Success',
                message: 'Health Service Data',
                data: healthService
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async schoolEnvironment(req: Request, res: Response) {
        try {
            const { schoolId } = req.params;
            if (!schoolId) {
                throw new InvariantError('School Id is required in Parameter');
            }
            const { schoolEnvironment } = await this.schoolService.getSchoolEnvironment(+schoolId);
            res.status(200).json({
                status: 'Success',
                message: 'School Environment Data',
                data: schoolEnvironment
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async createOrUpdateUKSManagementQuisioner(req: Request, res: Response) {
        try {
            validatePayload(createUKSQuisionerSchema, req.body);
            const { schoolId } = req.params;
            if (!schoolId) {
                throw new InvariantError('School Id is required in Parameter');
            }
            const { uksQuisioner } = await this.schoolService.createOrUpdateUKSQuisioner(+schoolId, req.body);
            res.status(201).json({
                status: 'Success',
                message: 'UKS Management Data is Created or Updated',
                data: uksQuisioner
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getUKSManagementQuisioner(req: Request, res: Response) {
        try {
            const { schoolId } = req.params;
            if (!schoolId) {
                throw new InvariantError('School Id is required in Parameter');
            }
            const { uksQuisioner } = await this.schoolService.getUKSQuisioner(+schoolId);
            res.status(200).json({
                status: 'Success',
                message: 'UKS Management Data',
                data: uksQuisioner
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getAllSchoolStratification(req: Request, res: Response) {
        try {
            const { schoolId } = req.params;
            if (!schoolId) {
                throw new InvariantError('School Id is required in Parameter');
            }
            const { schoolStratification } = await this.schoolService.getSchoolStratifications(+schoolId);

            res.status(200).json({
                status: 'Success',
                message: 'School Stratification Data',
                data: schoolStratification
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getStudentLatestNutrition(req: Request, res: Response) {
        try {
            const { schoolId } = req.params;
            if (!schoolId) {
                throw new InvariantError('School Id is required in Parameter');
            }
            const { studentNutritions } = await this.schoolService.getStudentLatestNutrition(+schoolId);
            res.status(200).json({
                status: 'Success',
                message: 'Student Nutrition Data',
                data: studentNutritions
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getSickStudents(req: Request, res: Response) {
        try {
            const { schoolId, nutritionStatusId } = req.params;
            if (!schoolId || !nutritionStatusId) {
                throw new InvariantError('School Id is required in Parameter');
            }
            const { students } = await this.schoolService.getStudentWithNutritionStatus(+schoolId, +nutritionStatusId);
            res.status(200).json({
                status: 'Success',
                message: 'Sick Student Data',
                data: students
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getAllSchools(req: Request, res: Response) {
        try {
            const { schools } = await this.schoolService.getAllSchools();
            res.status(200).json({
                status: 'Success',
                message: 'School Data',
                data: schools
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getSchoolById(req: Request, res: Response) {
        try {
            const { schoolId } = req.params;
            if (!schoolId) {
                throw new InvariantError('School Id is required in Parameter');
            }
            const { school } = await this.schoolService.getSchoolById(+schoolId);
            if (!school) {
                throw new NotFoundError('School not found')
            }
            res.status(200).json({
                status: 'Success',
                message: 'School Data',
                data: school
            })
        } catch (err: any) {
            handleError(err, res)
        }
    }

    async updateSchool(req: Request, res: Response) {
        try {
            validatePayload(createSchoolSchema, req.body);
            const { schoolId } = req.params;
            if (!schoolId) {
                throw new InvariantError('School Id is required in Parameter');
            }
            const payload = req.body;
            const { school } = await this.schoolService.updateSchool(+schoolId, payload);
            res.status(200).json({
                status: 'Success',
                message: 'School Data Updated',
                data: school
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }
};
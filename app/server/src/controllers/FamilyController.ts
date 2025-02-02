import { Request, Response } from "express";
import { InvariantError } from "../common/exception";
import { handleError, validatePayload } from "../common/http";
import { addMemberSchema, createFamilySchema } from "../common/http/requestvalidator/FamilyValidator";
import { FamilyService } from "../services/FamilyService";
import { IFamily, IFamilyMember } from "../types/family";

export class FamilyController {
    constructor(public familyService: FamilyService) {
    }

    async createOrUpdateFamily(req: Request, res: Response) {
        try {
            validatePayload(createFamilySchema, req.body);
            const { familyId } = req.params;
            const familyPayload: IFamily = req.body
            const { family } = await this.familyService.createOrUpdateFamily(familyId ? +familyId : undefined, familyPayload);

            res.status(201).json({
                status: 'Success',
                msesage: 'Family created successfully',
                data: family
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async addFamilyMember(req: Request, res: Response) {
        try {
            validatePayload(addMemberSchema, req.body);
            const { familyId } = req.params;
            if (!familyId) {
                throw new InvariantError('Family id is required in params to add member');
            }

            const user = (req as any).user
            const payload: IFamilyMember = req.body;
            const { familyMember } = await this.familyService.addFamilyMember(+familyId, { ...payload, birthDate: new Date(payload.birthDate) }, user.id);

            res.status(201).json({
                status: 'Success',
                message: 'Family member added successfully',
                data: {
                    familyMember: {
                        ...familyMember,
                        job: {
                            ...familyMember.job,
                            income: familyMember.job.income.toString()
                        }
                    }
                }
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getTotalGaji(req: Request, res: Response) {
        try {
            const { familyId } = req.params;
            if (!familyId) {
                throw new InvariantError('Family id is required in params to get total gaji');
            }
            const { umr } = req.query;
            if (!umr) {
                throw new InvariantError('UMR is required in query params to get total gaji');
            }
            const { categoryScore, totalFamily, totalGaji } = await this.familyService.getTotalGajiWithCategory(+familyId, +umr);
            res.status(200).json({
                status: 'Success',
                message: 'Total gaji fetched successfully',
                data: {
                    totalGaji,
                    totalFamily,
                    score: categoryScore
                }
            })
        } catch (err: any) {
            handleError(err, res);
        }

    }

    async getWageScoreOfFamilyMember(req: Request, res: Response) {
        try {
            const { familyId, familyMemberId } = req.params;
            if (!familyId || !familyMemberId) {
                throw new InvariantError('Family id and family member id is required in params to get wage score');
            }
            const { umr } = req.query;
            if (!umr) {
                throw new InvariantError('UMR is required in query params to get wage score');
            }
            const { job, jobScore, wage, wageScore, familyMember } = await this.familyService.getWageScoreOfFamilyMember(+familyId, +familyMemberId, +umr);
            res.status(200).json({
                status: 'Success',
                message: 'Wage score fetched successfully',
                data: {
                    familyMember,
                    wage,
                    wageScore,
                    job,
                    jobScore
                }
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }


}
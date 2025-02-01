import { Request, Response } from "express";
import { InterventionService } from "../services/InterventionService";
import { handleError, validatePayload } from "../common/http";
import { InvariantError } from "../common/exception";
import { createInterventionSchema } from "../common/http/requestvalidator/InterventionValidator";

export class InterventionController {
    constructor(public interventionService: InterventionService) {

    }

    async createIntervention(req: Request, res: Response) {
        try {
            validatePayload(createInterventionSchema, req.body);
            const { memberId, institutionId } = req.params;
            if (!memberId || !institutionId) {
                throw new InvariantError("Member ID and Institution ID must be provided");
            }
            const payload = req.body;
            const user = (req as any).user
            console.log({ payload, memberId, institutionId })

            const { intervention } = await this.interventionService.createIntervention({
                createdBy: user.id,
                familyMemberId: +memberId,
                instituonId: +institutionId,
                recommendation: payload.recommendation,
                programRecommendation: payload.programRecommendation
            })

            res.status(201).json({
                status: 'Success',
                message: 'Intervention created successfully',
                data: intervention
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getInterventionsBelongToFamily(req: Request, res: Response) {
        try {
            const { institutionId, familyId } = req.params;
            if (!institutionId || !familyId) {
                throw new InvariantError("Institution ID and Family ID must be provided");
            }

            const { interventions } = await this.interventionService.getInterventionsBelongToFamily(+institutionId, +familyId);

            res.status(200).json({
                status: 'Success',
                message: 'Interventions fetched successfully',
                data: interventions
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getInterventionsBelongToInstitution(req: Request, res: Response) {
        try {
            const { institutionId } = req.params;
            if (!institutionId) {
                throw new InvariantError("Institution ID must be provided");
            }

            const { interventions } = await this.interventionService.getInterventionsBelongToInstitution(+institutionId);

            res.status(200).json({
                status: 'Success',
                message: 'Interventions fetched successfully',
                data: interventions
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getInterventionById(req: Request, res: Response) {
        try {
            const { interventionId } = req.params;
            if (!interventionId) {
                throw new InvariantError("Intervention ID must be provided");
            }

            const { intervention } = await this.interventionService.getInterventionById(+interventionId);

            res.status(200).json({
                status: 'Success',
                message: 'Intervention fetched successfully',
                data: intervention
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }
};

import { Request, Response } from "express";
import { handleError, validatePayload } from "../common/http";
import { createFamilySchema } from "../common/http/requestvalidator/FamilyValidator";
import { FamilyService } from "../services/FamilyService";
import { IFamily } from "../types/family";

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


}
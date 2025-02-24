import { handleError } from "../common/http";
import { InstitutionService } from "../services/InstitutionService";
import { Request, Response } from "express";

export class InstitutionController {
  constructor(private institutionService: InstitutionService) {}

  async getAllInstitutions(req: Request, res: Response) {
    try {
      const { institutions } = await this.institutionService.getInstitutions();
      res.status(200).json({
        status: "success",
        message: "Institutions Retrieved",
        data: institutions,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getAllHealthCares(req: Request, res: Response) {
    try {
      const { healthCares } = await this.institutionService.getHealthCares();
      res.status(200).json({
        status: "success",
        message: "Institutions Retrieved",
        data: healthCares,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }
}

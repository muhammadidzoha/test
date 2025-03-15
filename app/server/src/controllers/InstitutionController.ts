import { InvariantError } from "../common/exception";
import { handleError, validatePayload } from "../common/http";
import { createInstitutionSchema } from "../common/http/requestvalidator/InstitutionValidator";
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

  async createInstitution(req: Request, res: Response) {
    try {
      validatePayload(createInstitutionSchema, req.body);
      const {
        name,
        address,
        phoneNumber,
        email,
        headName,
        headNip,
        userId,
        institutionType,
      } = req.body;
      const { newInstitution } = await this.institutionService.addInstitution(
        {
          name,
          address,
          phoneNumber,
          email,
          headName,
          headNip,
          userId,
          type: institutionType,
        },
        institutionType
      );

      res.status(201).json({
        status: "Success",
        message: "Institution created",
        data: newInstitution,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async updateInstitution(req: Request, res: Response) {
    try {
      validatePayload(createInstitutionSchema, req.body);
      const { institutionId } = req.params;
      if (!institutionId) {
        throw new InvariantError("institutionId is required in params");
      }
      const {
        name,
        address,
        phoneNumber,
        email,
        headName,
        headNip,
        userId,
        institutionType,
      } = req.body;
      const { updatedInstitution } =
        await this.institutionService.updateInstitution(
          +institutionId,
          institutionType,
          {
            name,
            address,
            phoneNumber,
            email,
            headName,
            headNIP: headNip,
            userId,
          }
        );

      res.status(201).json({
        status: "Success",
        message: "Institution updated",
        data: updatedInstitution,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getInstitutionById(req: Request, res: Response) {
    try {
      const { institutionId } = req.params;
      if (!institutionId) {
        throw new InvariantError("InstitutionId is required in params");
      }
      const { institution } =
        await this.institutionService.getOnlyInstitutionById(+institutionId);

      res.status(200).json({
        status: "Success",
        message: "Institution Retrieved",
        data: institution,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async deleteInstitutionById(req: Request, res: Response) {
    try {
      const { institutionId } = req.params;
      if (!institutionId) {
        throw new InvariantError("Institution id is required in params");
      }
      const { deletedInstitution } =
        await this.institutionService.deleteInstitutionById(+institutionId);

      res.status(200).json({
        status: "Success",
        message: "Institution deleted",
        data: deletedInstitution,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }
}

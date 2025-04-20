import express, { Request, Response } from "express";
import { schoolRouter } from "./SchoolRouter";
import { AuthorizationMiddleware } from "../middlewares/AuthorizationMiddleware";
import { InstitutionService } from "../services/InstitutionService";
import { prismaDBClient } from "../../config/prisma";
import { InstitutionController } from "../controllers/InstitutionController";

const institutionService = new InstitutionService(prismaDBClient);
const institutionController = new InstitutionController(institutionService);

export const institutionRouter = express.Router();

institutionRouter.use("/schools", schoolRouter);

institutionRouter.get(
  "/",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    institutionController.getAllInstitutions(req, res);
  }
);

institutionRouter.get(
  "/health-cares",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    institutionController.getAllHealthCares(req, res);
  }
);

institutionRouter.get(
  "/:institutionId",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    institutionController.getInstitutionById(req, res);
  }
);

institutionRouter.post(
  "/",
  AuthorizationMiddleware(["admin"]),
  (req: Request, res: Response) => {
    institutionController.createInstitution(req, res);
  }
);

institutionRouter.put(
  "/:institutionId",
  AuthorizationMiddleware(["admin"]),
  (req: Request, res: Response) => {
    institutionController.updateInstitution(req, res);
  }
);

institutionRouter.delete(
  "/:institutionId",
  AuthorizationMiddleware(["admin"]),
  (req: Request, res: Response) => {
    institutionController.deleteInstitutionById(req, res);
  }
);

institutionRouter.post(
  "/without-account",
  AuthorizationMiddleware(["admin"]),
  (req: Request, res: Response) => {
    institutionController.addInstitution(req, res);
  }
);

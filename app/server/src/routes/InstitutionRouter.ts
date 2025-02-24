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
  AuthorizationMiddleware(["admin"]),
  (req: Request, res: Response) => {
    institutionController.getAllInstitutions(req, res);
  }
);

institutionRouter.get(
  "/health-cares",
  AuthorizationMiddleware(["admin"]),
  (req: Request, res: Response) => {
    institutionController.getAllHealthCares(req, res);
  }
);

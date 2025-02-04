import { QuisionerService } from "../services/QuisionerService";
import { QuisionerController } from "../controllers/QuisionerController";
import { AuthorizationMiddleware } from "../middlewares/AuthorizationMiddleware";
import express, { Request, Response } from 'express';
import { prismaDBClient } from "../../config/prisma";

const quisionerService = new QuisionerService(prismaDBClient);
const quisionerController = new QuisionerController(quisionerService);

export const quisionerRouter = express.Router();

quisionerRouter.get('/:quisionerId', AuthorizationMiddleware([]), (req: Request, res: Response) => {
    quisionerController.getQuisionerById(req, res);
})

quisionerRouter.post('/', AuthorizationMiddleware(['admin']), (req: Request, res: Response) => {
    quisionerController.createQuisioner(req, res);
})

quisionerRouter.delete('/:quisionerId', AuthorizationMiddleware(['admin']), (req: Request, res: Response) => {
    quisionerController.deleteQuisionerById(req, res);
})
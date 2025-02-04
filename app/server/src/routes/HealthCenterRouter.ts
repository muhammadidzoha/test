import express, { Request, Response } from 'express';
import { HealthCenterService } from '../services/HealthCenterService';
import { HealthCenterController } from '../controllers/HealthCenterController';
import { prismaDBClient } from '../../config/prisma';
import { AuthorizationMiddleware } from '../middlewares/AuthorizationMiddleware';

const healthCenterService = new HealthCenterService(prismaDBClient)
const healthCenterController = new HealthCenterController(healthCenterService);

const healthCenterRouter = express.Router();

healthCenterRouter.get('/', AuthorizationMiddleware([]), (req: Request, res: Response) => {
    healthCenterController.getAllHealthCenter(req, res);
})

healthCenterRouter.get('/:id', AuthorizationMiddleware([]), (req: Request, res: Response) => {
    healthCenterController.getHealthCenterById(req, res);
})

healthCenterRouter.put('/:id', AuthorizationMiddleware([]), (req: Request, res: Response) => {
    healthCenterController.updateHealthCenter(req, res);
})
import express, { Request, Response } from 'express';
import { AuthorizationMiddleware } from '../middlewares/AuthorizationMiddleware';
import { InterventionService } from '../services/InterventionService';
import { InterventionController } from '../controllers/InterventionController';
import { prismaDBClient } from '../../config/prisma';

const interventionService = new InterventionService(prismaDBClient);
const interventionController = new InterventionController(interventionService);

export const interventionRouter = express.Router();

interventionRouter.post('/:institutionId/members/:memberId', AuthorizationMiddleware(['admin', 'healthcare']), async (req: Request, res: Response) => {
    interventionController.createIntervention(req, res);
})

interventionRouter.get('/:institutionId/families/:familyId', AuthorizationMiddleware([]), async (req: Request, res: Response) => {
    interventionController.getInterventionsBelongToFamily(req, res);
})

interventionRouter.get('/:institutionId', AuthorizationMiddleware([]), async (req: Request, res: Response) => {
    interventionController.getInterventionsBelongToInstitution(req, res);
})
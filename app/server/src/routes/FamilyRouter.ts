import express, { Request, Response } from 'express';
import { AuthorizationMiddleware } from '../middlewares/AuthorizationMiddleware';
import { FamilyService } from '../services/FamilyService';
import { prismaDBClient } from '../../config/prisma';
import { FamilyController } from '../controllers/FamilyController';

const familyService = new FamilyService(prismaDBClient);

const familyController = new FamilyController(familyService);

export const familyRouter = express.Router();
familyRouter.put('/:familyId?', AuthorizationMiddleware(['admin', 'parent']), (req: Request, res: Response) => {
    familyController.createOrUpdateFamily(req, res);
});

familyRouter.post('/:familyId/members', AuthorizationMiddleware(['admin', 'parent']), (req: Request, res: Response) => {
    familyController.addFamilyMember(req, res);
});

familyRouter.get('/:familyId/wages', AuthorizationMiddleware(['admin', 'parent']), (req: Request, res: Response) => {
    familyController.getTotalGaji(req, res);
})
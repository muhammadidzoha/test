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

familyRouter.post('/:familyId/members', AuthorizationMiddleware([]), (req: Request, res: Response) => {
    familyController.addFamilyMember(req, res);
});

familyRouter.post('/', AuthorizationMiddleware(['admin', 'parent']), (req: Request, res: Response) => {
    familyController.createFamilyWithMembers(req, res);
})

familyRouter.put('/v2/members/:familyId?', AuthorizationMiddleware([]), (req: Request, res: Response) => {
    familyController.AddFamilyMemberV2(req, res);
});

familyRouter.get('/:familyId/wages', AuthorizationMiddleware([]), (req: Request, res: Response) => {
    familyController.getTotalGaji(req, res);
})

familyRouter.get('/:familyId/members/:familyMemberId/wages', AuthorizationMiddleware([]), (req: Request, res: Response) => {
    familyController.getWageScoreOfFamilyMember(req, res);
})

familyRouter.get('/members/:familyMemberId/children', AuthorizationMiddleware([]), (req: Request, res: Response) => {
    familyController.getChildrenScore(req, res);
})

familyRouter.get('/:familyId/members', AuthorizationMiddleware([]), (req: Request, res: Response) => {
    familyController.getFamilyMembers(req, res);
})

familyRouter.get('/:familyId/members/:familyMemberId', AuthorizationMiddleware([]), (req: Request, res: Response) => {
    familyController.getFamilyMember(req, res);
})

familyRouter.get('/head/:headName/members', AuthorizationMiddleware([]), (req: Request, res: Response) => {
    familyController.getFamilyMemberByHeadName(req, res);
})

familyRouter.get('/head/phone/:phoneNumber/members', AuthorizationMiddleware([]), (req: Request, res: Response) => {
    familyController.getFamilyMembersByHeadPhoneNumber(req, res);
});
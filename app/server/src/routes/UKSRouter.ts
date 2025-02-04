import express, { Request, Response } from 'express';
import { UKSService } from '../services/UKSService';
import { UKSController } from '../controllers/UKSController';
import { prismaDBClient } from '../../config/prisma';
import { AuthorizationMiddleware } from '../middlewares/AuthorizationMiddleware';
import { multerMiddleware } from '../middlewares/MulterMiddleware';

const uksService = new UKSService(prismaDBClient);
const uksController = new UKSController(uksService);


export const uksRouter = express.Router();

// uksRouter.post('/:healthCareId/books', AuthorizationMiddleware(['admin', 'school']), multerMiddleware.single('image'), (req: Request, res: Response) => {
//     uksController.addBook(req, res);
// })
uksRouter.post('/:healthCareId/books', AuthorizationMiddleware(['admin', 'school', 'uks']), multerMiddleware.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'file', maxCount: 1 }]), (req: Request, res: Response) => {
    uksController.addBook(req, res);
})

uksRouter.get('/:healthCareId/books', AuthorizationMiddleware(['admin', 'school', 'uks']), (req: Request, res: Response) => {
    uksController.getBooks(req, res);
})

uksRouter.delete('/:healthCareId/books/:bookId', AuthorizationMiddleware(['admin', 'school', 'uks']), (req: Request, res: Response) => {
    uksController.deleteBook(req, res);
})

uksRouter.get('/:healthCareId/books/:bookId', AuthorizationMiddleware(['admin', 'school', 'uks']), (req: Request, res: Response) => {
    uksController.getBookOwnedByHealthCare(req, res);
})

uksRouter.put('/:healthCareId/books/:bookId', AuthorizationMiddleware(['admin', 'school', 'uks']), multerMiddleware.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'file', maxCount: 1 }]), (req: Request, res: Response) => {
    uksController.updateBookOwnedByHealthCare(req, res);
})


// Activity 
uksRouter.post('/:healthCareId/activity-plans', AuthorizationMiddleware(['admin', 'school', 'uks']), multerMiddleware.single('document'), (req: Request, res: Response) => {
    uksController.createActivityPlan(req, res);
});

uksRouter.delete('/:healthCareId/activity-plans/:activityPlanId', AuthorizationMiddleware(['admin', 'school', 'uks']), (req: Request, res: Response) => {
    uksController.deleteActivityPlanById(req, res);
});

uksRouter.get('/:healthCareId/activity-plans/:activityPlanId', AuthorizationMiddleware(['admin', 'school', 'uks', 'healthcare']), (req: Request, res: Response) => {
    uksController.getActivityPlanById(req, res);
})

uksRouter.get('/:healthCareId/activity-plans', AuthorizationMiddleware(['admin', 'school', 'uks', 'healthcare']), (req: Request, res: Response) => {
    uksController.getActivityPlans(req, res);
})

uksRouter.put('/:healthCareId/activity-plans/:activityPlanId/approve', AuthorizationMiddleware(['admin', 'school', 'uks']), (req: Request, res: Response) => {
    uksController.updateActivityPlanApproval(req, res);
})

uksRouter.post('/:healthCareId/activity-plans/:activityPlanId/assignee/:memberId', AuthorizationMiddleware(['admin', 'school', 'uks']), (req: Request, res: Response) => {
    uksController.assignActivityPlan(req, res);
})

uksRouter.get('/:healthCareId/activity-plans/:activityPlanId/assignee', AuthorizationMiddleware(['admin', 'school', 'uks', 'healthcare']), (req: Request, res: Response) => {
    uksController.getActivityPlanAssignee(req, res);
})
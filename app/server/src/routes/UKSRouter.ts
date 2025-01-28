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
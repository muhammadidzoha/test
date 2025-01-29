import express, { Request, Response } from 'express';
import { AuthorizationMiddleware } from '../middlewares/AuthorizationMiddleware';
import { multerMiddleware } from '../middlewares/MulterMiddleware';
import { KIEService } from '../services/KIEService';
import { KIEController } from '../controllers/KIEController';
import { prismaDBClient } from '../../config/prisma';

const kieService = new KIEService(prismaDBClient);
const kieController = new KIEController(kieService);

export const kieRouter = express.Router();

kieRouter.post('/contents/:type', AuthorizationMiddleware(['admin', 'uks', 'school']), multerMiddleware.fields([{ name: 'banner' }, { name: 'thumbnail' }, { name: 'imageUrl' }, { name: 'videoUrl' }]), (req: Request, res: Response) => { kieController.createKIEContent(req, res) });

kieRouter.delete('/contents/:type/:contentId', AuthorizationMiddleware(['admin', 'uks', 'school']), (req, res) => { kieController.deleteKIEContent(req, res) });

kieRouter.get('/contents/:type/:contentId', AuthorizationMiddleware(['admin', 'uks', 'school']), (req, res) => { kieController.getKIEContent(req, res) });

kieRouter.get('/contents/institutions/:schoolId/:type', AuthorizationMiddleware(['admin', 'uks', 'school']), (req, res) => { kieController.getKieContentsOwnedByInstitutionByType(req, res) });

kieRouter.put('/contents/:type/:contentId', AuthorizationMiddleware(['admin', 'uks', 'school']), multerMiddleware.fields([{ name: 'banner' }, { name: 'thumbnail' }, { name: 'imageUrl' }, { name: 'videoUrl' }]), (req, res) => { kieController.updateKIEContent(req, res) });
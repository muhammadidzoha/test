import express from 'express';
import { AuthorizationMiddleware } from '../middlewares/AuthorizationMiddleware';
import { multerMiddleware } from '../middlewares/MulterMiddleware';
import { KIEService } from '../services/KIEService';
import { KIEController } from '../controllers/KIEController';
import { prismaDBClient } from '../../config/prisma';

const kieService = new KIEService(prismaDBClient);
const kieController = new KIEController(kieService);

export const kieRouter = express.Router();

kieRouter.post('/articles', AuthorizationMiddleware(['admin', 'uks', 'school']), multerMiddleware.fields([{ name: 'banner' }, { name: 'thumbnail' }]), (req, res) => { kieController.createKIEArticle(req, res) })

kieRouter.delete('/articles/:articleId', AuthorizationMiddleware(['admin', 'uks', 'school']), (req, res) => { kieController.deleteKIEArticle(req, res) })

kieRouter.get('/articles/:articleId', AuthorizationMiddleware(['admin', 'uks', 'school']), (req, res) => { kieController.getArticleById(req, res) });

kieRouter.get('/:schoolId/articles', AuthorizationMiddleware(['admin', 'uks', 'school']), (req, res) => { kieController.getArticlesOwnedByInstitution(req, res) });

kieRouter.get('/:schoolId/kie-content', AuthorizationMiddleware(['admin', 'uks', 'school']), (req, res) => { kieController.getKIEContents(req, res) });

kieRouter.put('/articles/:articleId', AuthorizationMiddleware(['admin', 'uks', 'school']), multerMiddleware.fields([{ name: 'banner' }, { name: 'thumbnail' }]), (req, res) => { kieController.updateKIEArticle(req, res) });
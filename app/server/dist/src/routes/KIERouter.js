"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kieRouter = void 0;
const express_1 = __importDefault(require("express"));
const AuthorizationMiddleware_1 = require("../middlewares/AuthorizationMiddleware");
const MulterMiddleware_1 = require("../middlewares/MulterMiddleware");
const KIEService_1 = require("../services/KIEService");
const KIEController_1 = require("../controllers/KIEController");
const prisma_1 = require("../../config/prisma");
const kieService = new KIEService_1.KIEService(prisma_1.prismaDBClient);
const kieController = new KIEController_1.KIEController(kieService);
exports.kieRouter = express_1.default.Router();
exports.kieRouter.get('/contents/type/:type/:contentId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)([]), (req, res) => { kieController.getKIEContent(req, res); });
exports.kieRouter.get('/contents/institutions/:schoolId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)([]), (req, res) => { kieController.getKieContentsOwnedByInstitution(req, res); });
exports.kieRouter.get('/contents/institutions/:schoolId/type/:type', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)([]), (req, res) => { kieController.getKieContentsOwnedByInstitutionByType(req, res); });
exports.kieRouter.post('/contents/:type', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'uks', 'school']), MulterMiddleware_1.multerMiddleware.fields([{ name: 'banner' }, { name: 'thumbnail' }, { name: 'image' }, { name: 'video' }]), (req, res) => { kieController.createKIEContent(req, res); });
exports.kieRouter.delete('/contents/:type/:contentId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'uks', 'school']), (req, res) => { kieController.deleteKIEContent(req, res); });
exports.kieRouter.put('/contents/:type/:contentId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'uks', 'school']), MulterMiddleware_1.multerMiddleware.fields([{ name: 'banner' }, { name: 'thumbnail' }, { name: 'imageUrl' }, { name: 'videoUrl' }]), (req, res) => { kieController.updateKIEContent(req, res); });
//  Tags
exports.kieRouter.get('/tags', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)([]), (req, res) => { kieController.getTags(req, res); });
// Type
exports.kieRouter.get('/types', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)([]), (req, res) => { kieController.getTypes(req, res); });

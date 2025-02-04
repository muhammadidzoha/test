"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interventionRouter = void 0;
const express_1 = __importDefault(require("express"));
const AuthorizationMiddleware_1 = require("../middlewares/AuthorizationMiddleware");
const InterventionService_1 = require("../services/InterventionService");
const InterventionController_1 = require("../controllers/InterventionController");
const prisma_1 = require("../../config/prisma");
const interventionService = new InterventionService_1.InterventionService(prisma_1.prismaDBClient);
const interventionController = new InterventionController_1.InterventionController(interventionService);
exports.interventionRouter = express_1.default.Router();
exports.interventionRouter.post('/:institutionId/members/:memberId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'healthcare']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    interventionController.createIntervention(req, res);
}));
exports.interventionRouter.get('/:institutionId/families/:familyId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)([]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    interventionController.getInterventionsBelongToFamily(req, res);
}));
exports.interventionRouter.get('/schools/:schoolId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)([]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    interventionController.getInterventionsBelongToSchool(req, res);
}));
exports.interventionRouter.get('/puskesmas/:institutionId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'healthcare']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    interventionController.getInterventionsBelongToInstitution(req, res);
}));

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uksRouter = void 0;
const express_1 = __importDefault(require("express"));
const UKSService_1 = require("../services/UKSService");
const UKSController_1 = require("../controllers/UKSController");
const prisma_1 = require("../../config/prisma");
const AuthorizationMiddleware_1 = require("../middlewares/AuthorizationMiddleware");
const MulterMiddleware_1 = require("../middlewares/MulterMiddleware");
const uksService = new UKSService_1.UKSService(prisma_1.prismaDBClient);
const uksController = new UKSController_1.UKSController(uksService);
exports.uksRouter = express_1.default.Router();
// uksRouter.post('/:healthCareId/books', AuthorizationMiddleware(['admin', 'school']), multerMiddleware.single('image'), (req: Request, res: Response) => {
//     uksController.addBook(req, res);
// })
exports.uksRouter.post('/:healthCareId/books', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school', 'uks']), MulterMiddleware_1.multerMiddleware.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'file', maxCount: 1 }]), (req, res) => {
    uksController.addBook(req, res);
});
exports.uksRouter.get('/:healthCareId/books', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school', 'uks']), (req, res) => {
    uksController.getBooks(req, res);
});
exports.uksRouter.delete('/:healthCareId/books/:bookId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school', 'uks']), (req, res) => {
    uksController.deleteBook(req, res);
});
exports.uksRouter.get('/:healthCareId/books/:bookId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school', 'uks']), (req, res) => {
    uksController.getBookOwnedByHealthCare(req, res);
});
exports.uksRouter.put('/:healthCareId/books/:bookId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school', 'uks']), MulterMiddleware_1.multerMiddleware.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'file', maxCount: 1 }]), (req, res) => {
    uksController.updateBookOwnedByHealthCare(req, res);
});
// Activity 
exports.uksRouter.post('/:healthCareId/activity-plans', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school', 'uks']), MulterMiddleware_1.multerMiddleware.single('document'), (req, res) => {
    uksController.createActivityPlan(req, res);
});
exports.uksRouter.delete('/:healthCareId/activity-plans/:activityPlanId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school', 'uks']), (req, res) => {
    uksController.deleteActivityPlanById(req, res);
});
exports.uksRouter.get('/:healthCareId/activity-plans/:activityPlanId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school', 'uks', 'healthcare']), (req, res) => {
    uksController.getActivityPlanById(req, res);
});
exports.uksRouter.get('/:healthCareId/activity-plans', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school', 'uks', 'healthcare']), (req, res) => {
    uksController.getActivityPlans(req, res);
});
exports.uksRouter.put('/:healthCareId/activity-plans/:activityPlanId/approve', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school', 'uks']), (req, res) => {
    uksController.updateActivityPlanApproval(req, res);
});
exports.uksRouter.post('/:healthCareId/activity-plans/:activityPlanId/assignee/:memberId', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school', 'uks']), (req, res) => {
    uksController.assignActivityPlan(req, res);
});
exports.uksRouter.get('/:healthCareId/activity-plans/:activityPlanId/assignee', (0, AuthorizationMiddleware_1.AuthorizationMiddleware)(['admin', 'school', 'uks', 'healthcare']), (req, res) => {
    uksController.getActivityPlanAssignee(req, res);
});

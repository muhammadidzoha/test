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
exports.UKSController = void 0;
const http_1 = require("../common/http");
const UKSValidator_1 = require("../common/http/requestvalidator/UKSValidator");
const exception_1 = require("../common/exception");
const fs_1 = __importDefault(require("fs"));
class UKSController {
    constructor(UKSService) {
        this.UKSService = UKSService;
    }
    addBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(UKSValidator_1.addBookSchema, req.body);
                const { healthCareId } = req.params;
                if (!healthCareId) {
                    throw new exception_1.InvariantError('Health care id is required in params');
                }
                const { thumbnail, file } = req.files;
                console.log({ thumbnail, file });
                const user = req.user;
                const payload = req.body;
                const { book } = yield this.UKSService.addBook(+healthCareId, user.id, Object.assign(Object.assign({}, payload), { thumbnailUrl: thumbnail[0].filename, fileUrl: file[0].filename }));
                res.status(201).json({
                    status: 'Success',
                    message: 'Book added successfully',
                    data: book
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getBooks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { healthCareId } = req.params;
                if (!healthCareId) {
                    throw new exception_1.InvariantError('Health care id is required in params');
                }
                const { books } = yield this.UKSService.getBooks(+healthCareId);
                res.status(200).json({
                    status: 'Success',
                    message: 'Books fetched successfully',
                    data: books
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    deleteBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { healthCareId, bookId } = req.params;
                if (!healthCareId || !bookId) {
                    throw new exception_1.InvariantError('Health care id and book id is required in params');
                }
                const { book } = yield this.UKSService.deleteBookOwnedByHealthCare(+healthCareId, +bookId);
                res.status(200).json({
                    status: 'Success',
                    message: `Book with id ${bookId} deleted successfully`,
                    data: book
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getBookOwnedByHealthCare(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { healthCareId, bookId } = req.params;
                if (!healthCareId || !bookId) {
                    throw new exception_1.InvariantError('Health care id and book id is required in params');
                }
                const { book } = yield this.UKSService.getbookOwnedByHealthCare(+healthCareId, +bookId);
                if (!book) {
                    throw new exception_1.NotFoundError(`Book with id ${bookId} not found`);
                }
                res.status(200).json({
                    status: 'Success',
                    message: `Book with id ${bookId} fetched successfully`,
                    data: book
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    updateBookOwnedByHealthCare(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                (0, http_1.validatePayload)(UKSValidator_1.addBookSchema, req.body);
                const { healthCareId, bookId } = req.params;
                if (!healthCareId || !bookId) {
                    throw new exception_1.InvariantError('Health care id and book id is required in params');
                }
                const user = req.user;
                const { thumbnail, file } = req.files;
                const { book: oldBookData } = yield this.UKSService.getbookOwnedByHealthCare(+healthCareId, +bookId);
                const isThumbnailExists = fs_1.default.existsSync('uploads/' + oldBookData.thumbnail_url);
                const isFileExists = fs_1.default.existsSync(`uploads/${oldBookData.file_url}`);
                const { book } = yield this.UKSService.updateBookOwnedByHealthCare(+healthCareId, +bookId, {
                    description: req.body.description,
                    fileUrl: (_a = file[0].filename) !== null && _a !== void 0 ? _a : oldBookData.file_url,
                    name: req.body.name,
                    thumbnailUrl: (_b = thumbnail[0].filename) !== null && _b !== void 0 ? _b : oldBookData.thumbnail_url,
                    updatedBy: user.id
                });
                if (isThumbnailExists) {
                    fs_1.default.unlinkSync(`uploads/${oldBookData.thumbnail_url}`);
                }
                if (isFileExists) {
                    fs_1.default.unlinkSync(`uploads/${oldBookData.file_url}`);
                }
                res.status(200).json({
                    status: 'Success',
                    message: `Book with id ${bookId} updated successfully`,
                    data: book
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    createActivityPlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                (0, http_1.validatePayload)(UKSValidator_1.createActivityPlanSchema, req.body);
                const { healthCareId } = req.params;
                if (!healthCareId) {
                    throw new exception_1.InvariantError('Health care id is required in params');
                }
                ;
                const user = req.user;
                const file = req.file;
                const payload = req.body;
                console.log({ date: payload.schedule, dateObject: new Date(payload.schedule) });
                const { activityPlan, activityApproval } = yield this.UKSService.createActivityPlan({
                    title: payload.title,
                    budget: payload.budget,
                    description: payload.description,
                    atachedDocument: (_a = file === null || file === void 0 ? void 0 : file.filename) !== null && _a !== void 0 ? _a : null,
                    healthCareId: +healthCareId,
                    status: payload.status,
                    schedule: new Date(payload.schedule),
                    createdBy: user.id,
                });
                res.status(201).json({
                    status: 'Success',
                    message: 'Activity plan created successfully',
                    data: {
                        activityPlan,
                        activityApproval
                    }
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    deleteActivityPlanById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { healthCareId, activityPlanId } = req.params;
                if (!healthCareId || !activityPlanId) {
                    throw new exception_1.InvariantError('Health care id and activity plan id is required in params');
                }
                const { deletedActivity } = yield this.UKSService.deleteUKSActivityById(+activityPlanId, +healthCareId);
                res.status(200).json({
                    status: 'Success',
                    message: `Activity plan with id ${activityPlanId} deleted successfully`,
                    data: deletedActivity
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getActivityPlanById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { healthCareId, activityPlanId } = req.params;
                if (!healthCareId || !activityPlanId) {
                    throw new exception_1.InvariantError('Health care id is required in params');
                }
                const { activity } = yield this.UKSService.getUKSActivityById(+activityPlanId, +healthCareId);
                res.status(200).json({
                    status: 'Success',
                    message: 'Activities fetched successfully',
                    data: activity
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getActivityPlans(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { healthCareId } = req.params;
                if (!healthCareId) {
                    throw new exception_1.InvariantError('Health care id is required in params');
                }
                const { activities } = yield this.UKSService.getUKSActivities(+healthCareId);
                res.status(200).json({
                    status: 'Success',
                    message: 'Activities fetched successfully',
                    data: activities
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    updateActivityPlanApproval(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(UKSValidator_1.updateApprovalSchema, req.body);
                const { healthCareId, activityPlanId } = req.params;
                const { status, comment } = req.body;
                const user = req.user;
                const { activityPlan } = yield this.UKSService.updateActivityPlanApproval(+activityPlanId, +healthCareId, { status, comment }, user.id);
                res.status(200).json({
                    status: 'Success',
                    message: `Activity plan with id ${activityPlanId} updated successfully`,
                    data: activityPlan
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    assignActivityPlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(UKSValidator_1.addAssigneeSchema, req.body);
                const { healthCareId, activityPlanId, memberId } = req.params;
                if (!healthCareId || !activityPlanId || !memberId) {
                    throw new exception_1.InvariantError('Health care id, Member Id and activity plan id is required in params');
                }
                const { title, description, progress } = req.body;
                const { assignee } = yield this.UKSService.addActivityPlanAssignee(+activityPlanId, +healthCareId, +memberId, {
                    title,
                    description,
                    progress
                });
                res.status(201).json({
                    status: 'Success',
                    message: `User with id ${memberId} assigned to activity plan with id ${activityPlanId}`,
                    data: assignee
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getActivityPlanAssignee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { healthCareId, activityPlanId } = req.params;
                if (!healthCareId || !activityPlanId) {
                    throw new exception_1.InvariantError('Health care id and activity plan id is required in params');
                }
                const { assignees } = yield this.UKSService.getActivityPlanAssignee(+activityPlanId, +healthCareId);
                res.status(200).json({
                    status: 'Success',
                    message: 'Assignees fetched successfully',
                    data: assignees
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
}
exports.UKSController = UKSController;

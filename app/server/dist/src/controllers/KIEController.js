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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KIEController = void 0;
const http_1 = require("../common/http");
const UKSValidator_1 = require("../common/http/requestvalidator/UKSValidator");
const exception_1 = require("../common/exception");
class KIEController {
    constructor(kieService) {
        this.kieService = kieService;
    }
    createKIEContent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const { type } = req.params;
                let typeId = 1;
                const { banner, thumbnail, image, video } = req.files;
                if (!type) {
                    throw new exception_1.InvariantError('Type is required in params');
                }
                if (type === 'article') {
                    (0, http_1.validatePayload)(UKSValidator_1.createKIEArticleSchema, req.body);
                    typeId = 1;
                }
                if (type === 'poster') {
                    (0, http_1.validatePayload)(UKSValidator_1.createKIEArticleSchema, req.body);
                    if (!image) {
                        throw new exception_1.InvariantError('Image is required for poster');
                    }
                    typeId = 2;
                }
                if (type === 'video') {
                    (0, http_1.validatePayload)(UKSValidator_1.createKIEArticleSchema, req.body);
                    if (!video) {
                        throw new exception_1.InvariantError('Video is required for video');
                    }
                    typeId = 3;
                }
                const user = req.user;
                const payload = req.body;
                let contentPayload = null;
                if (typeId === 1) {
                    contentPayload = {
                        content: payload.content,
                        bannerUrl: !banner ? undefined : (_a = banner[0]) === null || _a === void 0 ? void 0 : _a.filename,
                        thumbnailUrl: !thumbnail ? undefined : (_b = thumbnail[0]) === null || _b === void 0 ? void 0 : _b.filename
                    };
                }
                ;
                if (typeId === 2) {
                    contentPayload = {
                        imageUrl: !image ? undefined : (_c = image[0]) === null || _c === void 0 ? void 0 : _c.filename,
                        thumbnailUrl: !thumbnail ? undefined : (_d = thumbnail[0]) === null || _d === void 0 ? void 0 : _d.filename
                    };
                }
                if (typeId === 3) {
                    contentPayload = {
                        videoUrl: !video ? undefined : (_e = video[0]) === null || _e === void 0 ? void 0 : _e.filename,
                        thumbnailUrl: !thumbnail ? undefined : (_f = thumbnail[0]) === null || _f === void 0 ? void 0 : _f.filename
                    };
                }
                const { kieContent } = yield this.kieService.createKIEContent({
                    createdBy: user.id,
                    description: payload.description,
                    title: payload.title,
                    type: typeId,
                    updatedBy: user.id
                }, Object.assign(Object.assign({}, contentPayload), { tag: payload.tags }));
                res.status(201).json({
                    status: 'Success',
                    message: `KIE ${type} created successfully`,
                    data: kieContent
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    deleteKIEContent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { contentId, type } = req.params;
                if (!contentId || !type) {
                    throw new exception_1.InvariantError('Content id and type is required in params');
                }
                let typeId = 1;
                if (type === 'article') {
                    typeId = 1;
                }
                if (type === 'poster') {
                    typeId = 2;
                }
                if (type === 'video') {
                    typeId = 3;
                }
                const { content } = yield this.kieService.deleteKIEContentById(+contentId, typeId);
                res.status(200).json({
                    status: 'Success',
                    message: 'Content deleted successfully',
                    data: content
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getKIEContent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { contentId, type } = req.params;
                if (!contentId || !type) {
                    throw new exception_1.InvariantError('Content id and type is required in params');
                }
                let typeId = 1;
                if (type === 'article') {
                    typeId = 1;
                }
                if (type === 'poster') {
                    typeId = 2;
                }
                if (type === 'video') {
                    typeId = 3;
                }
                const { content } = yield this.kieService.getContentById(+contentId, typeId);
                res.status(200).json({
                    status: 'Success',
                    message: 'Content fetched successfully',
                    data: content
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getKieContentsOwnedByInstitutionByType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log({ name: 'getKieContentsOwnedByInstitutionByType' });
                const { schoolId, type } = req.params;
                if (!schoolId || !type) {
                    throw new exception_1.InvariantError('School id and type is required in params');
                }
                let typeId = 1;
                if (type === 'article') {
                    typeId = 1;
                }
                if (type === 'poster') {
                    typeId = 2;
                }
                if (type === 'video') {
                    typeId = 3;
                }
                const { contents } = yield this.kieService.getContentsOwnedByInstitutionByType(+schoolId, typeId);
                res.status(200).json({
                    status: 'Success',
                    message: 'KIE contents fetched successfully',
                    data: contents
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    updateKIEContent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const { contentId, type } = req.params;
                if (!contentId || !type) {
                    throw new exception_1.InvariantError('Content id and type is required in params');
                }
                const { banner, thumbnail, image, video } = req.files;
                let typeId = 1;
                if (type === 'article') {
                    (0, http_1.validatePayload)(UKSValidator_1.createKIEArticleSchema, req.body);
                    typeId = 1;
                }
                if (type === 'poster') {
                    (0, http_1.validatePayload)(UKSValidator_1.createKIEArticleSchema, req.body);
                    if (!image) {
                        throw new exception_1.InvariantError('Image is required for video');
                    }
                    typeId = 2;
                }
                if (type === 'video') {
                    (0, http_1.validatePayload)(UKSValidator_1.createKIEArticleSchema, req.body);
                    if (!video) {
                        throw new exception_1.InvariantError('Video is required for video');
                    }
                    typeId = 3;
                }
                const user = req.user;
                const payload = req.body;
                let contentPayload = {};
                if (typeId === 1) {
                    contentPayload = {
                        content: payload.content,
                        bannerUrl: !banner ? undefined : (_a = banner[0]) === null || _a === void 0 ? void 0 : _a.filename,
                        thumbnailUrl: !thumbnail ? undefined : (_b = thumbnail[0]) === null || _b === void 0 ? void 0 : _b.filename
                    };
                }
                ;
                if (typeId === 2) {
                    contentPayload = {
                        imageUrl: !image ? undefined : (_c = image[0]) === null || _c === void 0 ? void 0 : _c.filename,
                        thumbnailUrl: !thumbnail ? undefined : (_d = thumbnail[0]) === null || _d === void 0 ? void 0 : _d.filename
                    };
                }
                if (typeId === 3) {
                    contentPayload = {
                        videoUrl: !video ? undefined : (_e = video[0]) === null || _e === void 0 ? void 0 : _e.filename,
                        thumbnailUrl: !thumbnail ? undefined : (_f = thumbnail[0]) === null || _f === void 0 ? void 0 : _f.filename
                    };
                }
                const { content } = yield this.kieService.updateKIEContentById(+contentId, {
                    createdBy: user.id,
                    description: payload.description,
                    title: payload.title,
                    type: typeId,
                    updatedBy: user.id
                }, Object.assign(Object.assign({}, contentPayload), { tag: payload.tags }));
                res.status(200).json({
                    status: 'Success',
                    message: `KIE with content id ${contentId} updated successfully`,
                    data: content
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getKieContentsOwnedByInstitution(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log({ name: 'getKieContentsOwnedByInstitution' });
                const { schoolId } = req.params;
                console.log({ schoolId });
                if (!schoolId) {
                    throw new exception_1.InvariantError('School id is required in params');
                }
                const { contents } = yield this.kieService.getContentsOwnedByInstitution(+schoolId);
                res.status(200).json({
                    status: 'Success',
                    message: 'KIE contents fetched successfully',
                    data: contents
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tags } = yield this.kieService.getTags();
                res.status(200).json({
                    status: 'Success',
                    message: 'Tags fetched successfully',
                    data: tags
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getTypes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { types } = yield this.kieService.getTypes();
                res.status(200).json({
                    status: 'Success',
                    message: 'Types fetched successfully',
                    data: types
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
}
exports.KIEController = KIEController;
;

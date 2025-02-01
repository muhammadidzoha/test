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
exports.InterventionController = void 0;
const http_1 = require("../common/http");
const exception_1 = require("../common/exception");
const InterventionValidator_1 = require("../common/http/requestvalidator/InterventionValidator");
class InterventionController {
    constructor(interventionService) {
        this.interventionService = interventionService;
    }
    createIntervention(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(InterventionValidator_1.createInterventionSchema, req.body);
                const { memberId, institutionId } = req.params;
                if (!memberId || !institutionId) {
                    throw new exception_1.InvariantError("Member ID and Institution ID must be provided");
                }
                const payload = req.body;
                const user = req.user;
                console.log({ payload, memberId, institutionId });
                const { intervention } = yield this.interventionService.createIntervention({
                    createdBy: user.id,
                    familyMemberId: +memberId,
                    instituonId: +institutionId,
                    recommendation: payload.recommendation,
                    programRecommendation: payload.programRecommendation
                });
                res.status(201).json({
                    status: 'Success',
                    message: 'Intervention created successfully',
                    data: intervention
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getInterventionsBelongToFamily(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { institutionId, familyId } = req.params;
                if (!institutionId || !familyId) {
                    throw new exception_1.InvariantError("Institution ID and Family ID must be provided");
                }
                const { interventions } = yield this.interventionService.getInterventionsBelongToFamily(+institutionId, +familyId);
                res.status(200).json({
                    status: 'Success',
                    message: 'Interventions fetched successfully',
                    data: interventions
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getInterventionsBelongToInstitution(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { institutionId } = req.params;
                if (!institutionId) {
                    throw new exception_1.InvariantError("Institution ID must be provided");
                }
                const { interventions } = yield this.interventionService.getInterventionsBelongToInstitution(+institutionId);
                res.status(200).json({
                    status: 'Success',
                    message: 'Interventions fetched successfully',
                    data: interventions
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getInterventionsBelongToSchool(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { schoolId } = req.params;
                if (!schoolId) {
                    throw new exception_1.InvariantError("Institution ID must be provided");
                }
                const { interventions } = yield this.interventionService.getInterventionBelongsToSchool(+schoolId);
                res.status(200).json({
                    status: 'Success',
                    message: 'Interventions fetched successfully',
                    data: interventions
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    getInterventionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { interventionId } = req.params;
                if (!interventionId) {
                    throw new exception_1.InvariantError("Intervention ID must be provided");
                }
                const { intervention } = yield this.interventionService.getInterventionById(+interventionId);
                res.status(200).json({
                    status: 'Success',
                    message: 'Intervention fetched successfully',
                    data: intervention
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
}
exports.InterventionController = InterventionController;
;

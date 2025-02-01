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
exports.FamilyController = void 0;
const exception_1 = require("../common/exception");
const http_1 = require("../common/http");
const FamilyValidator_1 = require("../common/http/requestvalidator/FamilyValidator");
class FamilyController {
    constructor(familyService) {
        this.familyService = familyService;
    }
    createOrUpdateFamily(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(FamilyValidator_1.createFamilySchema, req.body);
                const { familyId } = req.params;
                const familyPayload = req.body;
                const { family } = yield this.familyService.createOrUpdateFamily(familyId ? +familyId : undefined, familyPayload);
                res.status(201).json({
                    status: 'Success',
                    msesage: 'Family created successfully',
                    data: family
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    addFamilyMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(FamilyValidator_1.addMemberSchema, req.body);
                const { familyId } = req.params;
                if (!familyId) {
                    throw new exception_1.InvariantError('Family id is required in params to add member');
                }
                const user = req.user;
                const payload = req.body;
                const { familyMember } = yield this.familyService.addFamilyMember(+familyId, Object.assign(Object.assign({}, payload), { birthDate: new Date(payload.birthDate) }), user.id);
                res.status(201).json({
                    status: 'Success',
                    message: 'Family member added successfully',
                    data: {
                        familyMember: Object.assign(Object.assign({}, familyMember), { job: Object.assign(Object.assign({}, familyMember.job), { income: familyMember.job.income.toString() }) })
                    }
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
}
exports.FamilyController = FamilyController;

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
exports.NutritionController = void 0;
const exception_1 = require("../common/exception");
const http_1 = require("../common/http");
const NutritionValidator_1 = require("../common/http/requestvalidator/NutritionValidator");
class NutritionController {
    constructor(nutritionService) {
        this.nutritionService = nutritionService;
    }
    addNutrition(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { familyMemberId } = req.params;
                console.log({ familyMemberId });
                (0, http_1.validatePayload)(NutritionValidator_1.addNutritionSchema, req.body);
                if (!familyMemberId) {
                    throw new exception_1.InvariantError('Family Member Id is required to add nutrition');
                }
                const user = req.user;
                const payload = req.body;
                const { nutrition } = yield this.nutritionService.createNutrition(+familyMemberId, Object.assign(Object.assign({}, payload), { createdBy: user.id, updatedBy: user.id }));
                res.status(201).json({
                    status: 'Success',
                    message: 'Nutrition added',
                    data: nutrition
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
    updateNutrition(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, http_1.validatePayload)(NutritionValidator_1.addNutritionSchema, req.body);
                const { familyMemberId, nutritionId } = req.params;
                if (!familyMemberId || !nutritionId) {
                    throw new exception_1.InvariantError('Family Member Id and Nutrition Id is required to update nutrition');
                }
                ;
                const payload = req.body;
                const user = req.user;
                const { nutrition } = yield this.nutritionService.updateNutrition(+nutritionId, +familyMemberId, Object.assign(Object.assign({}, payload), { updatedBy: user.id }));
                res.status(200).json({
                    status: 'Success',
                    message: 'Nutrition updated',
                    data: nutrition
                });
            }
            catch (err) {
                (0, http_1.handleError)(err, res);
            }
        });
    }
}
exports.NutritionController = NutritionController;
;

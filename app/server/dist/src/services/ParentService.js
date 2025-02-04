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
exports.ParentService = void 0;
const exception_1 = require("../common/exception");
class ParentService {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    createFamily(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { family: isFamilyExists } = yield this.getFamilyByHeadFamily(payload.headFamily);
            if (!!isFamilyExists) {
                throw new exception_1.InvariantError('Family already exsits');
            }
            const family = yield this.prismaClient.family.create({
                data: {
                    head_family: payload.headFamily,
                    head_phone_number: payload.headPhoneNumber,
                    kk_number: payload.kkNumber,
                    description: payload.description
                }
            });
            return {
                family
            };
        });
    }
    getFamilyByHeadFamily(headFamily) {
        return __awaiter(this, void 0, void 0, function* () {
            const family = yield this.prismaClient.family.findFirst({
                where: {
                    head_family: headFamily
                }
            });
            return {
                family
            };
        });
    }
}
exports.ParentService = ParentService;

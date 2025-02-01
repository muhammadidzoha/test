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
exports.SeedService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class SeedService {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    seed() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([yield this.seedRole(),
                yield this.seedInstitutionType(),
                yield this.seedPositions(),
                yield this.seedAdminAccount(),
                yield this.seedNutritionStatus(),
                yield this.seedKIEtype(),
                yield this.seedFacilityType(),
                yield this.seedCategoryStratification()
            ]);
        });
    }
    seedRole() {
        return __awaiter(this, void 0, void 0, function* () {
            const isRoleExist = yield this.prismaClient.role.findMany();
            if (isRoleExist.length === 0) {
                yield this.prismaClient.role.createMany({
                    data: [
                        {
                            id: 1,
                            name: 'admin'
                        },
                        {
                            id: 2,
                            name: 'school'
                        },
                        {
                            id: 3,
                            name: 'healthcare'
                        },
                        {
                            id: 4,
                            name: 'parent'
                        },
                        {
                            id: 5,
                            name: 'uks'
                        }
                    ]
                });
            }
            console.log('Role seeded');
        });
    }
    seedInstitutionType() {
        return __awaiter(this, void 0, void 0, function* () {
            const isInstitutionTypeExists = yield this.prismaClient.institutionType.findMany();
            if (isInstitutionTypeExists.length === 0) {
                yield this.prismaClient.institutionType.createMany({
                    data: [
                        {
                            id: 1,
                            name: 'school'
                        },
                        {
                            id: 2,
                            name: 'healthcare'
                        },
                    ]
                });
            }
            console.log('Institution Type seeded');
        });
    }
    seedAdminAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserExist = yield this.prismaClient.user.findMany();
            if (!isUserExist.length) {
                yield this.prismaClient.user.create({
                    data: {
                        id: 1,
                        // username: process.env.ADMIN_USERNAME ?? 'admin',
                        username: 'admin',
                        password: bcrypt_1.default.hashSync('admin', 10),
                        email: 'admin@gmail.com',
                        is_verified: true,
                        role_id: 1,
                    }
                });
            }
            console.log('Admin account seeded');
        });
    }
    seedPositions() {
        return __awaiter(this, void 0, void 0, function* () {
            const isPositionExist = yield this.prismaClient.position.findMany();
            if (!isPositionExist.length) {
                yield this.prismaClient.position.createMany({
                    data: [{
                            id: 1,
                            name: 'Kepala uks',
                            modules: 'healthcare'
                        },
                        {
                            id: 2,
                            name: 'petugas kesehatan',
                            modules: "healthcare"
                        },
                    ]
                });
            }
            console.log('Position Seeded');
        });
    }
    seedNutritionStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const isNutritionStatusExist = yield this.prismaClient.nutritionStatus.findMany();
            if (!isNutritionStatusExist.length) {
                yield this.prismaClient.nutritionStatus.createMany({
                    data: [
                        {
                            id: 1,
                            status: 'KURUS',
                            information: 'Kekurangan bb tingkat berat'
                        },
                        {
                            id: 2,
                            status: 'KURUS',
                            information: 'Kekurangan bb tingkat ringan'
                        },
                        {
                            id: 3,
                            status: 'NORMAL',
                            information: 'Gizi normal'
                        },
                        {
                            id: 4,
                            status: 'GEMUK',
                            information: 'Kelebihan bb tingkat ringan'
                        },
                        {
                            id: 5,
                            status: 'GEMUK',
                            information: 'Kelebihan bb tingkat berat'
                        },
                    ]
                });
            }
            console.log('Nutrition Status Seeded');
        });
    }
    seedKIEtype() {
        return __awaiter(this, void 0, void 0, function* () {
            const isKIETypeExist = yield this.prismaClient.kIEType.findMany();
            if (!isKIETypeExist.length) {
                yield this.prismaClient.kIEType.createMany({
                    data: [
                        {
                            id: 1,
                            name: 'Article'
                        },
                        {
                            id: 2,
                            name: 'Poster'
                        },
                        {
                            id: 3,
                            name: 'Video'
                        }
                    ]
                });
            }
            console.log('KIE Type Seeded');
        });
    }
    seedFacilityType() {
        return __awaiter(this, void 0, void 0, function* () {
            const facilities = yield this.prismaClient.facilityType.findMany();
            if (!facilities.length) {
                yield this.prismaClient.facilityType.createMany({
                    data: [
                        {
                            id: 1,
                            name: 'Kesehatan'
                        },
                        {
                            id: 2,
                            name: 'Pendidikan'
                        },
                        {
                            id: 3,
                            name: 'Lingkungan'
                        },
                        {
                            id: 4,
                            name: 'Pelayanan'
                        },
                        {
                            id: 5,
                            name: 'Olahraga'
                        }
                    ]
                });
            }
        });
    }
    seedCategoryStratification() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this.prismaClient.serviceCategory.findMany();
            if (!categories.length) {
                yield this.prismaClient.serviceCategory.createMany({
                    data: [
                        {
                            id: 1,
                            name: 'Minimal'
                        },
                        {
                            id: 2,
                            name: 'Standar'
                        },
                        {
                            id: 3,
                            name: 'Optimal'
                        },
                        {
                            id: 4,
                            name: 'Paripurna'
                        }
                    ]
                });
            }
            console.log('Category Stratification Seeded');
        });
    }
}
exports.SeedService = SeedService;

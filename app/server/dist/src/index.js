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
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const dotenv_expand_1 = __importDefault(require("dotenv-expand"));
dotenv_expand_1.default.expand(dotenv_1.default.config());
const express_1 = __importDefault(require("express"));
const SeedService_1 = require("./services/SeedService");
const prisma_1 = require("../config/prisma");
// route
const AuthRouter_1 = require("./routes/AuthRouter");
const SchoolRouter_1 = require("./routes/SchoolRouter");
const FamilyRouter_1 = require("./routes/FamilyRouter");
const UserRouter_1 = require("./routes/UserRouter");
const MemberRouter_1 = require("./routes/MemberRouter");
const UKSRouter_1 = require("./routes/UKSRouter");
const KIERouter_1 = require("./routes/KIERouter");
const InterventionRouter_1 = require("./routes/InterventionRouter");
// Middleware
const seedService = new SeedService_1.SeedService(prisma_1.prismaDBClient);
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const port = process.env.API_PORT ? +process.env.API_PORT : 5000;
    yield seedService.seed();
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use('/public', express_1.default.static('uploads'));
    app.use('/auth', AuthRouter_1.authRouter);
    app.use('/institutions/schools', SchoolRouter_1.schoolRouter);
    app.use('/families', FamilyRouter_1.familyRouter);
    app.use('/users', UserRouter_1.userRouter);
    app.use('/members', MemberRouter_1.memberRouter);
    app.use('/health-care', UKSRouter_1.uksRouter);
    app.use('/kie', KIERouter_1.kieRouter);
    app.use('/interventions', InterventionRouter_1.interventionRouter);
    app.get('/', (req, res) => {
        res.send('ok');
    });
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
init();

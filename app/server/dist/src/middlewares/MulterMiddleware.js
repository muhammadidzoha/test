"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (!fs_1.default.existsSync('uploads/')) {
            fs_1.default.mkdirSync('uploads/');
        }
        cb(null, `uploads/`);
    },
    filename: (req, file, cb) => {
        cb(null, `${+new Date()}-${file.originalname}`);
    }
});
exports.multerMiddleware = (0, multer_1.default)({ storage });

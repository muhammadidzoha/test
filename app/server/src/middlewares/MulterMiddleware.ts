import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync('uploads/')) {
            fs.mkdirSync('uploads/');
        }
        cb(null, `uploads/`)
    },
    filename: (req, file, cb) => {
        cb(null, `${+new Date()}-${file.originalname}`)
    }
})


export const multerMiddleware = multer({ storage });
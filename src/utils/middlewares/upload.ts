import multer, { Multer } from 'multer';
import path from 'path';
import fs from 'fs';

const destPath = path.join(__dirname, "../../../public/uploads")

if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, destPath);
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const filetypes = /jpg|jpeg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images and PDFs only!'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});


const uploadMultiple: Multer = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB file size limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

export { upload, uploadMultiple };

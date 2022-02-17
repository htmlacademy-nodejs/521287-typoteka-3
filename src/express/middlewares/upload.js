'use strict';

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const UPLOAD_DIR = `../upload/img`;
const FILE_TYPES = [`image/png`, `image/jpg`, `image/jpeg`];
const MAX_FILE_AMOUNT = 1;
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 МБ

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (_req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();

    cb(null, `${uniqueName}.${extension}`);
  },
});

const fileFilter = (_req, file, cb) =>
  cb(null, FILE_TYPES.includes(file.mimetype));

const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: MAX_FILE_AMOUNT,
    fileSize: MAX_FILE_SIZE,
  }
});

module.exports = upload;

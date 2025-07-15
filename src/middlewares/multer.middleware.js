/*import multer from 'multer';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp'); // Set the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  }
});

export const upload = multer({ storage });*/

import multer from 'multer';
import fs from 'fs';

const uploadDir = './public/temp';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Set the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  }
});

export const upload = multer({ storage });






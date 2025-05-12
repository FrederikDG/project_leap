import multer from 'multer';
import { extname, join } from 'path';
import { randomBytes } from 'crypto';

// Ensure the uploads directory exists:
//   mkdir -p uploads

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');                // save files into ./uploads/
  },
  filename: (req, file, cb) => {
    const id   = randomBytes(8).toString('hex');           // e.g. "9f1c2a3b4d5e6f7a"
    const ext  = extname(file.originalname).toLowerCase(); // keep the original extension
    cb(null, `${id}${ext}`);                               // e.g. "9f1c2a3b4d5e6f7a.png"
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // max 5 MB
  fileFilter: (req, file, cb) => {
    // only accept image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads allowed'), false);
    }
    cb(null, true);
  }
});

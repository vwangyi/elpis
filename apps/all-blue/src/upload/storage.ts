import multer from 'multer';
import { extname } from 'path';

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const name = new Array(32)
      .fill(0)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${name}${extname(file.originalname)}`);
  }
});

export { storage };

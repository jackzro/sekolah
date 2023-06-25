import { extname } from 'path';
import { diskStorage } from 'multer';

export const DiskStorage = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const fileExtension = extname(file.originalname);
      console.log('disk', file);
      return cb(null, file.originalname);
    },
  }),
};

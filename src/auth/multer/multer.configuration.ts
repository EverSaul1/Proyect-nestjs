import { diskStorage } from 'multer';
import { extname } from 'path';
import { v2 as cloudinary } from 'cloudinary';

const storage = diskStorage({
  filename: (req, file, cb) => {
    const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

export const multerConfig = {
  storage,
  fileFilter: (req, file, cb) => {
    // Aquí puedes agregar lógica para filtrar los tipos de archivo permitidos si es necesario
    cb(null, true);
  },
};

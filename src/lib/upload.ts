import multer from 'multer';
import path from 'path';
import { mkdirSync } from 'fs';

// Configurar storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'public/uploads/';
    
    if (file.fieldname === 'coverImage') {
      folder += 'covers/';
    } else if (file.fieldname === 'fileUrl') {
      folder += 'pdfs/';
    }
    
    // Criar pasta se não existir
    mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtrar arquivos
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.fieldname === 'coverImage') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas para a capa'), false);
    }
  } else if (file.fieldname === 'fileUrl') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Apenas PDF são permitidos'), false);
    }
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB para imagens
  }
});
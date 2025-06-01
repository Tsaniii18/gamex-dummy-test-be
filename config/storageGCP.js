import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import multer from 'multer';
import { Storage } from '@google-cloud/storage';

// Inisialisasi Google Cloud Storage
// const storage = new Storage();
const storage = new Storage({
  projectId: 'a-07-451003',
  keyFilename: process.env.KEY_CREDRENTIALS, // pastikan path ini benar dan file-nya bisa diakses
});

// Referensi bucket
export const bucket = storage.bucket('game-ex-img');

// Konfigurasi multer untuk upload ke memory
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Maksimum 5MB
  },
});

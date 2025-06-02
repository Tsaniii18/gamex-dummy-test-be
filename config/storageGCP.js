import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import multer from 'multer';
import { Storage } from '@google-cloud/storage';

// Inisialisasi Google Cloud Storage
// const storage = new Storage();
const storage = new Storage();

// Referensi bucket
export const bucket = storage.bucket('game-ex-img');

// Konfigurasi multer untuk upload ke memory
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Maksimum 5MB
  },
});

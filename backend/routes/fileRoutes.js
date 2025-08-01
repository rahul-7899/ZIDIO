import express from 'express';
import multer from 'multer';
import { uploadExcel } from '../controllers/fileController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', auth, upload.single('file'), uploadExcel);

export default router;
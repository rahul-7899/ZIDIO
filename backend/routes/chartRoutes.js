import express from 'express';
import { saveChart, getUserCharts } from '../controllers/chartController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/save', auth, saveChart);
router.get('/my', auth, getUserCharts);

export default router;
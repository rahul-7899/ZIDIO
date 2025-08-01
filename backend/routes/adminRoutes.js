import express from 'express';
import { getAllUsers, getAllCharts } from '../controllers/adminController.js';
import { auth, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', auth, adminOnly, getAllUsers);
router.get('/charts', auth, adminOnly, getAllCharts);

export default router;
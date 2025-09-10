import express from 'express';
import { getCategories, createCategory } from '../controllers/categoryController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', authenticateToken, requireAdmin, createCategory);

export default router;
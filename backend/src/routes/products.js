import express from 'express';
import { getProducts, getProduct, createProduct } from '../controllers/productController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', authenticateToken, requireAdmin, createProduct);

export default router;
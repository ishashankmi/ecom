import express from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createOrder);
router.get('/user', authenticateToken, getUserOrders);
router.get('/', authenticateToken, getAllOrders);
router.put('/:id', authenticateToken, updateOrderStatus);

export default router;
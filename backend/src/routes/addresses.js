import express from 'express';
import { getUserAddresses, createAddress, deleteAddress } from '../controllers/addressController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getUserAddresses);
router.post('/', authenticateToken, createAddress);
router.delete('/:id', authenticateToken, deleteAddress);

export default router;
import express from 'express';
import { register, login, verifyToken, logout, updateProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyToken);
router.post('/logout', logout);
router.put('/profile', authenticateToken, updateProfile);

export default router;
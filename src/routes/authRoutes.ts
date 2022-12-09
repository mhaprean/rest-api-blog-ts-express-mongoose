import { register, login, profile } from '../controllers/authController';
import express from 'express';
import { isAuthMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', isAuthMiddleware, profile);

export default router;

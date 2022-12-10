import { register, login, profile } from '../controllers/authController';
import express from 'express';
import { isAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// add auth middleware to profile page. visible only when the user is logged in
router.get('/profile', isAuth, profile);

export default router;

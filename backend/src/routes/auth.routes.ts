import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// Login
router.post('/login', authController.login);

// Logout
router.post('/logout', authMiddleware, authController.logout);

// Refresh token
router.post('/refresh', authController.refreshToken);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

// Change password
router.post('/change-password', authMiddleware, authController.changePassword);

export default router;


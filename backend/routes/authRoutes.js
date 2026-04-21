import express from 'express';
import { register, login, getCurrentUser, updateProfile, logout } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateRegister, validateLogin } from '../middlewares/validationMiddleware.js';
import { authLimiter } from '../middlewares/rateLimitMiddleware.js';

const router = express.Router();

/**
 * Auth Routes
 */

// Register endpoint
console.log("hit");
router.post('/register', authLimiter, validateRegister, register);

// Login endpoint
router.post('/login', authLimiter, validateLogin, login);

// Get current user profile (Protected)
router.get('/me', protect, getCurrentUser);

// Update user profile (Protected)
router.put('/me', protect, updateProfile);

// Logout endpoint
router.post('/logout', protect, logout);

export default router;

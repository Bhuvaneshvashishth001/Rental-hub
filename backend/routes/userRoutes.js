import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * User Routes
 */

// Get user profile - redirects to auth/me
router.get('/profile', protect, (req, res) => {
  res.json({
    success: true,
    message: 'User profile',
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      profileImage: req.user.profileImage,
      createdAt: req.user.createdAt,
    },
  });
});

export default router;

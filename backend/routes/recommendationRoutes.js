import express from 'express';
import {
  getRecommendationsByCategory,
  getSimilarRentals,
  getTrendingRentals,
  getPersonalizedRecommendations,
  getRecommendations,
} from '../controllers/recommendationController.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Recommendation Routes
 */

// Get recommendations (Public, optional auth for personalization)
router.get('/', optionalAuth, getRecommendations);

// Get recommendations by category (Public)
router.get('/category', getRecommendationsByCategory);

// Get similar rentals (Public)
router.get('/similar/:id', getSimilarRentals);

// Get trending rentals (Public)
router.get('/trending/top', getTrendingRentals);

// Get personalized recommendations (Protected)
router.get('/personalized/my', optionalAuth, getPersonalizedRecommendations);

export default router;

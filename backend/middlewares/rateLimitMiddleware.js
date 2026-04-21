import rateLimit from 'express-rate-limit';

/**
 * General rate limiter
 * Limits: 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Auth rate limiter
 * Limits: 5 requests per 15 minutes for login/register
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Create resource rate limiter
 * Limits: 30 requests per 1 hour
 */
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  message: 'Too many resources created, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

import { verifyToken } from '../utils/tokenUtils.js';
import { sendResponse, CustomError, asyncHandler } from '../utils/helpers.js';
import User from '../models/User.js';

/**
 * Auth Middleware
 * Verifies JWT token and attaches user to request
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  console.log('🔍 [AUTH MIDDLEWARE] Checking authorization header:', req.headers.authorization);

  // Extract token from headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('✅ [AUTH MIDDLEWARE] Token extracted from header');
  } else {
    console.log('❌ [AUTH MIDDLEWARE] No Bearer token found in header');
  }

  // Check if token exists
  if (!token) {
    console.log('❌ [AUTH MIDDLEWARE] No token provided, denying access');
    return sendResponse(res, 401, false, 'No token provided, authorization denied');
  }

  console.log('🔍 [AUTH MIDDLEWARE] Verifying token...');

  try {
    // Verify token
    const decoded = verifyToken(token);
    console.log('✅ [AUTH MIDDLEWARE] Token verified, user ID:', decoded.id);

    // Attach user to request
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log('❌ [AUTH MIDDLEWARE] User not found for ID:', decoded.id);
      return sendResponse(res, 401, false, 'User not found');
    }

    console.log('✅ [AUTH MIDDLEWARE] User attached to request:', user.name);
    req.user = user;
    next();
  } catch (error) {
    console.log('❌ [AUTH MIDDLEWARE] Token verification failed:', error.message);
    return sendResponse(res, 401, false, error.message || 'Token is not valid');
  }
});

/**
 * Admin Middleware
 * Checks if user is admin
 */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return sendResponse(res, 403, false, 'Admin access required');
  }
};

/**
 * Optional Auth Middleware
 * Optionally attaches user if valid token provided
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      req.user = user;
    } catch (error) {
      // Continue without user if token is invalid
      req.user = null;
    }
  }

  next();
});

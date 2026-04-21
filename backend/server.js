import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import { generalLimiter } from './middlewares/rateLimitMiddleware.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to database
connectDB();

/**
 * Middleware Configuration
 */

// CORS configuration - Frontend friendly
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * Routes Import
 */
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import rentalRoutes from './routes/rentalRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';

/**
 * API Routes
 */

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// User routes
app.use('/api/user', userRoutes);

// Rental routes
app.use('/api/rentals', rentalRoutes);

// Booking routes
app.use('/api/bookings', bookingRoutes);

// Recommendation routes - Place this AFTER /api/bookings to avoid route conflicts
app.use('/api/recommendations', recommendationRoutes);

/**
 * Error Handling Middleware
 */

// 404 handler (must be after all routes)
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

/**
 * Start Server
 */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 Rental Services Backend Running   ║
╠════════════════════════════════════════╣
║   Server: http://localhost:${PORT}      ${PORT === 5000 ? '' : ' '}
║   Environment: ${process.env.NODE_ENV?.toUpperCase() || 'DEVELOPMENT'}
║   Database: MongoDB Connected
╚════════════════════════════════════════╝
  `);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please stop the process using it or set a different PORT in your .env file.`);
    process.exit(1);
  }

  console.error('❌ Server error:', err);
  process.exit(1);
});

/**
 * Unhandled Promise Rejection Handler
 */
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

/**
 * Graceful Shutdown
 */
process.on('SIGTERM', () => {
  console.log('📛 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default app;

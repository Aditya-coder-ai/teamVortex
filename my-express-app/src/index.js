require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('./config/passport');
const authRoutes = require('./auth/auth.routes');
const verifyJWT = require('./middleware/verifyJWT');
const authorizeRole = require('./middleware/authorizeRole');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Passport Initializer
app.use(passport.initialize());

// Database Connection
const DATABASE_URL = process.env.DATABASE_URL;
if (DATABASE_URL) {
  mongoose
    .connect(DATABASE_URL)
    .then(() => console.log('[DB] Connected to MongoDB successfully'))
    .catch((err) => {
      console.warn('[DB WARN] MongoDB connection failed:', err.message);
      console.warn('[DB WARN] Operating with in-memory data store for development.');
    });
} else {
  console.log('[DB INFO] No DATABASE_URL provided. Operating with in-memory data store for development.');
}

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Restaurant Management System Auth API is operational',
    timestamp: new Date().toISOString(),
  });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// Role-Based Access Control Example Demonstration Routes
app.get('/api/protected/customer-menu', verifyJWT, authorizeRole('customer', 'staff', 'manager', 'admin'), (req, res) => {
  res.json({ success: true, message: 'Access granted to Menu (Customer+ Role)' });
});

app.get('/api/protected/staff-orders', verifyJWT, authorizeRole('staff', 'manager', 'admin'), (req, res) => {
  res.json({ success: true, message: 'Access granted to Manage Orders (Staff+ Role)' });
});

app.get('/api/protected/manager-dashboard', verifyJWT, authorizeRole('manager', 'admin'), (req, res) => {
  res.json({ success: true, message: 'Access granted to Manager Dashboard' });
});

app.get('/api/protected/admin-only', verifyJWT, authorizeRole('admin'), (req, res) => {
  res.json({ success: true, message: 'Access granted to Admin Panel (Admin Only)' });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Restaurant Auth Server running on port ${PORT}`);
    console.log(`📡 Endpoints mounted at http://localhost:${PORT}/api/auth`);
    console.log(`=================================================`);
  });
}

module.exports = app;

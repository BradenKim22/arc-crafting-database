// -----------------------------------------------
// Arc Raider's API — Entry point
// -----------------------------------------------
require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes    = require('./routes/auth');
const accountRoutes = require('./routes/account');
const itemRoutes    = require('./routes/items');
const recipeRoutes  = require('./routes/recipes');
const pool          = require('./config/db');

const app  = express();
const PORT = process.env.PORT || 5000;

// ----- Global middleware -----

// Security headers
app.use(helmet());

// CORS — allow React dev server (port 3000) during development
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Parse JSON bodies (limit size to prevent abuse)
app.use(express.json({ limit: '1mb' }));

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Stricter rate limit on auth endpoints to prevent brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many auth attempts, please try again later.' },
});
app.use('/api/auth', authLimiter);

// ----- Routes -----
app.use('/api/auth',    authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/items',   itemRoutes);
app.use('/api/recipes', recipeRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// 404 catch-all
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ----- Start server -----
app.listen(PORT, () => {
  console.log(`\n  Arc Raider's API running on http://localhost:${PORT}`);
  console.log(`  Health check:  http://localhost:${PORT}/api/health\n`);
});

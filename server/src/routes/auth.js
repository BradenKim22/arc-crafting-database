// -----------------------------------------------
// Auth routes — /api/auth
// -----------------------------------------------
const express = require('express');
const { body }  = require('express-validator');
const router  = express.Router();

const { register, login, getProfile } = require('../controllers/authController');
const { authenticateToken }           = require('../middleware/auth');
const { handleValidationErrors }      = require('../middleware/validate');

// POST /api/auth/register
router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be 3-30 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    handleValidationErrors,
  ],
  register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    handleValidationErrors,
  ],
  login
);

// GET /api/auth/me  — protected
router.get('/me', authenticateToken, getProfile);

module.exports = router;

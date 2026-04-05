// -----------------------------------------------
// Account routes — /api/account
// -----------------------------------------------
const express = require('express');
const { body } = require('express-validator');
const router  = express.Router();

const { updateProfile, updatePassword, deleteAccount } = require('../controllers/accountController');
const { authenticateToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');

// All account routes require authentication
router.use(authenticateToken);

// PUT /api/account/profile
// Update username, email, gamertag
router.put(
  '/profile',
  [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be 3-30 characters'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail(),
    body('gamertag')
      .optional()
      .trim(),
    handleValidationErrors,
  ],
  updateProfile
);

// PUT /api/account/password
// Update password
router.put(
  '/password',
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters'),
    handleValidationErrors,
  ],
  updatePassword
);

// DELETE /api/account
// Delete user account
router.delete('/', deleteAccount);

module.exports = router;

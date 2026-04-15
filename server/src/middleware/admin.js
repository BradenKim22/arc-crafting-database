// -----------------------------------------------
// Admin authorization middleware
// Must be used AFTER authenticateToken middleware
// -----------------------------------------------
const pool = require('../config/db');

async function requireAdmin(req, res, next) {
  try {
    // Double-check the DB rather than trusting the JWT alone,
    // so a demoted admin's existing token won't still work.
    const [rows] = await pool.query(
      'SELECT IsAdmin FROM users WHERE UserID = ?',
      [req.user.id]
    );

    if (rows.length === 0 || !rows[0].IsAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (err) {
    console.error('Admin middleware error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { requireAdmin };

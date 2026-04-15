// -----------------------------------------------
// JWT authentication middleware
// -----------------------------------------------
const jwt  = require('jsonwebtoken');
const pool = require('../config/db');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Expected format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, email, isAdmin }

    // Fire-and-forget: update LastActiveAt so the admin dashboard
    // can show "currently online" users (active within last 5 min).
    pool.query('UPDATE users SET LastActiveAt = NOW() WHERE UserID = ?', [decoded.id])
      .catch(() => {}); // swallow errors — this is non-critical

    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { authenticateToken };

// -----------------------------------------------
// Auth controller — register, login, profile
// -----------------------------------------------
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');

const SALT_ROUNDS = 12;

// Helper: generate a JWT for a user row
function signToken(user) {
  return jwt.sign(
    { id: user.UserID, username: user.Username, email: user.Email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/register
async function register(req, res) {
  try {
    const { username, email, password, gamertag } = req.body;

    // Validate username (3-30 chars)
    if (!username || username.length < 3 || username.length > 30) {
      return res.status(400).json({ error: 'Username must be 3-30 characters' });
    }

    // Validate password (8+ chars)
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Validate email format (basic)
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Check if email or username already taken
    const [existing] = await pool.query(
      'SELECT UserID FROM users WHERE Email = ? OR Username = ?',
      [email, username]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email or username already in use' });
    }

    // Hash password and insert
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await pool.query(
      'INSERT INTO users (Username, Email, PasswordHash, GamerTag) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, gamertag || null]
    );

    const userId = result.insertId;
    const token = signToken({ UserID: userId, Username: username, Email: email });

    res.status(201).json({
      message: 'Account created',
      token,
      user: { id: userId, username, email, gamertag: gamertag || null },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE Email = ?',
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.PasswordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.UserID, username: user.Username, email: user.Email, gamertag: user.GamerTag },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/auth/me  (requires auth middleware)
async function getProfile(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT UserID, Username, Email, GamerTag, CreatedAt FROM users WHERE UserID = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const row = rows[0];
    res.json({ user: {
      id:        row.UserID,
      username:  row.Username,
      email:     row.Email,
      gamertag:  row.GamerTag,
      createdAt: row.CreatedAt,
    }});
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { register, login, getProfile };

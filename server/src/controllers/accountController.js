// -----------------------------------------------
// Account controller — profile, password, delete
// -----------------------------------------------
const bcrypt = require('bcrypt');
const pool   = require('../config/db');

const SALT_ROUNDS = 12;

// PUT /api/account/profile
// Update username, email, gamertag
async function updateProfile(req, res) {
  try {
    const { username, email, gamertag } = req.body;
    const userId = req.user.id;

    // Validate if provided
    if (username && (username.length < 3 || username.length > 30)) {
      return res.status(400).json({ error: 'Username must be 3-30 characters' });
    }
    if (email && !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Check uniqueness of new username/email (if provided and different)
    if (username || email) {
      const [existing] = await pool.query(
        'SELECT UserID FROM users WHERE (Email = ? OR Username = ?) AND UserID != ?',
        [email || '', username || '', userId]
      );
      if (existing.length > 0) {
        return res.status(409).json({ error: 'Email or username already in use' });
      }
    }

    // Build update query dynamically
    const updates = [];
    const params = [];
    if (username) {
      updates.push('Username = ?');
      params.push(username);
    }
    if (email) {
      updates.push('Email = ?');
      params.push(email);
    }
    if (gamertag !== undefined) {
      updates.push('GamerTag = ?');
      params.push(gamertag || null);
    }
    updates.push('UpdatedAt = NOW()');

    if (updates.length === 1) {
      // Only UpdatedAt was set
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(userId);

    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE UserID = ?`,
      params
    );

    // Fetch updated user
    const [rows] = await pool.query(
      'SELECT UserID, Username, Email, GamerTag FROM users WHERE UserID = ?',
      [userId]
    );

    res.json({
      message: 'Profile updated',
      user: rows[0],
    });
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// PUT /api/account/password
// Change password
async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    // Get current password hash
    const [rows] = await pool.query(
      'SELECT PasswordHash FROM users WHERE UserID = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const match = await bcrypt.compare(currentPassword, rows[0].PasswordHash);
    if (!match) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash and update new password
    const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await pool.query(
      'UPDATE users SET PasswordHash = ?, UpdatedAt = NOW() WHERE UserID = ?',
      [newHash, userId]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('updatePassword error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /api/account
// Delete user account (and CASCADE related data)
async function deleteAccount(req, res) {
  try {
    const userId = req.user.id;

    // Delete the user (CASCADE will handle related tables)
    const [result] = await pool.query(
      'DELETE FROM users WHERE UserID = ?',
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('deleteAccount error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { updateProfile, updatePassword, deleteAccount };

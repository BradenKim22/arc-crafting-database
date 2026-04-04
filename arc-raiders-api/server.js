// server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // In production, restrict this to your specific frontend domain
app.use(express.json());

// Establish Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ==========================================
// API ENDPOINTS
// ==========================================

// Inventory Endpoint
app.get('/api/inventory', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM UserInventory');
    res.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to retrieve inventory.' });
  }
});

// Recipes Endpoint
app.get('/api/recipes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM CraftingRecipes');
    res.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to retrieve recipes.' });
  }
});

// Sessions Endpoint
app.get('/api/sessions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_ActiveSessions');
    res.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to retrieve sessions.' });
  }
});

// Global Registry Endpoint
app.get('/api/registry', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_GlobalItemRegistry');
    res.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to retrieve global registry.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Arc Raiders API operational on port ${PORT}`);
});
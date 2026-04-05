// -----------------------------------------------
// Item routes — /api/items
// -----------------------------------------------
const express = require('express');
const router  = express.Router();

const { getItems, getItemById, getCraftingTree } = require('../controllers/itemController');

// GET /api/items          — list/search items (public)
router.get('/', getItems);

// GET /api/items/:id      — single item + its recipes (public)
router.get('/:id', getItemById);

// GET /api/items/:id/tree — full crafting dependency tree (public)
router.get('/:id/tree', getCraftingTree);

module.exports = router;

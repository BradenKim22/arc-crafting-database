// -----------------------------------------------
// Item routes — /api/items
// -----------------------------------------------
const express = require('express');
const router  = express.Router();

const { getItems, getItemById, getCraftingTree, getRecyclingTree, getCategories } = require('../controllers/itemController');

// GET /api/items/categories — public category list (must be before /:id)
router.get('/categories', getCategories);

// GET /api/items          — list/search items (public)
router.get('/', getItems);

// GET /api/items/:id      — single item + its recipes (public)
router.get('/:id', getItemById);

// GET /api/items/:id/tree         — full crafting dependency tree (public)
router.get('/:id/tree', getCraftingTree);

// GET /api/items/:id/recycle-tree — full recycling source tree (public)
router.get('/:id/recycle-tree', getRecyclingTree);

module.exports = router;

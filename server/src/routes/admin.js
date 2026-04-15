// -----------------------------------------------
// Admin routes — all require auth + admin
// -----------------------------------------------
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin }      = require('../middleware/admin');
const admin                  = require('../controllers/adminController');

const router = express.Router();

// Every route in this file requires authentication + admin
router.use(authenticateToken, requireAdmin);

// Dashboard
router.get('/stats', admin.getStats);

// Users
router.get('/users',           admin.getUsers);
router.delete('/users/:id',    admin.deleteUser);
router.put('/users/:id/admin', admin.toggleAdmin);

// Items (loot)
router.get('/loot',        admin.getLoot);
router.post('/loot',       admin.createLoot);
router.put('/loot/:id',    admin.updateLoot);
router.delete('/loot/:id', admin.deleteLoot);

// Recipes
router.get('/recipes',        admin.getRecipes);
router.post('/recipes',       admin.createRecipe);
router.put('/recipes/:id',    admin.updateRecipe);
router.delete('/recipes/:id', admin.deleteRecipe);

// Blueprints (item → recipe links)
router.get('/blueprints/unlinked',   admin.getUnlinkedRecipes);
router.get('/blueprints',            admin.getBlueprints);
router.post('/blueprints',           admin.createBlueprint);
router.delete('/blueprints/:id',     admin.deleteBlueprint);

// Recyclables (breakdowns)
router.get('/breakdowns',                                admin.getBreakdowns);
router.post('/breakdowns',                               admin.createBreakdown);
router.put('/breakdowns/:lootId/:componentLootId',       admin.updateBreakdown);
router.delete('/breakdowns/:lootId/:componentLootId',    admin.deleteBreakdown);

// Categories CRUD
router.get('/categories',        admin.getCategoryList);
router.post('/categories',       admin.createCategory);
router.put('/categories/:id',    admin.updateCategory);
router.delete('/categories/:id', admin.deleteCategory);

// FoundIn CRUD
router.get('/found-in',          admin.getFoundInList);
router.post('/found-in',         admin.createFoundIn);
router.put('/found-in/:id',      admin.updateFoundIn);
router.delete('/found-in/:id',   admin.deleteFoundIn);

// Lookup helpers (for form dropdowns)
router.get('/lookup/loot',       admin.getAllLootNames);

module.exports = router;

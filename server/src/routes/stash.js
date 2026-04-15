// -----------------------------------------------
// Stash routes — /api/stash (authenticated users)
// -----------------------------------------------
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const stash = require('../controllers/stashController');

const router = express.Router();

// Every route requires authentication
router.use(authenticateToken);

// Items
router.get('/items',             stash.getItems);
router.post('/items',            stash.addItem);
router.put('/items/:lootId',     stash.updateItem);
router.delete('/items/:lootId',  stash.removeItem);

// Blueprints
router.get('/blueprints',                    stash.getBlueprints);
router.post('/blueprints/:blueprintId',      stash.toggleBlueprint);

// Workbenches
router.get('/workbenches',          stash.getWorkbenches);
router.post('/workbenches',         stash.upsertWorkbench);
router.delete('/workbenches/:id',   stash.removeWorkbench);

// Analysis
router.get('/analyze/:lootId',      stash.analyzeItem);

// Lookups
router.get('/lookup/loot',          stash.getAllLootNames);
router.get('/lookup/workshop-types', stash.getWorkshopTypes);

module.exports = router;

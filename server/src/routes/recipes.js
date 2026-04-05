// -----------------------------------------------
// Recipe routes — /api/recipes
// -----------------------------------------------
const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');

// GET /api/recipes?type=craft
// Returns all blueprints (currently all are 'craft' type globally)
router.get('/', async (req, res) => {
  try {
    const [blueprintRows] = await pool.query(
      `SELECT b.BlueprintID, b.Name, b.OutputLootID,
              o.Name AS OutputName, o.Rarity AS OutputRarity, o.Category AS OutputCategory
       FROM blueprints b
       JOIN loot o ON o.LootID = b.OutputLootID
       ORDER BY o.Name, b.BlueprintID`
    );

    // For each blueprint, get its components
    const recipes = [];
    for (const blueprint of blueprintRows) {
      const [componentRows] = await pool.query(
        `SELECT bc.LootID, bc.QuantityRequired,
                l.Name, l.Rarity, l.Category
         FROM blueprint_components bc
         JOIN loot l ON l.LootID = bc.LootID
         WHERE bc.BlueprintID = ?
         ORDER BY l.Name`,
        [blueprint.BlueprintID]
      );

      recipes.push({
        blueprintId: blueprint.BlueprintID,
        name:        blueprint.Name,
        output: {
          lootId:   blueprint.OutputLootID,
          name:     blueprint.OutputName,
          rarity:   blueprint.OutputRarity,
          category: blueprint.OutputCategory,
        },
        components: componentRows.map(c => ({
          lootId:   c.LootID,
          name:     c.Name,
          rarity:   c.Rarity,
          category: c.Category,
          quantity: c.QuantityRequired,
        })),
      });
    }

    res.json({ recipes });
  } catch (err) {
    console.error('getRecipes error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

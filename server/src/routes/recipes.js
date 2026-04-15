// -----------------------------------------------
// Recipe routes — /api/recipes (public)
// -----------------------------------------------
const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');

// GET /api/recipes
router.get('/', async (req, res) => {
  try {
    const [recipeRows] = await pool.query(
      `SELECT r.RecipeID, r.Name, r.OutputLootID, r.WorkshopType, r.WorkshopLevel, r.IsDefault,
              o.Name AS OutputName, o.Rarity AS OutputRarity,
              bp.BlueprintID, bp.LootID AS BlueprintLootID, l_bp.Name AS BlueprintItemName
       FROM recipes r
       JOIN loot o ON o.LootID = r.OutputLootID
       LEFT JOIN blueprints bp ON bp.RecipeID = r.RecipeID
       LEFT JOIN loot l_bp ON l_bp.LootID = bp.LootID
       ORDER BY o.Name, r.RecipeID`
    );

    const recipes = [];
    for (const recipe of recipeRows) {
      const [componentRows] = await pool.query(
        `SELECT rc.LootID, rc.QuantityRequired,
                l.Name, l.Rarity
         FROM recipe_components rc
         JOIN loot l ON l.LootID = rc.LootID
         WHERE rc.RecipeID = ?
         ORDER BY l.Name`,
        [recipe.RecipeID]
      );

      recipes.push({
        recipeId:      recipe.RecipeID,
        name:          recipe.Name,
        workshopType:  recipe.WorkshopType,
        workshopLevel: recipe.WorkshopLevel,
        isDefault:     !!recipe.IsDefault,
        output: {
          lootId: recipe.OutputLootID,
          name:   recipe.OutputName,
          rarity: recipe.OutputRarity,
        },
        blueprint: recipe.BlueprintID ? {
          blueprintId: recipe.BlueprintID,
          lootId:      recipe.BlueprintLootID,
          name:        recipe.BlueprintItemName,
        } : null,
        components: componentRows.map(c => ({
          lootId:   c.LootID,
          name:     c.Name,
          rarity:   c.Rarity,
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

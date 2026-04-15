// -----------------------------------------------
// Stash controller — user inventory, blueprints, workbenches
// -----------------------------------------------
const pool = require('../config/db');

// ==================== ITEMS (user_loot) ====================

async function getItems(req, res) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT ul.LootID, l.Name, l.Rarity, c.Name AS Category, ul.Quantity
       FROM user_loot ul
       JOIN loot l ON ul.LootID = l.LootID
       JOIN categories c ON l.CategoryID = c.CategoryID
       WHERE ul.UserID = ?
       ORDER BY l.Name`,
      [userId]
    );
    res.json({ items: rows });
  } catch (err) {
    console.error('Stash getItems error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function addItem(req, res) {
  try {
    const userId = req.user.id;
    const { lootId, quantity } = req.body;

    if (!lootId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'lootId and quantity (>= 1) are required' });
    }

    await pool.query(
      `INSERT INTO user_loot (UserID, LootID, Quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE Quantity = Quantity + ?`,
      [userId, lootId, quantity, quantity]
    );

    res.status(201).json({ message: 'Item added to stash' });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Invalid item ID' });
    }
    console.error('Stash addItem error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateItem(req, res) {
  try {
    const userId = req.user.id;
    const lootId = req.params.lootId;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: 'quantity must be >= 0' });
    }

    if (quantity === 0) {
      await pool.query(
        'DELETE FROM user_loot WHERE UserID = ? AND LootID = ?',
        [userId, lootId]
      );
    } else {
      const [result] = await pool.query(
        'UPDATE user_loot SET Quantity = ? WHERE UserID = ? AND LootID = ?',
        [quantity, userId, lootId]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Item not in stash' });
      }
    }

    res.json({ message: 'Stash updated' });
  } catch (err) {
    console.error('Stash updateItem error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function removeItem(req, res) {
  try {
    const userId = req.user.id;
    const lootId = req.params.lootId;

    const [result] = await pool.query(
      'DELETE FROM user_loot WHERE UserID = ? AND LootID = ?',
      [userId, lootId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not in stash' });
    }

    res.json({ message: 'Item removed from stash' });
  } catch (err) {
    console.error('Stash removeItem error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ==================== BLUEPRINTS (user_blueprints) ====================

async function getBlueprints(req, res) {
  try {
    const userId = req.user.id;

    // Get all blueprints with owned status
    const [rows] = await pool.query(
      `SELECT bp.BlueprintID, l_bp.Name AS BlueprintItemName,
              r.RecipeID, r.Name AS RecipeName, r.WorkshopType, r.WorkshopLevel,
              l_out.Name AS OutputName, l_out.Rarity AS OutputRarity,
              CASE WHEN ub.UserID IS NOT NULL THEN TRUE ELSE FALSE END AS Owned
       FROM blueprints bp
       JOIN loot l_bp ON bp.LootID = l_bp.LootID
       JOIN recipes r ON bp.RecipeID = r.RecipeID
       JOIN loot l_out ON r.OutputLootID = l_out.LootID
       LEFT JOIN user_blueprints ub ON ub.BlueprintID = bp.BlueprintID AND ub.UserID = ?
       ORDER BY l_bp.Name`,
      [userId]
    );

    res.json({ blueprints: rows });
  } catch (err) {
    console.error('Stash getBlueprints error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function toggleBlueprint(req, res) {
  try {
    const userId = req.user.id;
    const blueprintId = req.params.blueprintId;

    // Check if already owned
    const [[existing]] = await pool.query(
      'SELECT 1 FROM user_blueprints WHERE UserID = ? AND BlueprintID = ?',
      [userId, blueprintId]
    );

    if (existing) {
      await pool.query(
        'DELETE FROM user_blueprints WHERE UserID = ? AND BlueprintID = ?',
        [userId, blueprintId]
      );
      res.json({ owned: false });
    } else {
      await pool.query(
        'INSERT INTO user_blueprints (UserID, BlueprintID) VALUES (?, ?)',
        [userId, blueprintId]
      );
      res.json({ owned: true });
    }
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Invalid blueprint ID' });
    }
    console.error('Stash toggleBlueprint error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ==================== WORKBENCHES ====================

// "Workbench" is given to every user at level 1 and cannot be changed
const DEFAULT_WORKBENCH = { Category: 'Workbench', Level: 1, MaxLevel: 1, IsDefault: true };

async function getWorkbenches(req, res) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT WorkbenchID, Category, Level
       FROM workbenches
       WHERE UserID = ?
       ORDER BY Category`,
      [userId]
    );

    // Always include the default Workbench
    const hasDefault = rows.some(r => r.Category === 'Workbench');
    const workbenches = hasDefault
      ? rows.map(r => r.Category === 'Workbench'
          ? { ...r, Level: 1, MaxLevel: 1, IsDefault: true }
          : { ...r, MaxLevel: 3, IsDefault: false })
      : [{ WorkbenchID: null, ...DEFAULT_WORKBENCH }, ...rows.map(r => ({ ...r, MaxLevel: 3, IsDefault: false }))];

    res.json({ workbenches });
  } catch (err) {
    console.error('Stash getWorkbenches error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function upsertWorkbench(req, res) {
  try {
    const userId = req.user.id;
    const { category, level } = req.body;

    if (!category || !level || level < 1 || level > 3) {
      return res.status(400).json({ error: 'category and level (1-3) are required' });
    }

    // "Workbench" is fixed at level 1
    if (category === 'Workbench') {
      return res.status(400).json({ error: 'Workbench is a default bench and cannot be modified' });
    }

    await pool.query(
      `INSERT INTO workbenches (UserID, Category, Level)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE Level = ?`,
      [userId, category, level, level]
    );

    res.json({ message: 'Workbench saved' });
  } catch (err) {
    console.error('Stash upsertWorkbench error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function removeWorkbench(req, res) {
  try {
    const userId = req.user.id;
    const workbenchId = req.params.id;

    // Don't allow deleting the default Workbench
    const [[check]] = await pool.query(
      'SELECT Category FROM workbenches WHERE WorkbenchID = ? AND UserID = ?',
      [workbenchId, userId]
    );
    if (check && check.Category === 'Workbench') {
      return res.status(400).json({ error: 'Workbench is a default bench and cannot be removed' });
    }

    const [result] = await pool.query(
      'DELETE FROM workbenches WHERE WorkbenchID = ? AND UserID = ?',
      [workbenchId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Workbench not found' });
    }

    res.json({ message: 'Workbench removed' });
  } catch (err) {
    console.error('Stash removeWorkbench error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ==================== LOOKUP ====================

async function getAllLootNames(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT LootID, Name, Rarity FROM loot ORDER BY Name'
    );
    res.json({ items: rows });
  } catch (err) {
    console.error('Stash getAllLootNames error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getWorkshopTypes(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT WorkshopType FROM recipes ORDER BY WorkshopType'
    );
    res.json({ types: rows.map(r => r.WorkshopType) });
  } catch (err) {
    console.error('Stash getWorkshopTypes error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ==================== STASH ANALYSIS (for item detail page) ====================

async function analyzeItem(req, res) {
  try {
    const userId = req.user.id;
    const lootId = parseInt(req.params.lootId);
    if (isNaN(lootId)) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    // Get user's full stash
    const [stashRows] = await pool.query(
      `SELECT ul.LootID, l.Name, l.Rarity, ul.Quantity
       FROM user_loot ul
       JOIN loot l ON ul.LootID = l.LootID
       WHERE ul.UserID = ?`,
      [userId]
    );
    const stash = {};
    for (const row of stashRows) {
      stash[row.LootID] = { name: row.Name, rarity: row.Rarity, quantity: row.Quantity };
    }

    // Get user's workbenches
    const [wbRows] = await pool.query(
      'SELECT Category, Level FROM workbenches WHERE UserID = ?',
      [userId]
    );
    const userWorkbenches = { 'Workbench': 1 };  // Default workbench always available
    for (const wb of wbRows) {
      userWorkbenches[wb.Category] = wb.Level;
    }

    // Get user's owned blueprint IDs
    const [ubRows] = await pool.query(
      'SELECT BlueprintID FROM user_blueprints WHERE UserID = ?',
      [userId]
    );
    const ownedBlueprintIds = new Set(ubRows.map(r => r.BlueprintID));

    // 1) CRAFTING: get recipes that produce this item (with blueprint info)
    const [recipeRows] = await pool.query(
      `SELECT r.RecipeID, r.Name AS RecipeName, r.WorkshopType, r.WorkshopLevel, r.IsDefault,
              rc.LootID AS ComponentLootID, rc.QuantityRequired, l.Name AS ComponentName,
              bp.BlueprintID, l_bp.Name AS BlueprintItemName
       FROM recipes r
       JOIN recipe_components rc ON rc.RecipeID = r.RecipeID
       JOIN loot l ON l.LootID = rc.LootID
       LEFT JOIN blueprints bp ON bp.RecipeID = r.RecipeID
       LEFT JOIN loot l_bp ON l_bp.LootID = bp.LootID
       WHERE r.OutputLootID = ?
       ORDER BY r.RecipeID, l.Name`,
      [lootId]
    );

    // Group by recipe
    const recipeMap = new Map();
    for (const row of recipeRows) {
      if (!recipeMap.has(row.RecipeID)) {
        const wbLevel = userWorkbenches[row.WorkshopType] || 0;
        const hasWorkbench = wbLevel >= row.WorkshopLevel;
        const isDefault = !!row.IsDefault;
        const hasBlueprint = isDefault || (row.BlueprintID && ownedBlueprintIds.has(row.BlueprintID));

        recipeMap.set(row.RecipeID, {
          recipeId: row.RecipeID,
          name: row.RecipeName,
          workshopType: row.WorkshopType,
          workshopLevel: row.WorkshopLevel,
          isDefault: isDefault,
          blueprint: row.BlueprintID ? { id: row.BlueprintID, name: row.BlueprintItemName } : null,
          hasBlueprint: hasBlueprint,
          hasWorkbench: hasWorkbench,
          userWorkbenchLevel: wbLevel,
          components: [],
        });
      }
      const have = stash[row.ComponentLootID]?.quantity || 0;
      recipeMap.get(row.RecipeID).components.push({
        lootId: row.ComponentLootID,
        name: row.ComponentName,
        needed: row.QuantityRequired,
        have: have,
        enough: have >= row.QuantityRequired,
      });
    }

    const craftingOptions = Array.from(recipeMap.values()).map(recipe => ({
      ...recipe,
      canCraft: recipe.components.every(c => c.enough) && recipe.hasWorkbench && recipe.hasBlueprint,
    }));

    // 2) RECYCLING: which items in the user's stash break down into this item?
    const [recycleRows] = await pool.query(
      `SELECT lb.LootID, l.Name, l.Rarity, lb.Quantity AS YieldsQty
       FROM loot_breakdown lb
       JOIN loot l ON l.LootID = lb.LootID
       WHERE lb.ComponentLootID = ?
       ORDER BY l.Name`,
      [lootId]
    );

    const recycleOptions = recycleRows
      .filter(row => stash[row.LootID] && stash[row.LootID].quantity > 0)
      .map(row => ({
        lootId: row.LootID,
        name: row.Name,
        rarity: row.Rarity,
        yieldsQty: row.YieldsQty,
        haveQty: stash[row.LootID].quantity,
      }));

    // 3) Direct ownership: does user already have this item?
    const directHave = stash[lootId]?.quantity || 0;

    res.json({
      directHave,
      craftingOptions,
      recycleOptions,
    });
  } catch (err) {
    console.error('Stash analyzeItem error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getItems, addItem, updateItem, removeItem,
  getBlueprints, toggleBlueprint,
  getWorkbenches, upsertWorkbench, removeWorkbench,
  getAllLootNames, getWorkshopTypes,
  analyzeItem,
};

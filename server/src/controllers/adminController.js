// -----------------------------------------------
// Admin controller — dashboard, users, loot, blueprints, breakdowns, locations
// -----------------------------------------------
const pool = require('../config/db');

// ==================== DASHBOARD ====================

async function getStats(req, res) {
  try {
    const [[{ userCount }]]      = await pool.query('SELECT COUNT(*) AS userCount FROM users');
    const [[{ lootCount }]]      = await pool.query('SELECT COUNT(*) AS lootCount FROM loot');
    const [[{ recipeCount }]]    = await pool.query('SELECT COUNT(*) AS recipeCount FROM recipes');
    const [[{ blueprintCount }]] = await pool.query('SELECT COUNT(*) AS blueprintCount FROM blueprints');

    // Active users = anyone with a LastActiveAt within the last 5 minutes
    const [[{ activeCount }]] = await pool.query(
      'SELECT COUNT(*) AS activeCount FROM users WHERE LastActiveAt >= NOW() - INTERVAL 5 MINUTE'
    );

    // Recent users
    const [recentUsers] = await pool.query(
      'SELECT UserID, Username, Email, IsAdmin, LastActiveAt, CreatedAt FROM users ORDER BY CreatedAt DESC LIMIT 5'
    );

    res.json({
      counts: { users: userCount, loot: lootCount, recipes: recipeCount, blueprints: blueprintCount, active: activeCount },
      recentUsers,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ==================== USERS ====================

async function getUsers(req, res) {
  try {
    const { search, page = 1, limit = 25 } = req.query;
    const offset = (page - 1) * limit;

    let where = '';
    const params = [];

    if (search) {
      where = 'WHERE Username LIKE ? OR Email LIKE ? OR GamerTag LIKE ?';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM users ${where}`, params
    );

    const [rows] = await pool.query(
      `SELECT UserID, Username, Email, GamerTag, IsAdmin, CreatedAt FROM users ${where} ORDER BY CreatedAt DESC LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    res.json({
      users: rows,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Admin getUsers error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Prevent admins from deleting themselves
    if (Number(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account from admin panel' });
    }

    const [result] = await pool.query('DELETE FROM users WHERE UserID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Admin deleteUser error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function toggleAdmin(req, res) {
  try {
    const { id } = req.params;

    if (Number(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot change your own admin status' });
    }

    const [rows] = await pool.query('SELECT IsAdmin FROM users WHERE UserID = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newStatus = !rows[0].IsAdmin;
    await pool.query('UPDATE users SET IsAdmin = ? WHERE UserID = ?', [newStatus, id]);

    res.json({ message: `User ${newStatus ? 'promoted to' : 'removed from'} admin`, isAdmin: newStatus });
  } catch (err) {
    console.error('Admin toggleAdmin error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ==================== LOOT ====================

async function getLoot(req, res) {
  try {
    const { search, rarity, category, page = 1, limit = 25 } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];

    if (search) {
      conditions.push('(l.Name LIKE ? OR l.Description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (rarity) {
      conditions.push('l.Rarity = ?');
      params.push(rarity);
    }
    if (category) {
      conditions.push('c.Name = ?');
      params.push(category);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const fromClause = `FROM loot l
       JOIN categories c ON l.CategoryID = c.CategoryID
       LEFT JOIN found_in fi ON l.FoundInID = fi.FoundInID`;

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total ${fromClause} ${where}`, params);
    const [rows] = await pool.query(
      `SELECT l.*, c.Name AS CategoryName, c.IconURL AS CategoryIcon,
              fi.Name AS FoundInName, fi.IconURL AS FoundInIcon
       ${fromClause} ${where}
       ORDER BY l.Name LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    res.json({
      items: rows,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Admin getLoot error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createLoot(req, res) {
  try {
    const { name, description, rarity, categoryId, foundInId, imageUrl } = req.body;

    if (!name || !description || !rarity || !categoryId) {
      return res.status(400).json({ error: 'name, description, rarity, and categoryId are required' });
    }

    const validRarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    if (!validRarities.includes(rarity)) {
      return res.status(400).json({ error: `Rarity must be one of: ${validRarities.join(', ')}` });
    }

    const [result] = await pool.query(
      'INSERT INTO loot (Name, Description, Rarity, CategoryID, FoundInID, ImageURL) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, rarity, categoryId, foundInId || null, imageUrl || null]
    );

    res.status(201).json({ message: 'Item created', lootId: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'An item with that name already exists' });
    }
    console.error('Admin createLoot error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateLoot(req, res) {
  try {
    const { id } = req.params;
    const { name, description, rarity, categoryId, foundInId, imageUrl } = req.body;

    if (!name || !description || !rarity || !categoryId) {
      return res.status(400).json({ error: 'name, description, rarity, and categoryId are required' });
    }

    const validRarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    if (!validRarities.includes(rarity)) {
      return res.status(400).json({ error: `Rarity must be one of: ${validRarities.join(', ')}` });
    }

    const [result] = await pool.query(
      'UPDATE loot SET Name = ?, Description = ?, Rarity = ?, CategoryID = ?, FoundInID = ?, ImageURL = ? WHERE LootID = ?',
      [name, description, rarity, categoryId, foundInId || null, imageUrl || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item updated' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'An item with that name already exists' });
    }
    console.error('Admin updateLoot error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteLoot(req, res) {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM loot WHERE LootID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted' });
  } catch (err) {
    // FK constraint — item is referenced somewhere
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ error: 'Cannot delete — this item is used in blueprints, breakdowns, or inventories. Remove those references first.' });
    }
    console.error('Admin deleteLoot error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ==================== RECIPES ====================

async function getRecipes(req, res) {
  try {
    const { search, page = 1, limit = 25 } = req.query;
    const offset = (page - 1) * limit;

    let where = '';
    const params = [];
    if (search) {
      where = 'WHERE r.Name LIKE ? OR l.Name LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM recipes r JOIN loot l ON r.OutputLootID = l.LootID ${where}`, params
    );

    const [recipes] = await pool.query(
      `SELECT r.RecipeID, r.Name, r.OutputLootID, l.Name AS OutputName, l.Rarity AS OutputRarity,
              r.WorkshopType, r.WorkshopLevel, r.IsDefault, r.CreatedAt
       FROM recipes r JOIN loot l ON r.OutputLootID = l.LootID ${where}
       ORDER BY r.Name LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    // Fetch components for all recipes on this page
    const ids = recipes.map(r => r.RecipeID);
    let componentsMap = {};
    if (ids.length > 0) {
      const [components] = await pool.query(
        `SELECT rc.RecipeID, rc.LootID, rc.QuantityRequired, l.Name AS ComponentName
         FROM recipe_components rc JOIN loot l ON rc.LootID = l.LootID
         WHERE rc.RecipeID IN (?)`,
        [ids]
      );
      for (const c of components) {
        if (!componentsMap[c.RecipeID]) componentsMap[c.RecipeID] = [];
        componentsMap[c.RecipeID].push(c);
      }
    }

    // Fetch linked blueprints
    let blueprintMap = {};
    if (ids.length > 0) {
      const [bps] = await pool.query(
        `SELECT bp.RecipeID, bp.BlueprintID, bp.LootID, l.Name AS BlueprintItemName
         FROM blueprints bp JOIN loot l ON bp.LootID = l.LootID
         WHERE bp.RecipeID IN (?)`,
        [ids]
      );
      for (const bp of bps) {
        blueprintMap[bp.RecipeID] = bp;
      }
    }

    const result = recipes.map(r => ({
      ...r,
      components: componentsMap[r.RecipeID] || [],
      blueprint: blueprintMap[r.RecipeID] || null,
    }));

    res.json({
      recipes: result,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Admin getRecipes error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createRecipe(req, res) {
  const conn = await pool.getConnection();
  try {
    const { name, outputLootId, workshopType, workshopLevel, isDefault, components } = req.body;

    if (!name || !outputLootId || !workshopType) {
      return res.status(400).json({ error: 'name, outputLootId, and workshopType are required' });
    }
    const level = Number(workshopLevel) || 1;
    if (level < 1 || level > 3) {
      return res.status(400).json({ error: 'workshopLevel must be 1, 2, or 3' });
    }
    if (!Array.isArray(components) || components.length === 0) {
      return res.status(400).json({ error: 'At least one component is required' });
    }

    await conn.beginTransaction();

    const [result] = await conn.query(
      'INSERT INTO recipes (Name, OutputLootID, WorkshopType, WorkshopLevel, IsDefault) VALUES (?, ?, ?, ?, ?)',
      [name, outputLootId, workshopType, level, !!isDefault]
    );
    const recipeId = result.insertId;

    for (const comp of components) {
      await conn.query(
        'INSERT INTO recipe_components (RecipeID, LootID, QuantityRequired) VALUES (?, ?, ?)',
        [recipeId, comp.lootId, comp.quantity]
      );
    }

    await conn.commit();
    res.status(201).json({ message: 'Recipe created', recipeId });
  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Invalid loot ID referenced' });
    }
    console.error('Admin createRecipe error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    conn.release();
  }
}

async function updateRecipe(req, res) {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    const { name, outputLootId, workshopType, workshopLevel, isDefault, components } = req.body;

    if (!name || !outputLootId || !workshopType) {
      return res.status(400).json({ error: 'name, outputLootId, and workshopType are required' });
    }
    const level = Number(workshopLevel) || 1;
    if (level < 1 || level > 3) {
      return res.status(400).json({ error: 'workshopLevel must be 1, 2, or 3' });
    }
    if (!Array.isArray(components) || components.length === 0) {
      return res.status(400).json({ error: 'At least one component is required' });
    }

    await conn.beginTransaction();

    const [result] = await conn.query(
      'UPDATE recipes SET Name = ?, OutputLootID = ?, WorkshopType = ?, WorkshopLevel = ?, IsDefault = ? WHERE RecipeID = ?',
      [name, outputLootId, workshopType, level, !!isDefault, id]
    );
    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Replace all components
    await conn.query('DELETE FROM recipe_components WHERE RecipeID = ?', [id]);
    for (const comp of components) {
      await conn.query(
        'INSERT INTO recipe_components (RecipeID, LootID, QuantityRequired) VALUES (?, ?, ?)',
        [id, comp.lootId, comp.quantity]
      );
    }

    await conn.commit();
    res.json({ message: 'Recipe updated' });
  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Invalid loot ID referenced' });
    }
    console.error('Admin updateRecipe error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    conn.release();
  }
}

async function deleteRecipe(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM recipes WHERE RecipeID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ error: 'Cannot delete — a blueprint references this recipe. Remove the blueprint first.' });
    }
    console.error('Admin deleteRecipe error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ==================== BLUEPRINTS ====================

async function getBlueprints(req, res) {
  try {
    const { search, page = 1, limit = 25 } = req.query;
    const offset = (page - 1) * limit;

    let where = '';
    const params = [];
    if (search) {
      where = 'WHERE l_bp.Name LIKE ? OR l_out.Name LIKE ? OR r.Name LIKE ?';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM blueprints bp
       JOIN loot l_bp ON bp.LootID = l_bp.LootID
       JOIN recipes r ON bp.RecipeID = r.RecipeID
       JOIN loot l_out ON r.OutputLootID = l_out.LootID ${where}`, params
    );

    const [rows] = await pool.query(
      `SELECT bp.BlueprintID, bp.LootID, l_bp.Name AS BlueprintItemName,
              bp.RecipeID, r.Name AS RecipeName,
              r.OutputLootID, l_out.Name AS OutputName
       FROM blueprints bp
       JOIN loot l_bp ON bp.LootID = l_bp.LootID
       JOIN recipes r ON bp.RecipeID = r.RecipeID
       JOIN loot l_out ON r.OutputLootID = l_out.LootID
       ${where}
       ORDER BY l_bp.Name LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    res.json({
      blueprints: rows,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Admin getBlueprints error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createBlueprint(req, res) {
  try {
    const { lootId, recipeId } = req.body;
    if (!lootId || !recipeId) {
      return res.status(400).json({ error: 'lootId (the blueprint item) and recipeId are required' });
    }

    await pool.query(
      'INSERT INTO blueprints (LootID, RecipeID) VALUES (?, ?)',
      [lootId, recipeId]
    );

    res.status(201).json({ message: 'Blueprint created' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'This item or recipe is already linked to a blueprint' });
    }
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Invalid loot ID or recipe ID' });
    }
    console.error('Admin createBlueprint error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteBlueprint(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM blueprints WHERE BlueprintID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Blueprint not found' });
    }
    res.json({ message: 'Blueprint deleted' });
  } catch (err) {
    console.error('Admin deleteBlueprint error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Lookup: recipes not yet linked to a blueprint (for the blueprint create form)
async function getUnlinkedRecipes(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT r.RecipeID, r.Name, l.Name AS OutputName
       FROM recipes r
       JOIN loot l ON r.OutputLootID = l.LootID
       WHERE r.RecipeID NOT IN (SELECT RecipeID FROM blueprints)
       ORDER BY r.Name`
    );
    res.json({ recipes: rows });
  } catch (err) {
    console.error('Admin getUnlinkedRecipes error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ==================== RECYCLABLES (breakdowns) ====================

async function getBreakdowns(req, res) {
  try {
    const { search, page = 1, limit = 25 } = req.query;
    const offset = (page - 1) * limit;

    // Count distinct source items (for pagination)
    let sourceWhere = '';
    const sourceParams = [];
    if (search) {
      sourceWhere = 'WHERE l1.Name LIKE ?';
      sourceParams.push(`%${search}%`);
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(DISTINCT lb.LootID) AS total FROM loot_breakdown lb
       JOIN loot l1 ON lb.LootID = l1.LootID ${sourceWhere}`, sourceParams
    );

    // Get the paginated source item IDs
    const [sourceRows] = await pool.query(
      `SELECT DISTINCT lb.LootID, l1.Name AS SourceName
       FROM loot_breakdown lb
       JOIN loot l1 ON lb.LootID = l1.LootID
       ${sourceWhere}
       ORDER BY l1.Name LIMIT ? OFFSET ?`,
      [...sourceParams, Number(limit), Number(offset)]
    );

    if (sourceRows.length === 0) {
      return res.json({
        breakdowns: [],
        pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
      });
    }

    // Get all components for these source items
    const sourceIds = sourceRows.map(r => r.LootID);
    const [compRows] = await pool.query(
      `SELECT lb.LootID, lb.ComponentLootID, l2.Name AS ComponentName, lb.Quantity
       FROM loot_breakdown lb
       JOIN loot l2 ON lb.ComponentLootID = l2.LootID
       WHERE lb.LootID IN (?)
       ORDER BY l2.Name`,
      [sourceIds]
    );

    // Group components under each source item
    const breakdowns = sourceRows.map(src => ({
      LootID: src.LootID,
      SourceName: src.SourceName,
      components: compRows
        .filter(c => c.LootID === src.LootID)
        .map(c => ({
          ComponentLootID: c.ComponentLootID,
          ComponentName: c.ComponentName,
          Quantity: c.Quantity,
        })),
    }));

    res.json({
      breakdowns,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Admin getBreakdowns error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createBreakdown(req, res) {
  try {
    const { lootId, componentLootId, quantity } = req.body;

    if (!lootId || !componentLootId || !quantity) {
      return res.status(400).json({ error: 'lootId, componentLootId, and quantity are required' });
    }
    if (Number(lootId) === Number(componentLootId)) {
      return res.status(400).json({ error: 'An item cannot break down into itself' });
    }

    await pool.query(
      'INSERT INTO loot_breakdown (LootID, ComponentLootID, Quantity) VALUES (?, ?, ?)',
      [lootId, componentLootId, quantity]
    );

    res.status(201).json({ message: 'Breakdown created' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'This breakdown already exists' });
    }
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Invalid loot ID' });
    }
    console.error('Admin createBreakdown error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateBreakdown(req, res) {
  try {
    const { lootId, componentLootId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'quantity must be at least 1' });
    }

    const [result] = await pool.query(
      'UPDATE loot_breakdown SET Quantity = ? WHERE LootID = ? AND ComponentLootID = ?',
      [quantity, lootId, componentLootId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Breakdown not found' });
    }

    res.json({ message: 'Breakdown updated' });
  } catch (err) {
    console.error('Admin updateBreakdown error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteBreakdown(req, res) {
  try {
    const { lootId, componentLootId } = req.params;

    const [result] = await pool.query(
      'DELETE FROM loot_breakdown WHERE LootID = ? AND ComponentLootID = ?',
      [lootId, componentLootId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Breakdown not found' });
    }

    res.json({ message: 'Breakdown deleted' });
  } catch (err) {
    console.error('Admin deleteBreakdown error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ==================== LOCATIONS ====================

async function getLocations(req, res) {
  try {
    const { search, page = 1, limit = 25 } = req.query;
    const offset = (page - 1) * limit;

    let where = '';
    const params = [];
    if (search) {
      where = 'WHERE l.Name LIKE ? OR ll.LocationName LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM loot_locations ll JOIN loot l ON ll.LootID = l.LootID ${where}`, params
    );

    const [rows] = await pool.query(
      `SELECT ll.LootID, l.Name AS ItemName, ll.LocationName
       FROM loot_locations ll JOIN loot l ON ll.LootID = l.LootID
       ${where}
       ORDER BY l.Name, ll.LocationName LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    res.json({
      locations: rows,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Admin getLocations error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createLocation(req, res) {
  try {
    const { lootId, locationName } = req.body;

    if (!lootId || !locationName) {
      return res.status(400).json({ error: 'lootId and locationName are required' });
    }

    await pool.query(
      'INSERT INTO loot_locations (LootID, LocationName) VALUES (?, ?)',
      [lootId, locationName.trim()]
    );

    res.status(201).json({ message: 'Location created' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'This location entry already exists' });
    }
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Invalid loot ID' });
    }
    console.error('Admin createLocation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteLocation(req, res) {
  try {
    const { lootId, locationName } = req.params;

    const [result] = await pool.query(
      'DELETE FROM loot_locations WHERE LootID = ? AND LocationName = ?',
      [lootId, decodeURIComponent(locationName)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json({ message: 'Location deleted' });
  } catch (err) {
    console.error('Admin deleteLocation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ==================== LOOT LOOKUP (for dropdowns) ====================

async function getAllLootNames(req, res) {
  try {
    const [rows] = await pool.query('SELECT LootID, Name FROM loot ORDER BY Name');
    res.json({ items: rows });
  } catch (err) {
    console.error('Admin getAllLootNames error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ==================== CATEGORIES CRUD ====================

async function getCategoryList(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY SortOrder, Name');
    res.json({ categories: rows });
  } catch (err) {
    console.error('Admin getCategoryList error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createCategory(req, res) {
  try {
    const { name, iconUrl } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const [result] = await pool.query(
      'INSERT INTO categories (Name, IconURL) VALUES (?, ?)',
      [name, iconUrl || null]
    );
    res.status(201).json({ message: 'Category created', categoryId: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Category already exists' });
    console.error('Admin createCategory error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, iconUrl } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const [result] = await pool.query(
      'UPDATE categories SET Name = ?, IconURL = ? WHERE CategoryID = ?',
      [name, iconUrl || null, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category updated' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Category name already exists' });
    console.error('Admin updateCategory error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM categories WHERE CategoryID = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ error: 'Category is in use by items' });
    console.error('Admin deleteCategory error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ==================== FOUND_IN CRUD ====================

async function getFoundInList(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM found_in ORDER BY SortOrder, Name');
    res.json({ foundIn: rows });
  } catch (err) {
    console.error('Admin getFoundInList error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createFoundIn(req, res) {
  try {
    const { name, iconUrl } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const [result] = await pool.query(
      'INSERT INTO found_in (Name, IconURL) VALUES (?, ?)',
      [name, iconUrl || null]
    );
    res.status(201).json({ message: 'FoundIn created', foundInId: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'FoundIn already exists' });
    console.error('Admin createFoundIn error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateFoundIn(req, res) {
  try {
    const { id } = req.params;
    const { name, iconUrl } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const [result] = await pool.query(
      'UPDATE found_in SET Name = ?, IconURL = ? WHERE FoundInID = ?',
      [name, iconUrl || null, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'FoundIn not found' });
    res.json({ message: 'FoundIn updated' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'FoundIn name already exists' });
    console.error('Admin updateFoundIn error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteFoundIn(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM found_in WHERE FoundInID = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'FoundIn not found' });
    res.json({ message: 'FoundIn deleted' });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ error: 'FoundIn is in use by items' });
    console.error('Admin deleteFoundIn error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getStats,
  getUsers, deleteUser, toggleAdmin,
  getLoot, createLoot, updateLoot, deleteLoot,
  getRecipes, createRecipe, updateRecipe, deleteRecipe,
  getBlueprints, createBlueprint, deleteBlueprint, getUnlinkedRecipes,
  getBreakdowns, createBreakdown, updateBreakdown, deleteBreakdown,
  getLocations, createLocation, deleteLocation,
  getAllLootNames,
  getCategoryList, createCategory, updateCategory, deleteCategory,
  getFoundInList, createFoundIn, updateFoundIn, deleteFoundIn,
};

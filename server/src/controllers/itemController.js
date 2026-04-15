// -----------------------------------------------
// Item controller — CRUD + search for items
// -----------------------------------------------
const pool = require('../config/db');

// Map PascalCase MySQL loot row to camelCase for the frontend
function mapItem(row) {
  return {
    lootId:       row.LootID,
    name:         row.Name,
    description:  row.Description,
    rarity:       row.Rarity,
    category:     row.CategoryName || row.Category || null,
    categoryIcon: row.CategoryIcon || null,
    foundIn:      row.FoundInName || row.FoundIn || null,
    foundInIcon:  row.FoundInIcon || null,
    imageUrl:     row.ImageURL || '/images/default-item.svg',
  };
}

// GET /api/items?search=&rarity=&category=&page=&limit=
async function getItems(req, res) {
  try {
    const {
      search   = '',
      rarity   = '',
      category = '',
      page     = 1,
      limit    = 20,
    } = req.query;

    const safeLimit  = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const safePage   = Math.max(parseInt(page) || 1, 1);
    const offset     = (safePage - 1) * safeLimit;

    let where   = [];
    let params  = [];

    if (search) {
      where.push('(l.Name LIKE ? OR l.Description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (rarity) {
      where.push('l.Rarity = ?');
      params.push(rarity);
    }
    if (category) {
      where.push('c.Name = ?');
      params.push(category);
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const fromClause = `FROM loot l
       JOIN categories c ON l.CategoryID = c.CategoryID
       LEFT JOIN found_in fi ON l.FoundInID = fi.FoundInID`;

    // Count total matching rows
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total ${fromClause} ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    // Fetch page of items
    const [rawItems] = await pool.query(
      `SELECT l.*, c.Name AS CategoryName, c.IconURL AS CategoryIcon,
              fi.Name AS FoundInName, fi.IconURL AS FoundInIcon
       ${fromClause} ${whereClause}
       ORDER BY l.Name ASC LIMIT ? OFFSET ?`,
      [...params, safeLimit, offset]
    );

    // Normalize PascalCase MySQL columns to camelCase for frontend
    const items = rawItems.map(mapItem);

    res.json({
      items,
      pagination: {
        page:       safePage,
        limit:      safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    });
  } catch (err) {
    console.error('getItems error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/items/:id (by LootID)
async function getItemById(req, res) {
  try {
    const { id } = req.params;
    const lootId = parseInt(id);
    if (isNaN(lootId)) {
      return res.status(400).json({ error: 'Invalid LootID' });
    }

    // Get the item
    const [rows] = await pool.query(
      `SELECT l.*, c.Name AS CategoryName, c.IconURL AS CategoryIcon,
              fi.Name AS FoundInName, fi.IconURL AS FoundInIcon
       FROM loot l
       JOIN categories c ON l.CategoryID = c.CategoryID
       LEFT JOIN found_in fi ON l.FoundInID = fi.FoundInID
       WHERE l.LootID = ?`,
      [lootId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = mapItem(rows[0]);

    // Fetch recipes that PRODUCE this item
    const [recipeRows] = await pool.query(
      `SELECT r.RecipeID, r.Name, r.WorkshopType, r.WorkshopLevel, r.IsDefault,
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

    // Group by RecipeID
    const recipeMap = new Map();
    for (const row of recipeRows) {
      if (!recipeMap.has(row.RecipeID)) {
        recipeMap.set(row.RecipeID, {
          recipeId:      row.RecipeID,
          name:          row.Name,
          workshopType:  row.WorkshopType,
          workshopLevel: row.WorkshopLevel,
          isDefault:     !!row.IsDefault,
          blueprint:     row.BlueprintID ? { id: row.BlueprintID, name: row.BlueprintItemName } : null,
          components:    [],
        });
      }
      recipeMap.get(row.RecipeID).components.push({
        lootId:   row.ComponentLootID,
        name:     row.ComponentName,
        quantity: row.QuantityRequired,
      });
    }
    const crafting = Array.from(recipeMap.values());

    // Fetch items that break DOWN INTO this item
    // (items that have this as a component in their breakdown)
    const [breakdownSourceRows] = await pool.query(
      `SELECT lb.LootID, l.Name, lb.Quantity
       FROM loot_breakdown lb
       JOIN loot l ON l.LootID = lb.LootID
       WHERE lb.ComponentLootID = ?`,
      [lootId]
    );

    const breakdownSources = breakdownSourceRows.map(row => ({
      lootId:   row.LootID,
      name:     row.Name,
      quantity: row.Quantity,
    }));

    // Fetch what this item itself breaks into
    const [breaksIntoRows] = await pool.query(
      `SELECT lb.ComponentLootID, l.Name, lb.Quantity
       FROM loot_breakdown lb
       JOIN loot l ON l.LootID = lb.ComponentLootID
       WHERE lb.LootID = ?`,
      [lootId]
    );

    const breaksInto = breaksIntoRows.map(row => ({
      lootId:   row.ComponentLootID,
      name:     row.Name,
      quantity: row.Quantity,
    }));

    res.json({
      item,
      crafting,
      breakdownSources,
      breaksInto,
    });
  } catch (err) {
    console.error('getItemById error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/items/:id/tree
// Returns the full crafting dependency tree for an item (recursive)
async function getCraftingTree(req, res) {
  try {
    const { id } = req.params;
    const lootId = parseInt(id);
    if (isNaN(lootId)) {
      return res.status(400).json({ error: 'Invalid LootID' });
    }

    const [rows] = await pool.query(
      'SELECT LootID FROM loot WHERE LootID = ?',
      [lootId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const rootItem = rows[0];
    const tree = await buildCraftingTree(rootItem.LootID, new Set());

    res.json(tree);
  } catch (err) {
    console.error('getCraftingTree error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Recursive helper: build crafting tree for an item
async function buildCraftingTree(lootId, visited) {
  // Prevent infinite loops from circular recipes
  if (visited.has(lootId)) {
    return { circular: true };
  }
  visited.add(lootId);

  const [itemRows] = await pool.query(
    `SELECT l.LootID, l.Name, l.Rarity, c.Name AS Category
     FROM loot l
     JOIN categories c ON l.CategoryID = c.CategoryID
     WHERE l.LootID = ?`,
    [lootId]
  );
  if (itemRows.length === 0) return null;

  const item = itemRows[0];

  // Get recipes that PRODUCE this item
  const [recipeRows] = await pool.query(
    `SELECT r.RecipeID, r.Name, r.WorkshopType, r.WorkshopLevel,
            rc.LootID AS ComponentLootID, rc.QuantityRequired
     FROM recipes r
     JOIN recipe_components rc ON rc.RecipeID = r.RecipeID
     WHERE r.OutputLootID = ?
     ORDER BY r.RecipeID`,
    [lootId]
  );

  // If no recipe, this is a base material (leaf node)
  if (recipeRows.length === 0) {
    return {
      lootId:   item.LootID,
      name:     item.Name,
      rarity:   item.Rarity,
      category: item.Category,
      ingredients: []
    };
  }

  // Get the first recipe and its components
  const firstRecipeId = recipeRows[0].RecipeID;
  const ingredients = recipeRows.filter(r => r.RecipeID === firstRecipeId);

  // Recurse into each component
  const children = [];
  for (const ing of ingredients) {
    const childTree = await buildCraftingTree(ing.ComponentLootID, new Set(visited));
    if (childTree) {
      children.push({
        quantity: ing.QuantityRequired,
        ...childTree,
      });
    } else {
      // Item not found in DB — show a stub
      children.push({
        quantity: ing.QuantityRequired,
        lootId: ing.ComponentLootID,
        name: `Unknown Item #${ing.ComponentLootID}`,
        rarity: 'Common',
        category: 'Unknown',
        ingredients: [],
      });
    }
  }

  return {
    lootId:   item.LootID,
    name:     item.Name,
    rarity:   item.Rarity,
    category: item.Category,
    recipeId: firstRecipeId,
    workshopType: recipeRows[0].WorkshopType,
    workshopLevel: recipeRows[0].WorkshopLevel,
    ingredients: children,
  };
}

// GET /api/items/:id/recycle-tree
// Returns the full recycling source tree for an item (recursive upward)
// "What items can I recycle to eventually get this item?"
async function getRecyclingTree(req, res) {
  try {
    const { id } = req.params;
    const lootId = parseInt(id);
    if (isNaN(lootId)) {
      return res.status(400).json({ error: 'Invalid LootID' });
    }

    const [rows] = await pool.query(
      'SELECT LootID FROM loot WHERE LootID = ?',
      [lootId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const tree = await buildRecyclingTree(lootId, new Set());
    res.json(tree);
  } catch (err) {
    console.error('getRecyclingTree error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Recursive helper: find all items that recycle INTO this item, then recurse upward
async function buildRecyclingTree(lootId, visited) {
  if (visited.has(lootId)) {
    return { circular: true };
  }
  visited.add(lootId);

  const [itemRows] = await pool.query(
    `SELECT l.LootID, l.Name, l.Rarity, c.Name AS Category
     FROM loot l
     JOIN categories c ON l.CategoryID = c.CategoryID
     WHERE l.LootID = ?`,
    [lootId]
  );
  if (itemRows.length === 0) return null;

  const item = itemRows[0];

  // Find items that break down INTO this item
  const [sourceRows] = await pool.query(
    `SELECT lb.LootID AS SourceLootID, l.Name, l.Rarity, c.Name AS Category, lb.Quantity
     FROM loot_breakdown lb
     JOIN loot l ON l.LootID = lb.LootID
     JOIN categories c ON l.CategoryID = c.CategoryID
     WHERE lb.ComponentLootID = ?
     ORDER BY l.Name`,
    [lootId]
  );

  // If nothing recycles into this, it's a leaf (no sources)
  if (sourceRows.length === 0) {
    return {
      lootId: item.LootID,
      name: item.Name,
      rarity: item.Rarity,
      category: item.Category,
      sources: [],
    };
  }

  // Recurse upward into each source
  const sources = [];
  for (const src of sourceRows) {
    const childTree = await buildRecyclingTree(src.SourceLootID, new Set(visited));
    if (childTree) {
      sources.push({
        yieldsQty: src.Quantity,
        ...childTree,
      });
    } else {
      sources.push({
        yieldsQty: src.Quantity,
        lootId: src.SourceLootID,
        name: src.Name || `Unknown Item #${src.SourceLootID}`,
        rarity: src.Rarity || 'Common',
        category: src.Category || 'Unknown',
        sources: [],
      });
    }
  }

  return {
    lootId: item.LootID,
    name: item.Name,
    rarity: item.Rarity,
    category: item.Category,
    sources,
  };
}

async function getCategories(req, res) {
  try {
    const [rows] = await pool.query('SELECT CategoryID, Name FROM categories ORDER BY SortOrder, Name');
    res.json({ categories: rows });
  } catch (err) {
    console.error('getCategories error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getItems, getItemById, getCraftingTree, getRecyclingTree, getCategories };

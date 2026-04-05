// -----------------------------------------------
// Item controller — CRUD + search for items
// -----------------------------------------------
const pool = require('../config/db');

// Map PascalCase MySQL loot row to camelCase for the frontend
function mapItem(row) {
  return {
    lootId:      row.LootID,
    name:        row.Name,
    description: row.Description,
    rarity:      row.Rarity,
    category:    row.Category,
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
      where.push('(Name LIKE ? OR Description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (rarity) {
      where.push('Rarity = ?');
      params.push(rarity);
    }
    if (category) {
      where.push('Category = ?');
      params.push(category);
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    // Count total matching rows
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM loot ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    // Fetch page of items
    const [rawItems] = await pool.query(
      `SELECT * FROM loot ${whereClause} ORDER BY Name ASC LIMIT ? OFFSET ?`,
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
      'SELECT * FROM loot WHERE LootID = ?',
      [lootId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = mapItem(rows[0]);

    // Fetch blueprints that PRODUCE this item (OutputLootID = this item)
    const [blueprintRows] = await pool.query(
      `SELECT b.BlueprintID, b.Name, bc.LootID AS ComponentLootID,
              bc.QuantityRequired, l.Name AS ComponentName
       FROM blueprints b
       JOIN blueprint_components bc ON bc.BlueprintID = b.BlueprintID
       JOIN loot l ON l.LootID = bc.LootID
       WHERE b.OutputLootID = ?
       ORDER BY b.BlueprintID, l.Name`,
      [lootId]
    );

    // Group blueprints by BlueprintID
    const blueprintMap = new Map();
    for (const row of blueprintRows) {
      if (!blueprintMap.has(row.BlueprintID)) {
        blueprintMap.set(row.BlueprintID, {
          blueprintId: row.BlueprintID,
          name:        row.Name,
          components:  [],
        });
      }
      blueprintMap.get(row.BlueprintID).components.push({
        lootId:   row.ComponentLootID,
        name:     row.ComponentName,
        quantity: row.QuantityRequired,
      });
    }
    const crafting = Array.from(blueprintMap.values());

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
      'SELECT * FROM loot WHERE LootID = ?',
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
    'SELECT LootID, Name, Description, Rarity, Category FROM loot WHERE LootID = ?',
    [lootId]
  );
  if (itemRows.length === 0) return null;

  const item = itemRows[0];

  // Get blueprints that PRODUCE this item
  const [blueprintRows] = await pool.query(
    `SELECT b.BlueprintID, b.Name, b.OutputLootID,
            bc.LootID AS ComponentLootID, bc.QuantityRequired
     FROM blueprints b
     JOIN blueprint_components bc ON bc.BlueprintID = b.BlueprintID
     WHERE b.OutputLootID = ?
     ORDER BY b.BlueprintID`,
    [lootId]
  );

  // If no crafting blueprint, this is a base material (leaf node)
  if (blueprintRows.length === 0) {
    return {
      lootId:   item.LootID,
      name:     item.Name,
      rarity:   item.Rarity,
      category: item.Category,
      ingredients: []
    };
  }

  // Get the first blueprint and its components
  const firstBlueprintId = blueprintRows[0].BlueprintID;
  const ingredients = blueprintRows.filter(r => r.BlueprintID === firstBlueprintId);

  // Recurse into each component
  const children = [];
  for (const ing of ingredients) {
    const childTree = await buildCraftingTree(ing.ComponentLootID, new Set(visited));
    children.push({
      quantity: ing.QuantityRequired,
      ...childTree,
    });
  }

  return {
    lootId:   item.LootID,
    name:     item.Name,
    rarity:   item.Rarity,
    category: item.Category,
    blueprintId: firstBlueprintId,
    ingredients: children,
  };
}

module.exports = { getItems, getItemById, getCraftingTree };

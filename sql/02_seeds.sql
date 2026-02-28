-- 02_seeds.sql
USE arc_raiders;

-- USERS
INSERT INTO users (user_id, username, password, email, first_name, last_name, gamer_tag, is_admin)
VALUES
  (1, 'brade', 'pass12345678', 'b@byu.edu', 'Braden', 'K', 'BKRaid', TRUE),
  (2, 'josh',  'hunter2aaaaa', 'd@byu.edu',  'Joshua', 'D',  'JD', FALSE),
  (3, 'danl',   'abc123abc123', 'j@byu.edu',   'Daniel', 'L', 'DL', FALSE);

-- SESSIONS
INSERT INTO sessions (session_id, user_id, cookie)
VALUES
  (1, 1, 'cookie_braden_001'),
  (2, 2, 'cookie_josh_001'),
  (3, 3, 'cookie_danl_001');

-- LOOT (catalog)
INSERT INTO loot (loot_id, name, description, rarity, category)
VALUES
  (1, 'ScrapMetal', 'Common crafting material used in many recipes.', 'Common', 'Material'),
  (2, 'CircuitBoard', 'Electronics component for advanced crafting.', 'Uncommon', 'Material'),
  (3, 'OpticLens', 'Precision lens used for optics and scanners.', 'Rare', 'Component'),
  (4, 'PowerCell', 'High-density energy source for devices.', 'Epic', 'Component'),
  (5, 'NanoFiber', 'Lightweight reinforcement fiber.', 'Uncommon', 'Material'),
  (6, 'RepairKit', 'Consumable used to restore durability.', 'Common', 'Consumable'),
  (7, 'Scanner', 'Tool used to detect resources and signals.', 'Legendary', 'Tool');

-- USER_LOOT (inventories)
INSERT INTO user_loot (user_id, loot_id, quantity)
VALUES
  (1, 1, 25),
  (1, 2, 10),
  (1, 3, 2),
  (2, 1, 8),
  (2, 5, 4),
  (3, 1, 15),
  (3, 2, 5),
  (3, 4, 1);

-- WORKBENCHES
INSERT INTO workbenches (workbench_id, user_id, category, level)
VALUES
  (1, 1, 'Crafting', 3),
  (2, 2, 'Crafting', 1),
  (3, 3, 'Recycling', 2);

-- BLUEPRINTS
-- Blueprint crafts ONE output item (output_loot_id)
INSERT INTO blueprints (blueprint_id, user_id, name, output_loot_id)
VALUES
  (1, 1, 'Craft RepairKit', 6),
  (2, 1, 'Craft Scanner', 7),
  (3, 2, 'Craft CircuitBoard', 2);

-- BLUEPRINT COMPONENTS (quantities required)
-- RepairKit requires: ScrapMetal x2, NanoFiber x1
INSERT INTO blueprint_components (blueprint_id, loot_id, quantity_required)
VALUES
  (1, 1, 2),
  (1, 5, 1);

-- Scanner requires: CircuitBoard x2, OpticLens x1, PowerCell x1
INSERT INTO blueprint_components (blueprint_id, loot_id, quantity_required)
VALUES
  (2, 2, 2),
  (2, 3, 1),
  (2, 4, 1);

-- CircuitBoard requires: ScrapMetal x3, NanoFiber x1
INSERT INTO blueprint_components (blueprint_id, loot_id, quantity_required)
VALUES
  (3, 1, 3),
  (3, 5, 1);

-- LOOT LOCATIONS (optional future support)
INSERT INTO loot_locations (loot_id, location_name)
VALUES
  (1, 'Industrial Zone'),
  (2, 'Radio Tower'),
  (3, 'Research Facility'),
  (4, 'Power Station'),
  (5, 'Forest Outskirts');

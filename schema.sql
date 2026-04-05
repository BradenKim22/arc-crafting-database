-- 01_schema.sql
-- Arc Raiders Resource DB
-- MySQL 8+ recommended (CHECK constraints enforced)

DROP DATABASE IF EXISTS arc_raiders;
CREATE DATABASE arc_raiders
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE arc_raiders;

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
  UserID       INT AUTO_INCREMENT PRIMARY KEY,
  Username     VARCHAR(30)  NOT NULL UNIQUE,
  PasswordHash VARCHAR(255) NOT NULL,
  Email        VARCHAR(100) NOT NULL UNIQUE,
  GamerTag     VARCHAR(30)  NULL,
  IsAdmin      BOOLEAN      NOT NULL DEFAULT FALSE,
  CreatedAt    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================
-- LOOT (catalog of all items/resources)
-- =========================
CREATE TABLE loot (
  LootID      INT AUTO_INCREMENT PRIMARY KEY,
  Name        VARCHAR(100) NOT NULL UNIQUE,
  Description VARCHAR(255) NOT NULL,
  Rarity      VARCHAR(20)  NOT NULL,
  Category    VARCHAR(100) NOT NULL,

  CONSTRAINT chk_loot_rarity CHECK (Rarity IN ('Common','Uncommon','Rare','Epic','Legendary')),
  INDEX idx_loot_rarity   (Rarity),
  INDEX idx_loot_category (Category),
  INDEX idx_loot_name     (Name)
) ENGINE=InnoDB;

-- =========================
-- USER_LOOT (inventory — future feature)
-- =========================
CREATE TABLE user_loot (
  UserID   INT NOT NULL,
  LootID   INT NOT NULL,
  Quantity INT NOT NULL DEFAULT 0,

  PRIMARY KEY (UserID, LootID),

  CONSTRAINT fk_user_loot_user FOREIGN KEY (UserID) REFERENCES users(UserID) ON DELETE CASCADE,
  CONSTRAINT fk_user_loot_loot FOREIGN KEY (LootID) REFERENCES loot(LootID) ON DELETE RESTRICT,
  CONSTRAINT chk_quantity_nonneg CHECK (Quantity >= 0)
) ENGINE=InnoDB;

-- =========================
-- WORKBENCHES (future feature)
-- =========================
CREATE TABLE workbenches (
  WorkbenchID INT AUTO_INCREMENT PRIMARY KEY,
  UserID      INT         NOT NULL,
  Category    VARCHAR(20) NOT NULL,
  Level       INT         NOT NULL DEFAULT 1,

  CONSTRAINT fk_workbench_user FOREIGN KEY (UserID) REFERENCES users(UserID) ON DELETE CASCADE,
  CONSTRAINT chk_workbench_level CHECK (Level >= 1 AND Level <= 3)
) ENGINE=InnoDB;

-- =========================
-- BLUEPRINTS (global crafting recipes — one output item each)
-- =========================
CREATE TABLE blueprints (
  BlueprintID  INT AUTO_INCREMENT PRIMARY KEY,
  Name         VARCHAR(50) NOT NULL,
  OutputLootID INT         NOT NULL,
  CreatedAt    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_blueprints_output_loot FOREIGN KEY (OutputLootID) REFERENCES loot(LootID) ON DELETE RESTRICT,
  INDEX idx_bp_output (OutputLootID)
) ENGINE=InnoDB;

-- =========================
-- BLUEPRINT_COMPONENTS (ingredients for a blueprint)
-- =========================
CREATE TABLE blueprint_components (
  BlueprintID      INT NOT NULL,
  LootID           INT NOT NULL,
  QuantityRequired INT NOT NULL,

  PRIMARY KEY (BlueprintID, LootID),

  CONSTRAINT fk_bpcomp_blueprint FOREIGN KEY (BlueprintID) REFERENCES blueprints(BlueprintID) ON DELETE CASCADE,
  CONSTRAINT fk_bpcomp_loot      FOREIGN KEY (LootID)      REFERENCES loot(LootID)            ON DELETE RESTRICT,
  CONSTRAINT chk_qty_required CHECK (QuantityRequired >= 1)
) ENGINE=InnoDB;

-- =========================
-- LOOT_LOCATIONS (where to find items — future feature)
-- =========================
CREATE TABLE loot_locations (
  LootID       INT         NOT NULL,
  LocationName VARCHAR(50) NOT NULL,

  PRIMARY KEY (LootID, LocationName),
  CONSTRAINT fk_loot_locations_loot FOREIGN KEY (LootID) REFERENCES loot(LootID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- LOOT_BREAKDOWN (what an item recycles/breaks into)
-- =========================
CREATE TABLE loot_breakdown (
  LootID           INT NOT NULL,
  ComponentLootID  INT NOT NULL,
  Quantity         INT NOT NULL DEFAULT 1,

  PRIMARY KEY (LootID, ComponentLootID),

  CONSTRAINT fk_breakdown_loot      FOREIGN KEY (LootID)          REFERENCES loot(LootID),
  CONSTRAINT fk_breakdown_component FOREIGN KEY (ComponentLootID) REFERENCES loot(LootID),
  CONSTRAINT chk_breakdown_qty CHECK (Quantity >= 1)
) ENGINE=InnoDB;


-- =========================
-- VIEWS
-- =========================

-- Full crafting recipe view (blueprint + ingredients + breakdown of ingredients)
CREATE OR REPLACE VIEW vw_CraftingRecipes AS
SELECT
    b.BlueprintID,
    b.Name          AS BlueprintName,
    l_out.LootID    AS OutputItemID,
    l_out.Name      AS OutputItemName,
    l_out.Category  AS OutputCategory,
    l_out.Rarity    AS OutputRarity,
    l_comp.LootID   AS ComponentItemID,
    l_comp.Name     AS ComponentName,
    bc.QuantityRequired,
    l_break.Name    AS BreaksInto,
    lb.Quantity     AS BreakdownQuantity
FROM blueprints b
JOIN loot l_out              ON b.OutputLootID       = l_out.LootID
JOIN blueprint_components bc ON b.BlueprintID        = bc.BlueprintID
JOIN loot l_comp             ON bc.LootID            = l_comp.LootID
LEFT JOIN loot_breakdown lb  ON l_comp.LootID        = lb.LootID
LEFT JOIN loot l_break       ON lb.ComponentLootID   = l_break.LootID;

-- User inventory view
CREATE OR REPLACE VIEW vw_UserInventory AS
SELECT
    u.UserID,
    CONCAT(u.Username, ' (', IFNULL(u.GamerTag, 'No Tag'), ')') AS DisplayName,
    l.LootID    AS ItemID,
    l.Name      AS ItemName,
    l.Category,
    l.Rarity,
    l.Description,
    ul.Quantity
FROM users u
JOIN user_loot ul ON u.UserID = ul.UserID
JOIN loot l       ON ul.LootID = l.LootID;

-- Global item registry
CREATE OR REPLACE VIEW vw_GlobalItemRegistry AS
SELECT
    l.LootID      AS ItemID,
    l.Name        AS ItemName,
    l.Category    AS ItemCategory,
    l.Rarity      AS Quality,
    l.Description AS ItemDescription,
    'World Drop'  AS AcquisitionMethod
FROM loot l
UNION ALL
SELECT
    (1000 + b.BlueprintID) AS ItemID,
    b.Name                 AS ItemName,
    'Blueprint'            AS ItemCategory,
    'Crafted'              AS Quality,
    CONCAT('Crafts: ', l.Name) AS ItemDescription,
    'Workbench Craft'      AS AcquisitionMethod
FROM blueprints b
JOIN loot l ON b.OutputLootID = l.LootID;

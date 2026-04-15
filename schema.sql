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
  LastActiveAt TIMESTAMP    NULL DEFAULT NULL,
  CreatedAt    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================
-- CATEGORIES (admin-managed item categories)
-- =========================
CREATE TABLE categories (
  CategoryID  INT AUTO_INCREMENT PRIMARY KEY,
  Name        VARCHAR(50)  NOT NULL UNIQUE,
  IconURL     VARCHAR(500) NULL DEFAULT '/images/icons/category-default.svg',
  SortOrder   INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- =========================
-- FOUND_IN (admin-managed source/location types)
-- =========================
CREATE TABLE found_in (
  FoundInID   INT AUTO_INCREMENT PRIMARY KEY,
  Name        VARCHAR(100) NOT NULL UNIQUE,
  IconURL     VARCHAR(500) NULL DEFAULT '/images/icons/foundin-default.svg',
  SortOrder   INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- =========================
-- LOOT (catalog of all items/resources)
-- =========================
CREATE TABLE loot (
  LootID      INT AUTO_INCREMENT PRIMARY KEY,
  Name        VARCHAR(100) NOT NULL UNIQUE,
  Description VARCHAR(255) NOT NULL,
  Rarity      VARCHAR(20)  NOT NULL,
  CategoryID  INT          NOT NULL,
  FoundInID   INT          NULL,
  ImageURL    VARCHAR(500) NULL DEFAULT '/images/default-item.svg',

  CONSTRAINT chk_loot_rarity CHECK (Rarity IN ('Common','Uncommon','Rare','Epic','Legendary')),
  CONSTRAINT fk_loot_category FOREIGN KEY (CategoryID) REFERENCES categories(CategoryID) ON DELETE RESTRICT,
  CONSTRAINT fk_loot_foundin  FOREIGN KEY (FoundInID)  REFERENCES found_in(FoundInID)    ON DELETE SET NULL,
  INDEX idx_loot_rarity   (Rarity),
  INDEX idx_loot_category (CategoryID),
  INDEX idx_loot_name     (Name)
) ENGINE=InnoDB;

-- =========================
-- USER_LOOT (user item inventory / stash)
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
-- RECIPES (crafting recipes — each produces one output item)
-- =========================
CREATE TABLE recipes (
  RecipeID      INT AUTO_INCREMENT PRIMARY KEY,
  Name          VARCHAR(100)  NOT NULL,
  OutputLootID  INT           NOT NULL,
  WorkshopType  VARCHAR(50)   NOT NULL,
  WorkshopLevel INT           NOT NULL DEFAULT 1,
  IsDefault     BOOLEAN       NOT NULL DEFAULT FALSE,
  CreatedAt     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_recipe_output FOREIGN KEY (OutputLootID) REFERENCES loot(LootID) ON DELETE RESTRICT,
  CONSTRAINT chk_workshop_level CHECK (WorkshopLevel >= 1 AND WorkshopLevel <= 3),
  INDEX idx_recipe_output (OutputLootID)
) ENGINE=InnoDB;

-- =========================
-- RECIPE_COMPONENTS (ingredients for a recipe)
-- =========================
CREATE TABLE recipe_components (
  RecipeID         INT NOT NULL,
  LootID           INT NOT NULL,
  QuantityRequired INT NOT NULL,

  PRIMARY KEY (RecipeID, LootID),

  CONSTRAINT fk_rc_recipe FOREIGN KEY (RecipeID) REFERENCES recipes(RecipeID) ON DELETE CASCADE,
  CONSTRAINT fk_rc_loot   FOREIGN KEY (LootID)   REFERENCES loot(LootID)      ON DELETE RESTRICT,
  CONSTRAINT chk_rc_qty CHECK (QuantityRequired >= 1)
) ENGINE=InnoDB;

-- =========================
-- BLUEPRINTS (loot items that unlock a specific recipe — 1:1)
-- =========================
CREATE TABLE blueprints (
  BlueprintID INT AUTO_INCREMENT PRIMARY KEY,
  LootID      INT NOT NULL UNIQUE,
  RecipeID    INT NOT NULL UNIQUE,

  CONSTRAINT fk_bp_loot   FOREIGN KEY (LootID)   REFERENCES loot(LootID)       ON DELETE RESTRICT,
  CONSTRAINT fk_bp_recipe FOREIGN KEY (RecipeID)  REFERENCES recipes(RecipeID)  ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =========================
-- USER_BLUEPRINTS (which blueprints a user has found)
-- =========================
CREATE TABLE user_blueprints (
  UserID      INT NOT NULL,
  BlueprintID INT NOT NULL,

  PRIMARY KEY (UserID, BlueprintID),
  CONSTRAINT fk_ub_user      FOREIGN KEY (UserID)      REFERENCES users(UserID)          ON DELETE CASCADE,
  CONSTRAINT fk_ub_blueprint FOREIGN KEY (BlueprintID)  REFERENCES blueprints(BlueprintID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- WORKBENCHES (per-user workbench levels)
-- =========================
CREATE TABLE workbenches (
  WorkbenchID INT AUTO_INCREMENT PRIMARY KEY,
  UserID      INT         NOT NULL,
  Category    VARCHAR(50) NOT NULL,
  Level       INT         NOT NULL DEFAULT 1,

  UNIQUE KEY uq_user_workbench (UserID, Category),
  CONSTRAINT fk_workbench_user FOREIGN KEY (UserID) REFERENCES users(UserID) ON DELETE CASCADE,
  CONSTRAINT chk_workbench_level CHECK (Level >= 1 AND Level <= 3)
) ENGINE=InnoDB;

-- =========================
-- LOOT_LOCATIONS (where to find items)
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

-- Full recipe view (recipe + ingredients + workshop + blueprint info)
CREATE OR REPLACE VIEW vw_CraftingRecipes AS
SELECT
    r.RecipeID,
    r.Name              AS RecipeName,
    r.WorkshopType,
    r.WorkshopLevel,
    r.IsDefault,
    l_out.LootID        AS OutputItemID,
    l_out.Name          AS OutputItemName,
    c_out.Name          AS OutputCategory,
    l_out.Rarity        AS OutputRarity,
    l_comp.LootID       AS ComponentItemID,
    l_comp.Name         AS ComponentName,
    rc.QuantityRequired,
    bp.BlueprintID,
    l_bp.Name           AS BlueprintItemName
FROM recipes r
JOIN loot l_out              ON r.OutputLootID  = l_out.LootID
JOIN categories c_out        ON l_out.CategoryID = c_out.CategoryID
JOIN recipe_components rc    ON r.RecipeID      = rc.RecipeID
JOIN loot l_comp             ON rc.LootID       = l_comp.LootID
LEFT JOIN blueprints bp      ON bp.RecipeID     = r.RecipeID
LEFT JOIN loot l_bp          ON bp.LootID       = l_bp.LootID;

-- User inventory (stash items)
CREATE OR REPLACE VIEW vw_UserInventory AS
SELECT
    u.UserID,
    u.Username,
    IFNULL(u.GamerTag, '') AS GamerTag,
    l.LootID    AS ItemID,
    l.Name      AS ItemName,
    c.Name      AS Category,
    l.Rarity,
    l.Description,
    ul.Quantity
FROM users u
JOIN user_loot ul  ON u.UserID  = ul.UserID
JOIN loot l        ON ul.LootID = l.LootID
JOIN categories c  ON l.CategoryID = c.CategoryID;

-- User blueprints (owned blueprints and what they unlock)
CREATE OR REPLACE VIEW vw_UserBlueprints AS
SELECT
    u.UserID,
    u.Username,
    bp.BlueprintID,
    l_bp.Name           AS BlueprintItemName,
    r.RecipeID,
    r.Name              AS RecipeName,
    r.WorkshopType,
    r.WorkshopLevel,
    l_out.Name          AS OutputItemName,
    l_out.Rarity        AS OutputRarity
FROM users u
JOIN user_blueprints ub  ON u.UserID       = ub.UserID
JOIN blueprints bp       ON ub.BlueprintID = bp.BlueprintID
JOIN loot l_bp           ON bp.LootID      = l_bp.LootID
JOIN recipes r           ON bp.RecipeID    = r.RecipeID
JOIN loot l_out          ON r.OutputLootID = l_out.LootID;

-- User workbenches
CREATE OR REPLACE VIEW vw_UserWorkbenches AS
SELECT
    u.UserID,
    u.Username,
    wb.WorkbenchID,
    wb.Category   AS WorkbenchType,
    wb.Level      AS WorkbenchLevel
FROM users u
JOIN workbenches wb ON u.UserID = wb.UserID;

-- Recyclables view (what items break down into)
CREATE OR REPLACE VIEW vw_Recyclables AS
SELECT
    l_src.LootID        AS SourceItemID,
    l_src.Name          AS SourceItemName,
    l_src.Rarity        AS SourceRarity,
    l_comp.LootID       AS ComponentItemID,
    l_comp.Name         AS ComponentName,
    lb.Quantity
FROM loot_breakdown lb
JOIN loot l_src  ON lb.LootID          = l_src.LootID
JOIN loot l_comp ON lb.ComponentLootID = l_comp.LootID;

-- Global item registry (all items + all craftable outputs)
CREATE OR REPLACE VIEW vw_GlobalItemRegistry AS
SELECT
    l.LootID      AS ItemID,
    l.Name        AS ItemName,
    c.Name        AS ItemCategory,
    l.Rarity      AS Quality,
    l.Description AS ItemDescription,
    'World Drop'  AS AcquisitionMethod
FROM loot l
JOIN categories c ON l.CategoryID = c.CategoryID
UNION ALL
SELECT
    (1000 + r.RecipeID) AS ItemID,
    r.Name              AS ItemName,
    'Recipe'            AS ItemCategory,
    'Crafted'           AS Quality,
    CONCAT('Crafts: ', l.Name) AS ItemDescription,
    CONCAT(r.WorkshopType, ' Lv', r.WorkshopLevel) AS AcquisitionMethod
FROM recipes r
JOIN loot l ON r.OutputLootID = l.LootID;

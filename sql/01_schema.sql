-- 01_schema.sql
-- Arc Raiders Resource DB (Milestone 3)
-- MySQL 8+ recommended (CHECK constraints enforced)

DROP DATABASE IF EXISTS arc_raiders;
CREATE DATABASE arc_raiders;
USE arc_raiders;

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
  UserID INT AUTO_INCREMENT PRIMARY KEY,
  Username VARCHAR(12) NOT NULL UNIQUE,
  Password VARCHAR(12) NOT NULL,
  Email VARCHAR(30) NOT NULL UNIQUE,
  FirstName VARCHAR(12) NOT NULL,
  LastName VARCHAR(12) NOT NULL,
  GamerTag VARCHAR(30) NULL,
  IsAdmin BOOLEAN NOT NULL DEFAULT FALSE,
  CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT chk_username_len CHECK (CHAR_LENGTH(Username) <= 12),
  CONSTRAINT chk_password_len CHECK (CHAR_LENGTH(Password) <= 12),
  CONSTRAINT chk_email_len CHECK (CHAR_LENGTH(Email) <= 30),
  CONSTRAINT chk_first_len CHECK (CHAR_LENGTH(FirstName) <= 12),
  CONSTRAINT chk_last_len  CHECK (CHAR_LENGTH(LastName) <= 12)
);

-- =========================
-- SESSIONS (login sessions)
-- =========================
CREATE TABLE sessions (
  SessionID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT NOT NULL,
  Cookie VARCHAR(255) NOT NULL,
  CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_sessions_user
    FOREIGN KEY (UserID) REFERENCES users(UserID)
    ON DELETE CASCADE
);

-- =========================
-- LOOT (catalog of all items/resources)
-- IMPORTANT: Loot is NOT owned here; ownership is in user_loot
-- =========================
CREATE TABLE loot (
  LootID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(20) NOT NULL UNIQUE,
  Description VARCHAR(100) NOT NULL,
  Rarity VARCHAR(10) NOT NULL,
  Category VARCHAR(20) NOT NULL,

  CONSTRAINT chk_loot_name_len CHECK (CHAR_LENGTH(Name) <= 20),
  CONSTRAINT chk_loot_desc_len CHECK (CHAR_LENGTH(Description) <= 100),
  CONSTRAINT chk_loot_rarity CHECK (Rarity IN ('Common','Uncommon','Rare','Epic','Legendary'))
);

-- =========================
-- USER_LOOT (inventory)
-- one user has many loot types; track quantity
-- M:N between users and loot via composite PK
-- =========================
CREATE TABLE user_loot (
  UserID INT NOT NULL,
  LootID INT NOT NULL,
  Quantity INT NOT NULL DEFAULT 0,

  PRIMARY KEY (UserID, LootID),

  CONSTRAINT fk_user_loot_user
    FOREIGN KEY (UserID) REFERENCES users(UserID)
    ON DELETE CASCADE,

  CONSTRAINT fk_user_loot_loot
    FOREIGN KEY (LootID) REFERENCES loot(LootID)
    ON DELETE RESTRICT,

  CONSTRAINT chk_quantity_nonneg CHECK (Quantity >= 0)
);

-- =========================
-- WORKBENCH (owned by users)
-- =========================
CREATE TABLE workbenches (
  WorkbenchID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT NOT NULL,
  Category VARCHAR(20) NOT NULL,
  level INT NOT NULL DEFAULT 1,

  CONSTRAINT fk_workbench_user
    FOREIGN KEY (UserID) REFERENCES users(UserID)
    ON DELETE CASCADE,

  CONSTRAINT chk_workbench_level CHECK (level >= 1 AND level <= 3)
);

-- =========================
-- BLUEPRINTS (created/owned by users; blueprint crafts ONE output item)
-- =========================
CREATE TABLE blueprints (
  BlueprintID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT NOT NULL,
  Name VARCHAR(50) NOT NULL,
  OutputLootID INT NOT NULL,
  CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_blueprints_user
    FOREIGN KEY (UserID) REFERENCES users(UserID)
    ON DELETE CASCADE,

  CONSTRAINT fk_blueprints_output_loot
    FOREIGN KEY (OutputLootID) REFERENCES loot(LootID)
    ON DELETE RESTRICT
);

-- =========================
-- BLUEPRINT_COMPONENTS
-- Which loot items (and quantities) are required to craft blueprint output
-- M:N between blueprints and loot via composite PK
-- =========================
CREATE TABLE blueprint_components (
  BlueprintID INT NOT NULL,
  LootID INT NOT NULL,
  QuantityRequired INT NOT NULL,

  PRIMARY KEY (BlueprintID, LootID),

  CONSTRAINT fk_bpcomp_blueprint
    FOREIGN KEY (BlueprintID) REFERENCES blueprints(BlueprintID)
    ON DELETE CASCADE,

  CONSTRAINT fk_bpcomp_loot
    FOREIGN KEY (LootID) REFERENCES loot(LootID)
    ON DELETE RESTRICT,

  CONSTRAINT chk_qty_required CHECK (QuantityRequired >= 1)
);

-- =========================
-- OPTIONAL: locations for loot (supports “sort by map location” later)
-- leaving this minimal but valid for future milestones
-- =========================
CREATE TABLE loot_locations (
  LootID INT NOT NULL,
  LocationName VARCHAR(50) NOT NULL,
  PRIMARY KEY (LootID, LocationName),

  CONSTRAINT fk_loot_locations_loot
    FOREIGN KEY (LootID) REFERENCES loot(LootID)
    ON DELETE CASCADE
);

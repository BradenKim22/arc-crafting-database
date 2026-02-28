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
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(12) NOT NULL UNIQUE,
  password VARCHAR(12) NOT NULL,
  email VARCHAR(30) NOT NULL UNIQUE,
  first_name VARCHAR(12) NOT NULL,
  last_name VARCHAR(12) NOT NULL,
  gamer_tag VARCHAR(30) NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT chk_username_len CHECK (CHAR_LENGTH(username) <= 12),
  CONSTRAINT chk_password_len CHECK (CHAR_LENGTH(password) <= 12),
  CONSTRAINT chk_email_len CHECK (CHAR_LENGTH(email) <= 30),
  CONSTRAINT chk_first_len CHECK (CHAR_LENGTH(first_name) <= 12),
  CONSTRAINT chk_last_len  CHECK (CHAR_LENGTH(last_name) <= 12)
);

-- =========================
-- SESSIONS (login sessions)
-- =========================
CREATE TABLE sessions (
  session_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  cookie VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_sessions_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
);

-- =========================
-- LOOT (catalog of all items/resources)
-- IMPORTANT: Loot is NOT owned here; ownership is in user_loot
-- =========================
CREATE TABLE loot (
  loot_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(20) NOT NULL UNIQUE,
  description VARCHAR(100) NOT NULL,
  rarity VARCHAR(10) NOT NULL,
  category VARCHAR(20) NOT NULL,

  CONSTRAINT chk_loot_name_len CHECK (CHAR_LENGTH(name) <= 20),
  CONSTRAINT chk_loot_desc_len CHECK (CHAR_LENGTH(description) <= 100),
  CONSTRAINT chk_loot_rarity CHECK (rarity IN ('Common','Uncommon','Rare','Epic','Legendary'))
);

-- =========================
-- USER_LOOT (inventory)
-- one user has many loot types; track quantity
-- M:N between users and loot via composite PK
-- =========================
CREATE TABLE user_loot (
  user_id INT NOT NULL,
  loot_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,

  PRIMARY KEY (user_id, loot_id),

  CONSTRAINT fk_user_loot_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_user_loot_loot
    FOREIGN KEY (loot_id) REFERENCES loot(loot_id)
    ON DELETE RESTRICT,

  CONSTRAINT chk_quantity_nonneg CHECK (quantity >= 0)
);

-- =========================
-- WORKBENCH (owned by users)
-- =========================
CREATE TABLE workbenches (
  workbench_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category VARCHAR(20) NOT NULL,
  level INT NOT NULL DEFAULT 1,

  CONSTRAINT fk_workbench_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE,

  CONSTRAINT chk_workbench_level CHECK (level >= 1 AND level <= 10)
);

-- =========================
-- BLUEPRINTS (created/owned by users; blueprint crafts ONE output item)
-- =========================
CREATE TABLE blueprints (
  blueprint_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  output_loot_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_blueprints_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_blueprints_output_loot
    FOREIGN KEY (output_loot_id) REFERENCES loot(loot_id)
    ON DELETE RESTRICT
);

-- =========================
-- BLUEPRINT_COMPONENTS
-- Which loot items (and quantities) are required to craft blueprint output
-- M:N between blueprints and loot via composite PK
-- =========================
CREATE TABLE blueprint_components (
  blueprint_id INT NOT NULL,
  loot_id INT NOT NULL,
  quantity_required INT NOT NULL,

  PRIMARY KEY (blueprint_id, loot_id),

  CONSTRAINT fk_bpcomp_blueprint
    FOREIGN KEY (blueprint_id) REFERENCES blueprints(blueprint_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_bpcomp_loot
    FOREIGN KEY (loot_id) REFERENCES loot(loot_id)
    ON DELETE RESTRICT,

  CONSTRAINT chk_qty_required CHECK (quantity_required >= 1)
);

-- =========================
-- OPTIONAL: locations for loot (supports “sort by map location” later)
-- leaving this minimal but valid for future milestones
-- =========================
CREATE TABLE loot_locations (
  loot_id INT NOT NULL,
  location_name VARCHAR(50) NOT NULL,
  PRIMARY KEY (loot_id, location_name),

  CONSTRAINT fk_loot_locations_loot
    FOREIGN KEY (loot_id) REFERENCES loot(loot_id)
    ON DELETE CASCADE
);
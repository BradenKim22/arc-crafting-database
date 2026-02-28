-- 03_delete.sql
USE arc_raiders;

-- Delete child tables first (respect FKs)
DELETE FROM loot_locations;
DELETE FROM blueprint_components;
DELETE FROM blueprints;
DELETE FROM user_loot;
DELETE FROM workbenches;
DELETE FROM sessions;
DELETE FROM users;

-- Optional: reset auto-increment counters (not required, but nice for repeatable demos)
ALTER TABLE sessions AUTO_INCREMENT = 1;
ALTER TABLE workbenches AUTO_INCREMENT = 1;
ALTER TABLE blueprints AUTO_INCREMENT = 1;
ALTER TABLE loot AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
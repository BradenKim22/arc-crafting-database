CREATE VIEW UserInventory AS
SELECT 
    u.UserID,
    u.FirstName + ' ' + u.LastName AS FullName,
    l.LootID AS ItemID,
    l.Name AS ItemName,
    l.Category,
    l.Rarity,
    l.Description
FROM USER u
JOIN LOOT l ON u.UserID = l.UserID; -- Assumes a foreign key UserID in LOOT based on 'Has' relationship

CREATE VIEW CraftingRecipes AS
SELECT 
    b.Name AS BlueprintName,
    b.Components AS RequiredComponents,
    l.Name AS ComponentName,
    w.Category AS WorkbenchType,
    w.Level AS RequiredWorkbenchLevel
FROM BLUEPRINTS b
JOIN LOOT l ON b.LootID = l.LootID -- Assumes 'Use' relationship links Blueprint to Loot
JOIN WORKBENCH w ON b.WorkbenchID = w.WorkbenchID; -- Assumes 'Require' relationship



CREATE VIEW vw_ActiveSessions AS
SELECT 
    s.SessionID,
    s.Date AS LoginDate,
    u.UserID,
    u.Email,
    u.FirstName,
    u.LastName
FROM SESSION s
JOIN USER u ON s.UserID = u.UserID;



CREATE VIEW vw_GlobalItemRegistry AS
-- Section 1: All Raw Loot/Materials
SELECT 
    ID AS ItemID,
    Name AS ItemName,
    Category AS ItemCategory,
    Rarity AS Quality,
    Description AS ItemDescription,
    'World Drop' AS AcquisitionMethod
FROM LOOT

UNION ALL


SELECT 
    (1000 + ID) AS ItemID, 
    Name AS ItemName,
    'Blueprint' AS ItemCategory,
    'Crafted' AS Quality,
    'Requires: ' + Components AS ItemDescription,
    'Workbench Craft' AS AcquisitionMethod
FROM BLUEPRINTS;

DROP VIEW IF EXISTS CraftingRecipes;
GO

CREATE VIEW CraftingRecipes AS
SELECT
    b.blueprint_id            AS BlueprintID,
    b.name                    AS BlueprintName,

    l_out.loot_id             AS OutputItemID,
    l_out.name                AS OutputItemName,
    l_out.category            AS OutputCategory,
    l_out.rarity              AS OutputRarity,

    l_comp.loot_id            AS ComponentItemID,
    l_comp.name               AS ComponentName,
    bc.quantity_required      AS QuantityRequired,

    l_break.name              AS BreaksInto,
    lb.quantity               AS BreakdownQuantity

FROM blueprints b
JOIN loot l_out 
    ON b.output_loot_id = l_out.loot_id

JOIN blueprint_components bc 
    ON b.blueprint_id = bc.blueprint_id

JOIN loot l_comp 
    ON bc.loot_id = l_comp.loot_id

LEFT JOIN loot_breakdown lb 
    ON l_comp.loot_id = lb.loot_id

LEFT JOIN loot l_break 
    ON lb.component_loot_id = l_break.loot_id;

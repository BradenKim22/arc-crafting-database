-- 02_seeds.sql
USE arc_raiders;

-- USERS (passwords are bcrypt hashes — plain text originals noted for testing)
-- brade: "RaiderPass1!"  |  josh: "HunterTwo22!"  |  danl: "AbcRaid123!"
INSERT INTO users (UserID, Username, PasswordHash, Email, GamerTag, IsAdmin)
VALUES
  (1, 'brade', '$2b$12$LJ3m5Fz8E.dW1qRGwYz6aeGp.R3N8Z1vX5yK0cE2wQ7sT4uP6xB3y', 'b@byu.edu', 'BKRaid', TRUE),
  (2, 'josh',  '$2b$12$K8vN2pR4tX6wD9yB3cF1heQm.L7nJ5sA0gE8iU4oW2xZ6rT9yH3p', 'd@byu.edu', 'JD',     FALSE),
  (3, 'danl',  '$2b$12$M4xP6rT8vZ0yB2dF5hJ3keWn.Q9sA1gC7iU6oE4wX8zR0tL2yN5p', 'j@byu.edu', 'DL',     FALSE);

-- LOOT (catalog) — 209 items, unchanged from original
INSERT INTO loot (LootID, Name, Description, Rarity, Category)
VALUES
(1,'Advanced ARC Powercell','valuable resource that drops from certain ARC enemies','Rare','Arc (high level enemies)'),
(2,'Advanced Electrical Components','Used to craft a wide range of Items, can be recycled into crafting materials','Rare','Electrical'),
(3,'Advanced Mechanical Components','Used to craft advanced weapons. Can be recycled into crafting materials','Rare','Mechanical'),
(4,'Agave','Healing item that can be used to restore a small amount of health over time','Uncommon','Nature'),
(5,'Air Freshener','Trinket thats sure to attract a few nose, worth a few coins','Uncommon','Mechanical'),
(6,'Alarm Clock','Used to recycle into crafting materials','Rare','Residential'),
(7,'Antiseptic','Used to recycle into crafting materials or used to craft medical supplies','Rare','Medical'),
(8,'Apricot','Used to upgrade Scrappy','Uncommon','Nature'),
(9,'ARC Alloy','Obtained from ARC enemies or activities. Used to craft components','Uncommon','Arc (Various)'),
(10,'ARC Circuitry','Obtained from ARC enemies or activities. Used to craft components. Can be recycled into ARC Alloy.','Rare','Arc (Various)'),
(11,'ARC Coolant','Can be recycled into crafting materials','Rare','Arc (Various)'),
(12,'ARC Flex Rubber','Can be recycled into crafting materials','Rare','Arc (Various)'),
(13,'ARC Motion Core','Obtained from ARC enemies or activities. Used to craft components. Can be recycled into ARC Alloy.','Rare','Arc (Various)'),
(14,'ARC Performance Steel','Obtained from ARC enemies or activities. Used to craft components. Can be recycled into scrap metal.','Rare','Arc (Various)'),
(15,'ARC Powercell','Valuable resource that drops from all ARC enemies.','Common','Arc (Various)'),
(16,'ARC Synthetic Resin','Can be recycled into crafting materials','Rare','Arc (Various)'),
(17,'ARC Thermo Lining','Can be recycled into crafting materials','Rare','Arc (Various)'),
(18,'Assorted Seeds','A handful of seeds. Celeste might be looking for these.','Common','Nature'),
(19,'Bastion Cell','Can be recycled into crafting materials.','Epic','Arc (Bastion)'),
(20,'Battery','Used to craft a wide range of items. Can be recycled into scrap metal.','Uncommon','Technological or Electrical'),
(21,'Bicycle Pump','Can be recycled into crafting materials.','Rare','Residential'),
(22,'Bloated Tuna Can','refreshing snack that will give your Raider a burst of energy.','Common','Commercial or Residential'),
(23,'Blue Gate Communication Tower Key','Unlocks a door by the Communication Tower near the Blue Gate','Rare','Any (random loot)'),
(24,'Blue Gate Confiscation Room Key','Unlock a door to the confiscated foods area with the Blue Gate tunnels.','Epic','Any (random loot)'),
(25,'Blue Gate Cellar Key','Unlocks certain cellar doors near the Blue Gate','Uncommon','Any (random loot)'),
(26,'Blue Gate Village Key','Unlocks a door to one of the old village buildings near the Blue Gate.','Uncommon','Any (random loot)'),
(27,'Bombardier Cell','Can be recycled into crafting materials.','Epic','Arc (Bombardier)'),
(28,'Breathtaking Snow Globe','The envy of every Speranzan. Proof that this world was once thriving and magical.','Epic','Residential, Old World or Commercial'),
(29,'Broken Flashlight','Can be recycled into crafting materials','Rare','Security'),
(30,'Broken Guidance System','Can be recycled into crafting materials','Rare','Industrial'),
(31,'Broken Handheld Radio','Can be recycled into crafting materials','Rare','Security'),
(32,'Broken Taser','Can be recycled into crafting materials','Rare','Security'),
(33,'Buried City Hospital Key','Unlocks a door in the Hospital in Buried City','Rare','Any/random loot or Life of a Pharmacist quest reward'),
(34,'Buried City JKV Employee Access Card','Unlocks a door in the J Kozma Ventures company building in Buried City','Uncommon','Any (random loot)'),
(35,'Buried City Residential Mastery Key','Unlocks certain apartment doors in Buried City','Uncommon','Any/random loot, Digging up Dirt quest reward'),
(36,'Buried City Town Hall Key','Unlocks a door to the Town Hall in Buried City','Epic','Any (random loot)'),
(37,'Burned ARC Circuitry','Can be recycled into ARC Alloy.','Uncommon','Arc (Various)'),
(38,'Camera Lens','Can be recycled into crafting materials.','Uncommon','Security'),
(39,'Candle Holder','Can be recycled into crafting materials.','Uncommon','Residential'),
(40,'Canister','Used to craft a wide range of items. Can be recycled into plastic.','Uncommon','Commercial'),
(41,'Cat Bed','At least a tiny bit more comfortable than your face.','Common','Commercial or Residential'),
(42,'Chemicals','Used to craft medical supplies, explosives, and utility items.','Common','Mechanical, Residential or Medical'),
(43,'Coffee Pot','The power to face a new day, one drip at a time.','Common','Residential'),
(44,'Complex Gun Parts','Used to craft advanced weapons.','Epic','Security'),
(45,'Coolant','Can be recycled into crafting materials.','Rare','Mechanical'),
(46,'Cooling Coil','Can be recycled into crafting materials.','Rare','Industrial'),
(47,'Cooling Fan','Can be recycled into crafting materials.','Rare','Technological'),
(48,'Cracked Bioscanner','Can be recycled into crafting materials.','Rare','Medical'),
(49,'Crude Explosives','Used to craft explosives. Can be recycled into crafting materials.','Uncommon','Industrial or Security'),
(50,'Crumpled Plastic Bottle','Can be recycled into plastic parts.','Uncommon','Residential'),
(51,'Dam Control Tower Key','Unlocks door to Control Tower on Dam Battlegrounds','Epic','Any (random loot)'),
(52,'Dam Staff Room Key','Unlocks a door in the Research and Administration building on Dam Battlegrounds.','Uncommon','Any/random loot, Tribute to Toledo quest reward'),
(53,'Dam Surveillance Key','Unlocks a door in the Water Treatment Control building in The Dam.','Uncommon','Any (random loot)'),
(54,'Dam Testing Annex Key','Unlocks a door in the Testing Annex on Dam Battlegrounds.','Rare','Any (random loot)'),
(55,'Dam Utility Key','?','Uncommon','Any (random loot)'),
(56,'Damaged ARC Motion Core','Can be recycled into crafting materials.','Uncommon','Arc (Various)'),
(57,'Damaged ARC Powercell','Can be recycled into crafting materials.','Common','Arc (Various)'),
(58,'Damaged Fireball Burner','Can be recycled into crafting materials.','Common','Arc (Fireball)'),
(59,'Damaged Heat Sink','Can be recycled into crafting materials.','Rare','Technological'),
(60,'Damaged Hornet Driver','Can be recycled into crafting materials.','Common','Arc (Hornet)'),
(61,'Damaged Rocketeer Driver','Can be recycled into crafting materials.','Common','Arc (Rocketeer)'),
(62,'Damaged Snitch Scanner','Can be recycled into crafting materials.','Common','Arc (Snitch)'),
(63,'Damaged Tick Pod','Can be recycled into crafting materials.','Common','Arc (Tick)'),
(64,'Damaged Wasp Driver','Can be recycled into crafting materials.','Common','Arc (Wasp)'),
(65,'Dart Board','Some Raiders use it to practice dexterity. Others just like throwing things at other things.','Uncommon','Commercial or Residential'),
(66,'Deflated Football','Just by looking at this, you too start to feel slightly deflated.','Uncommon','Residential'),
(67,'Degraded ARC Rubber','Can be recycled into crafting materials.','Uncommon','Arc (Various)'),
(68,'Diving Goggles','Can be recycled into crafting materials.','Rare','Residential'),
(69,'Dog Collar','After all this time, you can still smell the goodness.','Rare','Residential'),
(70,'Dried-Out ARC Resin','Can be recycled into crafting materials.','Uncommon','Arc (Various)'),
(71,'Duct Tape','Used to craft a wide range of items. Can be recycled into crafting materials','Uncommon','Commercial or Residential'),
(72,'Durable Cloth','Used to craft medical supplies.','Uncommon','Medical or Commercial'),
(73,'Electrical Components','Used to craft a wide range of items. Can be recycled into crafting materials.','Uncommon','Electrical'),
(74,'Empty Wine Bottle','Yes, it really is empty.','Common','Commercial or Residential'),
(75,'Exodus Modules','Used to craft a wide range of items.','Epic','Exodus'),
(76,'Expired Pasta','Way past its prime.','Common','Commercial or Residential'),
(77,'Expired Respirator','The filters are clogged with sand and noxious fumes. Long past its lifespan.','Rare','Medical'),
(78,'Explosive Compound','Used to craft explosives.','Rare','Industrial or Security'),
(79,'Fabric','Used to craft medical supplies and shields.','Common','Commercial, Residential or Medical'),
(80,'Faded Photograph','A snapshot of the world before, faded by sunlight and time.','Common','Residential'),
(81,'Fertilizer','May be worth a few coins.','Uncommon','Nature'),
(82,'Film Reel','May be worth a few coins.','Common','Residential or Old World'),
(83,'Fine Wristwatch','Perfect for telling the time, and showcasing that youre an exceedingly dignified person.','Common','Commercial or Residential'),
(84,'Fireball Burner','Can be recycled into ARC Alloy.','Uncommon','Arc (Fireball)'),
(85,'Flow Controller','Keep for the Snap and Salvage quest.','Rare','Exodus'),
(86,'Frequency Modulation Box','Can be recycled into crafting materials.','Rare','Exodus'),
(87,'Fried Motherboard','Can be recycled into crafting materials.','Rare','Technological'),
(88,'Frying Pan','Can be recycled into crafting materials.','Rare','Residential'),
(89,'Garlic Press','Itll press garlic, olives, and probably many other things.','Uncommon','Commercial or Residential'),
(90,'Geiger Counter','Can be recycled into crafting materials.','Epic','Exodus'),
(91,'Great Mullein','Used to craft medical supplies.','Uncommon','Nature'),
(92,'Headphones','Can be recycled into crafting materials.','Rare','Commercial or Residential'),
(93,'Heavy Gun Parts','Used to craft weapons.','Rare','Raider or Security'),
(94,'Hornet Driver','Can be recycled into ARC Alloy.','Rare','Arc (Hornet)'),
(95,'Household Cleaner','Can be recycled into chemicals.','Uncommon','Residential'),
(96,'Humidifier','Can be recycled into crafting materials.','Rare','Residential'),
(97,'Ice Cream Scooper','It is theorized that scooping things was a favorite pastime in the world before.','Uncommon','Commercial or Residential'),
(98,'Impure ARC Coolant','Can be recycled into crafting materials.','Uncommon','Arc (Various)'),
(99,'Industrial Battery','Can be recycled into materials.','Rare','Industrial'),
(100,'Industrial Charger','Can be recycled into crafting materials.','Rare','Industrial'),
(101,'Industrial Magnet','Can be recycled into crafting materials.','Rare','Industrial'),
(102,'Ion Sputter','Can be recycled into crafting materials.','Epic','Exodus'),
(103,'Laboratory Reagents','Can be recycled into crafting materials.','Rare','Medical'),
(104,'Lance''s Mixtape (5th Edition)','Lance has personally planted a number of these around the Rust Belt, for some reason.','Epic','Residential or Commercial'),
(105,'Leaper Pulse Unit','Can be recycled into crafting materials.','Epic','Arc (Leaper)'),
(106,'Lemon','Can be consumed for a small amount of stamina.','Uncommon','Nature'),
(107,'Light Bulb','Without light, life underground would be impossible.','Uncommon','Electrical'),
(108,'Light Gun Parts','Assorted spare parts used for pistols and SMGs.','Rare','Raider or Security'),
(109,'Magnetron','Can be recycled into crafting materials.','Epic','Exodus'),
(110,'Magnet','Used to craft a wide range of items. Can be recycled into crafting materials.','Uncommon','Exodus'),
(111,'Magnetic Accelerator','Used to craft advanced weapons.','Epic','Exodus'),
(112,'Mechanical Components','Used to craft a wide range of items. Can be recycled into crafting materials.','Rare','Mechanical'),
(113,'Medium Gun Parts','Assorted spare parts used for rifles.','Rare','Raider or Security'),
(114,'Metal Brackets','Can be recycled into metal parts.','Uncommon','Mechanical or Electrical'),
(115,'Metal Parts','Used to craft a wide range of items.','Common','Mechanical, Industrial, Electrical or Technological'),
(116,'Microscope','Can be recycled into crafting materials.','Rare','Exodus'),
(117,'Mini Centrifuge','Sell or recycle for Advanced Mechanical Components.','Rare','Exodus'),
(118,'Mod Components','Used to craft weapons mods. Can be recycled into crafting materials.','Rare','Security'),
(119,'Moss','Can be used to regain a small amount of health.','Rare','Nature'),
(120,'Motor','Can be recycled into crafting materials.','Rare','Mechanical'),
(121,'Mushroom','Can be consumed to regain a small amount of health.','Uncommon','Nature'),
(122,'Music Album','Perfect for relaxing nights at home, casual get-togethers, and provide air guitar concerts.','Rare','Residential or Commercial'),
(123,'Music Box','Worth a small fortune.','Rare','Old World, Commercial or Residential'),
(124,'Number Plate','Can be recycled into metal parts.','Uncommon','Mechanical'),
(125,'Oil','Used to craft weapons and explosives. Can be recycled into chemicals.','Uncommon','Mechanical'),
(126,'Olives','Can be consumed for a small amount of stamina.','Uncommon','Nature'),
(127,'Painted Box','May be worth a few coins.','Common','Old World'),
(128,'Patrol Car Key','Unlocks the rear door of a patrol car','Uncommon','Any (random loot)'),
(129,'Plastic Parts','Used to craft a wide range of items.','Common','Technological, Commercial or Residential'),
(130,'Playing Cards','Speranzans love to see who can build the tallest tower - before the temors knock them down.','Rare','Commercial or Residential'),
(131,'Polluted Air Filter','Can be recycled into crafting materials.','Rare','Industrial'),
(132,'Pop Trigger','Can be recycled into crafting materials.','Common','Arc (Pop)'),
(133,'Portable TV','Can be recycled into crafting materials.','Rare','Residential'),
(134,'Poster of Natural Wonders','If you stand close and squint your eyes, its like the world never came crumbling down.','Uncommon','Commercial or Residential'),
(135,'Pottery','May be worth a few coins.','Uncommon','Old World or Residential'),
(136,'Power Bank','Can be recycled into crafting materials.','Rare','Electrical, Commercial or Residential'),
(137,'Power Cable','Can be recycled into crafting materials.','Rare','Electrical, Commercial or Residential'),
(138,'Power Rod','Used in crafting.','Epic','Exodus'),
(139,'Prickly Pear','Can be consumed for a small amount of stamina.','Common','Nature'),
(140,'Processor','Used in crafting.','Rare','Technological'),
(141,'Projector','Can be recycled into crafting materials.','Rare','Residential'),
(142,'Queen Reactor','Can be recycled into crafting materials.','Legendary','Arc (Queen)'),
(143,'Radio','Can be recycled into crafting materials.','Rare','Commercial or Residential'),
(144,'Radio Relay','Can be recycled into crafting materials.','Rare','Exodus'),
(145,'Raider Hatch Key','Unlocks a Raider Hatch.','Rare','Any/random Loot, Crafting, Sold by Shani'),
(146,'Red Coral Jewelry','Valued for its fine craftsmanship, and effortless ability to make your eyes pop.','Rare','Old World, Commercial or Residential'),
(147,'Remote Control','Can be recycled into crafting materials.','Uncommon','Residential'),
(148,'Resin','Can be used to gradually restore a small amount of health over time.','Common','Nature'),
(149,'Rocketeer Driver','Can be recycled into crafting materials.','Epic','Arc (Rocketeer)'),
(150,'Ripped Safety Vest','A remnant of a time long lost, when it was fashionable to stand out.','Uncommon','Industrial'),
(151,'Rocket Thruster','Can be recycled into crafting materials.','Rare','Exodus'),
(152,'Roots','May be worth a few coins.','Uncommon','Nature'),
(153,'Rope','Used in crafting.','Rare','Commercial or Residential'),
(154,'Rosary','May be worth a few coins.','Common','Old World or Residential'),
(155,'Rotary Encoder','Can be recycled into crafting materials.','Rare','Exodus'),
(156,'Rubber Duck','Always there to lend an ear, should you need it.','Common','Any/Random Loot'),
(157,'Rubber Pad','Can be recycled into rubber parts.','Rare','Electrical'),
(158,'Rubber Parts','Used to craft a wide range of items.','Common','Mechanical, Industrial or Electrical'),
(159,'Ruined Accordion','Can be recycled into crafting materials.','Rare','Residential'),
(160,'Ruined Augment','An augment ruined beyond repair.','Common','Combat'),
(161,'Ruined Baton','Can be recycled into crafting materials.','Uncommon','Security'),
(162,'Ruined Handcuffs','Can be recycled into crafting materials.','Uncommon','Security'),
(163,'Ruined Parachute','Can be recycled into crafting materials.','Uncommon','Exodus'),
(164,'Ruined Tactical Vest','Can be recycled into crafting materials.','Uncommon','Security'),
(165,'Ruined Riot Shield','Can be recycled into crafting materials.','Rare','Security'),
(166,'Rusted Bolts','Can be recycled into metal parts.','Uncommon','Mechanical or Industrial'),
(167,'Rusted Gear','Can be recycled into crafting materials.','Rare','Industrial'),
(168,'Rusted Shut Medical Kit','Can be recycled into crafting materials.','Rare','Medical'),
(169,'Rusted Tools','Can be recycled into metal parts.','Rare','Mechanical or Industrial'),
(170,'Rusty ARC Steel','Can be recycled into crafting materials.','Uncommon','Arc (Various)'),
(171,'Sample Cleaner','Can be recycled into crafting materials.','Rare','Exodus'),
(172,'Sensors','Used in crafting.','Rare','Technological or Security'),
(173,'Sentinel Firing Core','Can be recycled into crafting materials.','Rare','Arc (Sentinel)'),
(174,'Signal Amplifier','Can be recycled into crafting materials.','Rare','Exodus'),
(175,'Silver Teaspoon Set','A shining shimmering set of refinement and elegance.','Rare','Old World, Commercial or Residential'),
(176,'Simple Gun Parts','Used to craft weapons.','Uncommon','Raider or Security'),
(177,'Snitch Scanner','Can be recycled into ARC Alloy.','Uncommon','Arc (Snitch)'),
(178,'Spaceport Container Storage Key','Unlocks a door in the Container Storage in Spaceport.','Rare','Any/random loot, Switching the Supply quest reward'),
(179,'Spaceport Control Tower Key','Unlocks a door to the Ground Control Tower in Spaceport.','Rare','Any/random loot'),
(180,'Spaceport Trench Tower Key','Unlocks a door to the Trench Towers in Spaceport.','Uncommon','Any/random loot, Turnabout quest reward'),
(181,'Spaceport Warehouse Key','Unlocks a door in the Shipping Warehouse in Spaceport.','Uncommon','Any/random loot, Switching the Supply quest reward'),
(182,'Speaker Component','Used in crafting.','Rare','Commercial'),
(183,'Spectrum Analyzer','Can be recycled into crafting materials.','Epic','Exodus'),
(184,'Spectrometer','Can be recycled into crafting materials.','Rare','Exodus'),
(185,'Spring Cushion','Can be recycled into crafting materials.','Rare','Commercial or Residential'),
(186,'Spotter Relay','Can be recycled into crafting materials.','Uncommon','Arc (Spotter)'),
(187,'Statuette','Worth a small fortune.','Common','Old World or Residential'),
(188,'Steel Spring','Used to craft a wide range of items. Can be recycled into crafting materials.','Uncommon','Industrial'),
(189,'Surveyor Vault','Can be recycled into crafting materials.','Rare','Arc (Surveyor)'),
(190,'Synthesized Fuel','Used to craft utility items and explosives. Can be recycled into chemicals.','Rare','Exodus'),
(191,'Syringe','Used to craft medical supplies. Can be recycled into plastic.','Rare','Medical'),
(192,'Tattered ARC Lining','Can be recycled into crafting materials.','Uncommon','Arc (Various)'),
(193,'Tattered Clothes','Can be recycled into fabric.','Uncommon','Residential'),
(194,'Telemetry Transceiver','Can be recycled into crafting materials.','Rare','Exodus'),
(195,'Thermostat','Can be recycled into crafting materials.','Rare','Residential'),
(196,'Tick Pod','Can be recycled into crafting materials.','Uncommon','Arc (Tick)'),
(197,'Toaster','Can be recycled into crafting materials.','Rare','Residential'),
(198,'Torn Book','What pages remain speak of chosen heroes, vampires, and lots of longing glances.','Common','Residential or Old World'),
(199,'Torn Blanket','Can be recycled into fabric.','Rare','Residential or Medical'),
(200,'Turbo Pump','Can be recycled into crafting materials.','Rare','Exodus'),
(201,'Unusable Weapon','Can be recycled into crafting materials.','Rare','Security'),
(202,'Vase','Worth a small fortune.','Rare','Old World, Commercial or Residential'),
(203,'Very Comfortable Pillow','The envy of every Raider. Like sleeping on an especially ergonomic cloud.','Common','Commercial or Residential'),
(204,'Volcanic Rock','Can be thrown.','Common','Nature'),
(205,'Voltage Converter','Used in crafting.','Rare','Technological'),
(206,'Wasp Driver','Can be recycled into ARC Alloy.','Rare','Arc (Wasp)'),
(207,'Water Filter','Can be recycled into crafting materials.','Rare','Industrial'),
(208,'Water Pump','Can be recycled into crafting materials.','Rare','Mechanical or Industrial'),
(209,'Wires','Used to craft a wide range of items. Can be recycled into crafting materials.','Uncommon','Electrical or Technological');

-- USER_LOOT (inventories — future feature)
INSERT INTO user_loot (UserID, LootID, Quantity)
VALUES
  (1, 1, 25),
  (1, 2, 10),
  (1, 3, 2),
  (2, 1, 8),
  (2, 5, 4),
  (3, 1, 15),
  (3, 2, 5),
  (3, 4, 1);

-- WORKBENCHES (future feature)
INSERT INTO workbenches (WorkbenchID, UserID, Category, Level)
VALUES
  (1, 1, 'Crafting', 3),
  (2, 2, 'Crafting', 1),
  (3, 3, 'Recycling', 2);

-- BLUEPRINTS (global crafting recipes — no UserID)
INSERT INTO blueprints (BlueprintID, Name, OutputLootID)
VALUES
  (1, 'Craft Alarm Clock Assembly', 6),
  (2, 'Craft Antiseptic Kit', 7),
  (3, 'Craft Advanced Electrical Components', 2);

-- BLUEPRINT COMPONENTS
-- Alarm Clock Assembly requires: Metal Parts x3, Plastic Parts x2, Wires x1
INSERT INTO blueprint_components (BlueprintID, LootID, QuantityRequired)
VALUES
  (1, 115, 3),
  (1, 129, 2),
  (1, 209, 1);

-- Antiseptic Kit requires: Chemicals x2, Durable Cloth x1, Syringe x1
INSERT INTO blueprint_components (BlueprintID, LootID, QuantityRequired)
VALUES
  (2, 42, 2),
  (2, 72, 1),
  (2, 191, 1);

-- Advanced Electrical Components requires: Electrical Components x2, ARC Circuitry x1, Wires x2
INSERT INTO blueprint_components (BlueprintID, LootID, QuantityRequired)
VALUES
  (3, 73, 2),
  (3, 10, 1),
  (3, 209, 2);

-- LOOT LOCATIONS (optional future support)
INSERT INTO loot_locations (LootID, LocationName)
VALUES
  (1, 'Industrial Zone'),
  (2, 'Radio Tower'),
  (3, 'Research Facility'),
  (4, 'Power Station'),
  (5, 'Forest Outskirts');

-- LOOT BREAKDOWN (128 entries — what items recycle into)
-- Specific breakdowns from research + category-based mappings from descriptions
INSERT INTO loot_breakdown (LootID, ComponentLootID, Quantity) VALUES
  (2, 209, 2),    -- Advanced Electrical Components → Wires x2
  (3, 115, 2),    -- Advanced Mechanical Components → Metal Parts x2
  (6, 115, 2),    -- Alarm Clock → Metal Parts x2
  (6, 129, 1),    -- Alarm Clock → Plastic Parts x1
  (7, 42, 1),     -- Antiseptic → Chemicals x1
  (10, 9, 2),     -- ARC Circuitry → ARC Alloy x2
  (11, 9, 1),     -- ARC Coolant → ARC Alloy x1
  (12, 9, 1),     -- ARC Flex Rubber → ARC Alloy x1
  (13, 9, 2),     -- ARC Motion Core → ARC Alloy x2
  (14, 115, 3),   -- ARC Performance Steel → Metal Parts x3
  (16, 9, 1),     -- ARC Synthetic Resin → ARC Alloy x1
  (17, 9, 1),     -- ARC Thermo Lining → ARC Alloy x1
  (19, 9, 2),     -- Bastion Cell → ARC Alloy x2
  (20, 115, 2),   -- Battery → Metal Parts x2
  (21, 115, 1),   -- Bicycle Pump → Metal Parts x1
  (27, 9, 2),     -- Bombardier Cell → ARC Alloy x2
  (29, 115, 2),   -- Broken Flashlight → Metal Parts x2
  (30, 115, 2),   -- Broken Guidance System → Metal Parts x2
  (31, 115, 2),   -- Broken Handheld Radio → Metal Parts x2
  (32, 115, 2),   -- Broken Taser → Metal Parts x2
  (37, 9, 1),     -- Burned ARC Circuitry → ARC Alloy x1
  (38, 115, 2),   -- Camera Lens → Metal Parts x2
  (39, 115, 1),   -- Candle Holder → Metal Parts x1
  (40, 129, 2),   -- Canister → Plastic Parts x2
  (45, 115, 2),   -- Coolant → Metal Parts x2
  (46, 115, 2),   -- Cooling Coil → Metal Parts x2
  (47, 73, 1),    -- Cooling Fan → Electrical Components x1
  (48, 42, 1),    -- Cracked Bioscanner → Chemicals x1
  (49, 115, 2),   -- Crude Explosives → Metal Parts x2
  (50, 129, 2),   -- Crumpled Plastic Bottle → Plastic Parts x2
  (56, 9, 1),     -- Damaged ARC Motion Core → ARC Alloy x1
  (57, 9, 1),     -- Damaged ARC Powercell → ARC Alloy x1
  (58, 9, 1),     -- Damaged Fireball Burner → ARC Alloy x1
  (59, 73, 1),    -- Damaged Heat Sink → Electrical Components x1
  (60, 9, 1),     -- Damaged Hornet Driver → ARC Alloy x1
  (61, 9, 1),     -- Damaged Rocketeer Driver → ARC Alloy x1
  (62, 9, 1),     -- Damaged Snitch Scanner → ARC Alloy x1
  (63, 9, 1),     -- Damaged Tick Pod → ARC Alloy x1
  (64, 9, 1),     -- Damaged Wasp Driver → ARC Alloy x1
  (67, 9, 1),     -- Degraded ARC Rubber → ARC Alloy x1
  (68, 115, 1),   -- Diving Goggles → Metal Parts x1
  (70, 9, 1),     -- Dried-Out ARC Resin → ARC Alloy x1
  (71, 115, 1),   -- Duct Tape → Metal Parts x1
  (73, 129, 3),   -- Electrical Components → Plastic Parts x3
  (73, 158, 3),   -- Electrical Components → Rubber Parts x3
  (75, 110, 2),   -- Exodus Modules → Magnet x2
  (75, 112, 1),   -- Exodus Modules → Mechanical Components x1
  (84, 9, 1),     -- Fireball Burner → ARC Alloy x1
  (86, 73, 1),    -- Frequency Modulation Box → Electrical Components x1
  (87, 73, 1),    -- Fried Motherboard → Electrical Components x1
  (88, 115, 1),   -- Frying Pan → Metal Parts x1
  (90, 73, 1),    -- Geiger Counter → Electrical Components x1
  (92, 158, 1),   -- Headphones → Rubber Parts x1
  (92, 182, 1),   -- Headphones → Speaker Component x1
  (94, 9, 2),     -- Hornet Driver → ARC Alloy x2
  (95, 42, 2),    -- Household Cleaner → Chemicals x2
  (96, 115, 1),   -- Humidifier → Metal Parts x1
  (98, 9, 1),     -- Impure ARC Coolant → ARC Alloy x1
  (99, 115, 2),   -- Industrial Battery → Metal Parts x2
  (100, 115, 2),  -- Industrial Charger → Metal Parts x2
  (101, 115, 2),  -- Industrial Magnet → Metal Parts x2
  (102, 73, 1),   -- Ion Sputter → Electrical Components x1
  (103, 42, 1),   -- Laboratory Reagents → Chemicals x1
  (105, 9, 2),    -- Leaper Pulse Unit → ARC Alloy x2
  (109, 73, 1),   -- Magnetron → Electrical Components x1
  (110, 73, 1),   -- Magnet → Electrical Components x1
  (112, 115, 3),  -- Mechanical Components → Metal Parts x3
  (112, 158, 2),  -- Mechanical Components → Rubber Parts x2
  (114, 115, 2),  -- Metal Brackets → Metal Parts x2
  (116, 73, 1),   -- Microscope → Electrical Components x1
  (117, 73, 1),   -- Mini Centrifuge → Electrical Components x1
  (118, 115, 2),  -- Mod Components → Metal Parts x2
  (120, 115, 2),  -- Motor → Metal Parts x2
  (124, 115, 2),  -- Number Plate → Metal Parts x2
  (125, 42, 1),   -- Oil → Chemicals x1
  (131, 115, 2),  -- Polluted Air Filter → Metal Parts x2
  (132, 9, 1),    -- Pop Trigger → ARC Alloy x1
  (133, 115, 1),  -- Portable TV → Metal Parts x1
  (136, 209, 2),  -- Power Bank → Wires x2
  (137, 20, 2),   -- Power Cable → Battery x2
  (137, 209, 2),  -- Power Cable → Wires x2
  (141, 115, 1),  -- Projector → Metal Parts x1
  (142, 9, 3),    -- Queen Reactor → ARC Alloy x3
  (143, 172, 1),  -- Radio → Sensors x1
  (143, 182, 1),  -- Radio → Speaker Component x1
  (144, 73, 1),   -- Radio Relay → Electrical Components x1
  (147, 115, 1),  -- Remote Control → Metal Parts x1
  (149, 9, 2),    -- Rocketeer Driver → ARC Alloy x2
  (151, 73, 1),   -- Rocket Thruster → Electrical Components x1
  (155, 73, 1),   -- Rotary Encoder → Electrical Components x1
  (157, 158, 2),  -- Rubber Pad → Rubber Parts x2
  (159, 115, 1),  -- Ruined Accordion → Metal Parts x1
  (161, 115, 2),  -- Ruined Baton → Metal Parts x2
  (162, 115, 2),  -- Ruined Handcuffs → Metal Parts x2
  (163, 73, 1),   -- Ruined Parachute → Electrical Components x1
  (164, 115, 2),  -- Ruined Tactical Vest → Metal Parts x2
  (165, 115, 2),  -- Ruined Riot Shield → Metal Parts x2
  (166, 115, 2),  -- Rusted Bolts → Metal Parts x2
  (167, 115, 2),  -- Rusted Gear → Metal Parts x2
  (168, 42, 1),   -- Rusted Shut Medical Kit → Chemicals x1
  (169, 115, 3),  -- Rusted Tools → Metal Parts x3
  (170, 9, 1),    -- Rusty ARC Steel → ARC Alloy x1
  (171, 73, 1),   -- Sample Cleaner → Electrical Components x1
  (173, 9, 1),    -- Sentinel Firing Core → ARC Alloy x1
  (174, 73, 1),   -- Signal Amplifier → Electrical Components x1
  (177, 9, 1),    -- Snitch Scanner → ARC Alloy x1
  (182, 129, 2),  -- Speaker Component → Plastic Parts x2
  (182, 158, 3),  -- Speaker Component → Rubber Parts x3
  (183, 73, 1),   -- Spectrum Analyzer → Electrical Components x1
  (184, 73, 1),   -- Spectrometer → Electrical Components x1
  (185, 115, 1),  -- Spring Cushion → Metal Parts x1
  (186, 9, 1),    -- Spotter Relay → ARC Alloy x1
  (188, 115, 2),  -- Steel Spring → Metal Parts x2
  (189, 9, 1),    -- Surveyor Vault → ARC Alloy x1
  (190, 42, 2),   -- Synthesized Fuel → Chemicals x2
  (191, 129, 1),  -- Syringe → Plastic Parts x1
  (192, 9, 1),    -- Tattered ARC Lining → ARC Alloy x1
  (193, 79, 2),   -- Tattered Clothes → Fabric x2
  (194, 73, 1),   -- Telemetry Transceiver → Electrical Components x1
  (195, 115, 1),  -- Thermostat → Metal Parts x1
  (196, 9, 1),    -- Tick Pod → ARC Alloy x1
  (197, 115, 1),  -- Toaster → Metal Parts x1
  (199, 79, 3),   -- Torn Blanket → Fabric x3
  (200, 73, 1),   -- Turbo Pump → Electrical Components x1
  (201, 115, 2),  -- Unusable Weapon → Metal Parts x2
  (206, 9, 2),    -- Wasp Driver → ARC Alloy x2
  (207, 115, 2),  -- Water Filter → Metal Parts x2
  (208, 115, 2);  -- Water Pump → Metal Parts x2

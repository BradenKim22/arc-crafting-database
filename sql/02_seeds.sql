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
 INSERT INTO loot (loot_id, name, description, rarity, category) VALUES
(1,'Advanced ARC Powercell','Scrap, unless you need Energy clips','Rare','Arc (high level enemies)'),
(2,'Advanced Electrical Components','Stash (used for many recipes, as well as Gear Bench level 3 and Utility Station level 3)','Rare','Electrical'),
(3,'Advanced Mechanical Components','Stash (Gunsmith level 3)','Rare','Mechanical'),
(4,'Agave','Sell','Uncommon','Nature'),
(5,'Air Freshener','Sell','Uncommon','Mechanical'),
(6,'Alarm Clock','Sell','Rare','Residential'),
(7,'Antiseptic','Stash (Doctor''s Orders quest)','Rare','Medical'),
(8,'Apricot','Stash (Scrappy upgrades level 3 and 5)','Uncommon','Nature'),
(9,'ARC Alloy','Stash (Clearer Skies mission and multiple workshop upgrades)','Uncommon','Arc (Various)'),
(10,'ARC Circuitry','Stash (Refiner level 3)','Rare','Arc (Various)'),
(11,'ARC Coolant','Scrap (Chemicals)','Rare','Arc (Various)'),
(12,'ARC Flex Rubber','Scrap (Rubber)','Rare','Arc (Various)'),
(13,'ARC Motion Core','Stash (Refiner level 2)','Rare','Arc (Various)'),
(14,'ARC Performance Steel','Sell','Rare','Arc (Various)'),
(15,'ARC Powercell','Stash (Refiner level 1 and Shield crafting)','Common','Arc (Various)'),
(16,'ARC Synthetic Resin','Scrap (Plastic)','Rare','Arc (Various)'),
(17,'ARC Thermo Lining','Scrap (Fabric)','Rare','Arc (Various)'),
(18,'Assorted Seeds','Stash (Used for Celeste)','Common','Nature'),
(19,'Bastion Cell','Stash (Gear Bench level 3)','Epic','Arc (Bastion)'),
(20,'Battery','Stash (Trash into Treasure quest)','Uncommon','Technological or Electrical'),
(21,'Bicycle Pump','Stash (The League quest)','Rare','Residential'),
(22,'Bloated Tuna Can','Sell','Common','Commercial or Residential'),
(23,'Blue Gate Communication Tower Key','Stash','Rare','Any (random loot)'),
(24,'Blue Gate Confiscation Room Key','Stash','Epic','Any (random loot)'),
(25,'Blue Gate Cellar Key','Stash','Uncommon','Any (random loot)'),
(26,'Blue Gate Village Key','Stash','Uncommon','Any (random loot)'),
(27,'Bombardier Cell','Stash (Refiner level 3)','Epic','Arc (Bombadier)'),
(28,'Breathtaking Snow Globe','Sell','Epic','Residential, Old World or Commercial'),
(29,'Broken Flashlight','Scrap (Batteries and Metal)','Rare','Security'),
(30,'Broken Guidance System','Scrap (Processors)','Rare','Industrial'),
(31,'Broken Handheld Radio','Scrap (Sensors and Wires)','Rare','Security'),
(32,'Broken Taser','Scrap (Battery and Wires)','Rare','Security'),
(33,'Buried City Hospital Key','Stash','Rare','Any/random loot or Life of a Pharmacist quest reward'),
(34,'Buried City JKV Employee Access Card','Stash','Uncommon','Any (random loot)'),
(35,'Buried City Residential Mastery Key','Stash','Uncommon','Any/random loot, Digging up Dirt quest reward'),
(36,'Buried City Town Hall Key','Stash','Epic','Any (random loot)'),
(37,'Burned ARC Circuitry','Scrap (Arc Alloy)','Uncommon','Arc (Various)'),
(38,'Camera Lens','Stash (Movie Night quest)','Uncommon','Security'),
(39,'Candle Holder','Scrap (Metal)','Uncommon','Residential'),
(40,'Canister','Scrap (Plastic)','Uncommon','Commercial'),
(41,'Cat Bed','Stash (Scrappy level 4)','Common','Commercial or residential'),
(42,'Chemicals','Stash (used for many recipes)','Common','Mechanical, Residential or Medical'),
(43,'Coffee Pot','Sell','Common','Residential'),
(44,'Complex Gun Parts','Stash (to craft complex weapons)','Epic','Security'),
(45,'Coolant','Scrap (Chemicals and Oil)','Rare','Mechanical'),
(46,'Cooling Coil','Sell','Rare','Industrial'),
(47,'Cooling Fan','Stash (Used for Expeditions)','Rare','Technological'),
(48,'Cracked Bioscanner','Stash (Medical Lab level 3)','Rare','Medical'),
(49,'Crude Explosives','Stash (Explosives Station level 3)','Uncommon','Industrial or Security'),
(50,'Crumpled Plastic Bottle','Scrap (Plastic)','Uncommon','Residential');
(51,'Dam Control Tower Key','Stash','Epic','Any (random loot)'),
(52,'Dam Staff Room Key','Stash','Uncommon','Any/random loot, Tribute to Toledo quest reward'),
(53,'Dam Surveillance Key','Stash','Uncommon','Any (random loot)'),
(54,'Dam Testing Annex Key','Stash','Rare','Any (random loot)'),
(55,'Dam Utility Key','Stash','Uncommon','Any (random loot)'),
(56,'Damaged ARC Motion Core','Scrap (Arc Alloy)','Uncommon','Arc (Various)'),
(57,'Damaged ARC Powercell','Scrap (Arc Alloy)','Common','Arc (Various)'),
(58,'Damaged Fireball Burner','Scrap (Arc Alloy)','Common','Arc (Fireball)'),
(59,'Damaged Heat Sink','Stash (Utility Station 2)','Rare','Technological'),
(60,'Damaged Hornet Driver','Stash (Used for The Trifecta and Wasps and Hornets quests)','Common','Arc (Hornet)'),
(61,'Damaged Rocketeer Driver','Scrap (Arc Alloy)','Common','Arc (Rocketeer)'),
(62,'Damaged Snitch Scanner','Scrap (Arc Alloy)','Common','Arc (Snitch)'),
(63,'Damaged Tick Pod','Scrap (Arc Alloy)','Common','Arc (Tick)'),
(64,'Damaged Wasp Driver','Scrap (Arc Alloy)','Common','Arc (Wasp)'),
(65,'Dart Board','Sell','Uncommon','Commercial or Residential'),
(66,'Deflated Football','Sell','Uncommon','Residential'),
(67,'Degraded ARC Rubber','Scrap (Rubber)','Uncommon','Arc (Various)'),
(68,'Diving Goggles','Scrap (Rubber)','Rare','Residential'),
(69,'Dog Collar','Stash (Scrappy level 2)','Rare','Residential'),
(70,'Dried-Out ARC Resin','Scrap (Plastic)','Uncommon','Arc (Various)'),
(71,'Duct Tape','Stash (Used for weapon mods)','Uncommon','Commercial or Residential'),
(72,'Durable Cloth','Stash (Used for recipes, Eyes in the Sky quest, and Medical Lab level 2)','Uncommon','Medical of Commercial'),
(73,'Electrical Components','Stash (Used for recipes, Movie Night quest, Expeditions, Gear Bench level 2 and Utility Station level 2)','Uncommon','Electrical'),
(74,'Empty Wine Bottle','Sell','Common','Commercial or Residential'),
(75,'Exodus Modules','Stash (Used to craft high level weapons and Snap Hooks)','Epic','Exodus'),
(76,'Expired Pasta','Sell','Common','Commercial or Residential'),
(77,'Expired Respirator','Scrap (Rubber and Fabric)','Rare','Medical'),
(78,'Explosive Compound','Stash (Explosive Station level 3)','Rare','Industrial or Security'),
(79,'Fabric','Stash (Used for many recipes)','Common','Commercial, Residential or Medical'),
(80,'Faded Photograph','Sell','Common','Residential'),
(81,'Fertilizer','Sell','Uncommon','Nature'),
(82,'Film Reel','Sell','Common','Residential or Old World'),
(83,'Fine Wristwatch','Sell','Common','Commercial or Residential'),
(84,'Fireball Burner','Stash (Refiner level 2)','Uncommon','Arc (Fireball)'),
(85,'Flow Controller','Keep for the Snap and Salvage quest','Rare','Exodus'),
(86,'Frequency Modulation Box','Sell','Rare','Exodus'),
(87,'Fried Motherboard','Stash (Utility Station level 3)','Rare','Technological'),
(88,'Frying Pan','Scrap (Metal)','Rare','Residential'),
(89,'Garlic Press','Scrap (Metal)','Uncommon','Commercial or Residential'),
(90,'Geiger Counter','Stash (Trophy Cabinet part and recycles to give an Exodus Module)','Epic','Exodus'),
(91,'Great Mullein','Stash (Doctor''s Orders quest)','Uncommon','Nature'),
(92,'Headphones','Scrap (Rubber and Speaker components)','Rare','Commercial or Residential'),
(93,'Heavy Gun Parts','Stash (Used for crafting and upgrading weapons)','Rare','Raider or Security'),
(94,'Hornet Driver','Stash (Used for The Trifecta quest and Gear Bench level 2)','Rare','Arc (Hornet)'),
(95,'Household Cleaner','Scrap (Chemicals)','Uncommon','Residential'),
(96,'Humidifier','Scrap (Canisters and Wires)','Rare','Residential'),
(97,'Ice Cream Scooper','Scrap (Metal)','Uncommon','Commercial or Residential'),
(98,'Impure ARC Coolant','Scrap (Chemicals)','Uncommon','Arc (Various)'),
(99,'Industrial Battery','Stash (Gear Bench level 3)','Rare','Industrial'),
(100,'Industrial Charger','Scrap (Metal and Voltage Converter)','Rare','Industrial');
(101,'Industrial Magnet','Scrap (Metal and Magnet)','Rare','Industrial'),
(102,'Ion Sputter','Keep for the With A View quest or scrap for an Exodus module','Epic','Exodus'),
(103,'Laboratory Reagents','Stash (Explosives Station level 3)','Rare','Medical'),
(104,'Lance''s Mixtape (5th Edition)','Sell','Epic','Residential or Commercial'),
(105,'Leaper Pulse Unit','Stash (Into the Fray quest and Utility Station 3)','Epic','Arc (Leaper)'),
(106,'Lemon','Stash (Scrappy level 3)','Uncommon','Nature'),
(107,'Light Bulb','Sell','Uncommon','Electrical'),
(108,'Light Gun Parts','Stash (Used for crafting Guns)','Rare','Raider or Security'),
(109,'Magnetron','Keep for the Snap and Salvage quest','Epic','Exodus'),
(110,'Magnet','Stash (Used for a variety of equipments)','Uncommon','Exodus'),
(111,'Magnetic Accelerator','Stash (Used for crafting advanced weapons)','Epic','Exodus'),
(112,'Mechanical Components','Stash (Gunsmith level 2)','Rare','Mechanical'),
(113,'Medium Gun Parts','Stash (Used for crafting weapons)','Rare','Raider or Security'),
(114,'Metal Brackets','Scrap (Metal)','Uncommon','Mechanical or Electrical'),
(115,'Metal Parts','Stash (Used for many recipes)','Common','Mechanical, Industrial, Electrical or Technological'),
(116,'Microscope','Sell or recycle for Advanced Mechanical Components','Rare','Exodus'),
(117,'Mini Centrifuge','Sell or recycle for Advanced Mechanical Components','Rare','Exodus'),
(118,'Mod Components','Stash (Used to craft weapon mods)','Rare','Security'),
(119,'Moss','Scrap (Assorted Seeds)','Rare','Nature'),
(120,'Motor','Stash (Refiner level 3)','Rare','Mechanical'),
(121,'Mushroom','Stash (Scrappy level 5)','Uncommon','Nature'),
(122,'Music Album','Sell','Rare','Residential or Commercial'),
(123,'Music Box','Sell','Rare','Old World, Commercial or Residential'),
(124,'Number Plate','Scrap (Metal)','Uncommon','Mechanical'),
(125,'Oil','Stash (Used for many recipes)','Uncommon','Mechanical'),
(126,'Olives','Stash (Scrappy level 4)','Uncommon','Nature'),
(127,'Painted Box','Sell','Common','Old World'),
(128,'Patrol Car Key','Stash','Uncommon','Any (random loot)'),
(129,'Plastic Parts','Stash (Used for a variety of weapons, Gear Bench level 1 and Utility Station level 1)','Common','Technological, Commercial or Residential'),
(130,'Playing Cards','Sell','Rare','Commercial or Residential'),
(131,'Polluted Air Filter','Scrap (Fabric and Oil)','Rare','Industrial'),
(132,'Pop Trigger','Stash (Explosives Table level 2)','Common','Arc (Pop)'),
(133,'Portable TV','Scrap (Wires and Battery)','Rare','Residential'),
(134,'Poster of Natural Wonders','Sell','Uncommon','Commercial or Residential'),
(135,'Pottery','Sell','Uncommon','Old World or Residential'),
(136,'Power Bank','Scrap (Battery and Wires)','Rare','Electrical, Commercial or Residential'),
(137,'Power Cable','Stash (Gear Bench level 3)','Rare','Electrical, Commercial or Residential'),
(138,'Power Rod','Stash (Tribute to Toledo quest)','Epic','Exodus'),
(139,'Prickly Pear','Stash (Scrappy level 4)','Common','Nature'),
(140,'Processor','Stash (Used for crafting Augments)','Rare','Technological'),
(141,'Projector','Scrap (Wires and Processors)','Rare','Residential'),
(142,'Queen Reactor','Stash (Used to craft legendary weapons)','Legendary','Arc (Queen)'),
(143,'Radio','Scrap (Speaker Components and Sensors)','Rare','Commercial or Residential'),
(144,'Radio Relay','Sell','Rare','Exodus'),
(145,'Raider Hatch Key','Stash','Rare','Any/random Loot, Crafting, Sold by Shani'),
(146,'Red Coral Jewelry','Sell','Rare','Old World, Commercial or Residential'),
(147,'Remote Control','Scrap (Plastic and Sensors)','Uncommon','Residential'),
(148,'Resin','Sell','Common','Nature'),
(149,'Rocketeer Driver','Stash (Out of the Shadows quest and Explosive Station level 3)','Epic','Arc (Rocketeer)'),
(150,'Ripped Safety Vest','Scrap (Durable Cloth)','Uncommon','Industrial');
(151,'Rocket Thruster','Scrap (Synthesized Fuel and Metal Parts)','Rare','Exodus'),
(152,'Roots','Scrap (Assorted Seeds)','Uncommon','Nature'),
(153,'Rope','Stash (for crafting ziplines)','Rare','Commercial or Residential'),
(154,'Rosary','Sell','Common','Old World or Residential'),
(155,'Rotary Encoder','Keep for the With a View quest','Rare','Exodus'),
(156,'Rubber Duck','Sell','Common','Any/Random Loot'),
(157,'Rubber Pad','Scrap (Rubber)','Rare','Electrical'),
(158,'Rubber Parts','Stash (used for many recipes)','Common','Mechanical, Industrial or Electrical'),
(159,'Ruined Accordion','Scrap (Rubber and Steel Springs)','Rare','Residential'),
(160,'Ruined Augment','Scrap (Plastic and Rubber)',NULL,'Combat'),
(161,'Ruined Baton','Scrap (Metal and Rubber)','Uncommon','Security'),
(162,'Ruined Handcuffs','Scrap (Metal)','Uncommon','Security'),
(163,'Ruined Parachute','Scrap (Fabric)','Uncommon','Exodus'),
(164,'Ruined Tactical Vest','Scrap (Fabric and Magnets)','Uncommon','Security'),
(165,'Ruined Riot Shield','Scrap (Plastic and Rubber)','Rare','Security'),
(166,'Rusted Bolts','Scrap (Metal)','Uncommon','Mechanical or Industrial'),
(167,'Rusted Gear','Stash (Gunsmith level 3)','Rare','Industrial'),
(168,'Rusted Shut Medical Kit','Stash (Medical Lab Level 3)','Rare','Medical'),
(169,'Rusted Tools','Stash (Gunsmith level 2)','Rare','Mechanical or Industrial'),
(170,'Rusty ARC Steel','Scrap (Metal)','Uncommon','Arc (Various)'),
(171,'Sample Cleaner','Sell','Rare','Exodus'),
(172,'Sensors','Stash (Used in many recipes, including Raider Hatch keys)','Rare','Technological or Security'),
(173,'Sentinel Firing Core','Stash (Gunsmith level 3)','Rare','Arc (Sentinel)'),
(174,'Signal Amplifier','Sell','Rare','Exodus'),
(175,'Silver Teaspoon Set','Sell','Rare','Old World, Commercial or Residential'),
(176,'Simple Gun Parts','Stash (Used in weapon crafting)','Uncommon','Raider or Security'),
(177,'Snitch Scanner','Stash (The Trifecta quest and Utility Station level 2)','Uncommon','Arc (Snitch)'),
(178,'Spaceport Container Storage Key','Stash','Rare','Any/random loot, Switching the Supply quest reward'),
(179,'Spaceport Control Tower Key','Stash','Rare','Any/Random loot'),
(180,'Spaceport Trench Tower Key','Stash','Uncommon','Any/random loot, Turnabout quest reward'),
(181,'Spaceport Warehouse Key','Stash','Uncommon','Any/random loot, Switching the Supply quest reward'),
(182,'Speaker Component','Stash (Used for crafting Lure Grenades and Photoelectric Cloaks)','Rare','Commercial'),
(183,'Spectrum Analyzer','Scrap (Gives Exodus Module)','Epic','Exodus'),
(184,'Spectrometer','Sell','Rare','Exodus'),
(185,'Spring Cushion','Scrap (Durable Cloth and Steel Springs)','Rare','Commercial or Residential'),
(186,'Spotter Relay','Sell','Uncommon','Arc (Spotter)'),
(187,'Statuette','Sell','Common','Old World or Residential'),
(188,'Steel Spring','Stash (Used in mod crafting)','Uncommon','Industrial'),
(189,'Surveyor Vault','Stash (Mixed Signals quest and Medical Lab level 3)','Rare','Arc (Surveyor)'),
(190,'Synthesized Fuel','Stash (Explosives Lab level 3)','Rare','Exodus'),
(191,'Syringe','Stash (Doctor''s Orders quest)','Rare','Medical'),
(192,'Tattered ARC Lining','Scrap (Fabric)','Uncommon','Arc (Various)'),
(193,'Tattered Clothes','Scrap (Fabric)','Uncommon','Residential'),
(194,'Telemetry Transceiver','Sell','Rare','Exodus'),
(195,'Thermostat','Scrap (Rubber and Sensors)','Rare','Residential'),
(196,'Tick Pod','Stash (Small But Sinister quest and Medical Lab level 2)','Uncommon','Arc (Tick)'),
(197,'Toaster','Stash (Refiner level 2)','Rare','Residential'),
(198,'Torn Book','Sell','Common','Residential or Old World'),
(199,'Torn Blanket','Scrap (Fabric)','Rare','Residential or Medical'),
(200,'Turbo Pump','Scrap (Mechanical Components and Oil)','Rare','Exodus'),
(201,'Unusable Weapon','Scrap (Metal and Simple Gun Parts)','Rare','Security'),
(202,'Vase','Sell','Rare','Old World, Commercial or Residential'),
(203,'Very Comfortable Pillow','Stash (Scrappy level 5)','Common','Commercial or Residential'),
(204,'Volcanic Rock','Sell','Common','Nature'),
(205,'Voltage Converter','Scrap (Wires and Rubber)','Rare','Technological'),
(206,'Wasp Driver','Stash (Used in The Trifecta and Wasps and Hornets quests, and Gunsmith level 2)','Rare','Arc (Wasp)'),
(207,'Water Filter','Sell','Rare','Industrial'),
(208,'Water Pump','Stash (Unexpected Initiative quest)','Rare','Mechanical or Industrial'),
(209,'Wires','Stash (Used in multiple quests, expeditions and crafting recipes)','Uncommon','Electrical or Technological');

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

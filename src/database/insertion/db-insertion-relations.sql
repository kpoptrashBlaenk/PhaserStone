-- Insert into battlecries
INSERT INTO battlecries (amount, battlecry_type_id, battlecry_target_id)
VALUES
    (1, 2, 1), -- Deal 1 damage to any target
    (1, 2, 2), -- Deal 1 damage to an enemy
    (1, 1, 3), -- Restore 1 health to a friendly character
    (1, 2, 4), -- Deal 1 damage to a random enemy
    (1, 1, 5), -- Restore 1 health to a random friendly character
    (1, 2, 6), -- Deal 1 damage to a random enemy minion
    (1, 1, 7), -- Restore 1 health to a random friendly minion
    (1, 2, 8), -- Deal 1 damage to the enemy hero
    (1, 1, 9), -- Restore 1 health to the friendly hero
    (2, 2, 1), -- Deal 2 damage to any target
    (2, 2, 4), -- Deal 2 damage to a random enemy
    (2, 2, 6), -- Deal 2 damage to a random enemy minion
    (2, 2, 8), -- Deal 2 damage to the enemy hero
    (3, 2, 2), -- Deal 3 damage to an enemy
    (3, 2, 4), -- Deal 3 damage to a random enemy
    (3, 2, 6), -- Deal 3 damage to a random enemy minion
    (3, 2, 8), -- Deal 3 damage to the enemy hero
    (3, 1, 9); -- Restore 3 health to the friendly hero

-- Insert into cards
INSERT INTO cards (attack, health, cost, name, text, battlecry_id, asset_id, track_id)
VALUES
    -- Cards with battlecries
    (1, 1, 1, 'Fire Imp', '[i]Battlecry:[/i] Deal 1 damage to any target.', 1, 1, ''),
    (2, 2, 2, 'Flame Elemental', '[i]Battlecry:[/i] Deal 1 damage to an enemy.', 2, 1, ''),
    (3, 3, 3, 'Healing Spirit', '[i]Battlecry:[/i] Deal 1 damage to a friendly character.', 3, 1, ''),
    (2, 3, 3, 'Random Ember', '[i]Battlecry:[/i] Deal 1 damage to a random enemy.', 4, 1, ''),
    (3, 2, 2, 'Guardian Angel', '[i]Battlecry:[/i] Deal 1 damage to a random friendly character.', 5, 1, ''),
    (4, 4, 4, 'Arcane Wisp', '[i]Battlecry:[/i] Deal 1 damage to a random enemy minion.', 6, 1, ''),
    (5, 5, 5, 'Divine Protector', '[i]Battlecry:[/i] Deal 1 damage to a random friendly minion.', 7, 1, ''),
    (6, 6, 6, 'Inferno Fiend', '[i]Battlecry:[/i] Deal 1 damage to the enemy hero.', 8, 1, ''),
    (2, 1, 1, 'Searing Spirit', '[i]Battlecry:[/i] Deal 1 damage to the friendly hero.', 9, 1, ''),
    (3, 2, 2, 'Magma Fury', '[i]Battlecry:[/i] Deal 2 damage to any target.', 10, 1, ''),
    (4, 3, 3, 'Firestorm Elemental', '[i]Battlecry:[/i] Deal 2 damage to a random enemy.', 11, 1, ''),
    (2, 5, 4, 'Molten Rock', '[i]Battlecry:[/i] Deal 2 damage to a random enemy minion.', 12, 1, ''),
    (5, 5, 5, 'Flame Guardian', '[i]Battlecry:[/i] Deal 2 damage to the enemy hero.', 13, 1, ''),
    (3, 4, 4, 'Thunder Fury', '[i]Battlecry:[/i] Deal 3 damage to an enemy.', 14, 1, ''),
    (6, 6, 6, 'Stormcaller', '[i]Battlecry:[/i] Deal 3 damage to a random enemy.', 15, 1, ''),
    (7, 7, 7, 'Lightning Elemental', '[i]Battlecry:[/i] Deal 3 damage to a random enemy minion.', 16, 1, ''),
    (8, 8, 8, 'Tempest Dragon', '[i]Battlecry:[/i] Deal 3 damage to the enemy hero.', 17, 1, ''),
    (2, 2, 1, 'Sacrificial Wisp', '[i]Battlecry:[/i] Deal 3 damage to the friendly hero.', 18, 1, ''),

    -- Cards without battlecries
    (3, 3, 3, 'Stone Golem', '', NULL, 1, ''),
    (5, 5, 5, 'Mighty Guardian', '', NULL, 1, ''),
    (2, 2, 2, 'Swift Scout', '', NULL, 1, ''),
    (6, 6, 6, 'Mountain Titan', '', NULL, 1, ''),
    (4, 4, 4, 'Forest Defender', '', NULL, 1, ''),
    (1, 2, 1, 'Wisp', '', NULL, 1, ''),
    (5, 7, 6, 'Frost Dragon', '', NULL, 1, ''),
    (4, 3, 4, 'Infernal Knight', '', NULL, 1, ''),
    (2, 5, 3, 'Shadow Demon', '', NULL, 1, ''),
    (3, 6, 5, 'Elemental Warden', '', NULL, 1, ''),
    (7, 4, 7, 'Fire Elemental', '', NULL, 1, ''),
    (6, 3, 6, 'Wind Spirit', '', NULL, 1, '');

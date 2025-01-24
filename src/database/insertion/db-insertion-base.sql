-- Insert into assets
INSERT INTO
    assets (asset_key, asset)
VALUES
    (
        'ALEXSTRAZA',
        '../../public/assets/images/cards/alexstraza.webp'
    ) ON CONFLICT DO NOTHING;

-- Insert into battlecry_types
INSERT INTO
    battlecry_types (type)
VALUES
    ('HEAL'),
    ('DAMAGE') ON CONFLICT DO NOTHING;

-- Insert into battlecry_targets
INSERT INTO
    battlecry_targets (target)
VALUES
    ('ANY'),
    -- 1
    ('ENEMY'),
    -- 2
    ('FRIENDLY'),
    -- 3
    ('RANDOM_ENEMY'),
    -- 4
    ('RANDOM_FRIENDLY'),
    -- 5
    ('RANDOM_ENEMY_MINION'),
    -- 6
    ('RANDOM_FRIENDLY_MINION'),
    -- 7
    ('ENEMY_HERO'),
    -- 8
    ('FRIENDLY_HERO') ON CONFLICT DO NOTHING;
    -- 9
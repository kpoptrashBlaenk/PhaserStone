-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    asset_key VARCHAR(255) NOT NULL,
    asset BYTEA NOT NULL
);

-- Create types table
CREATE TABLE IF NOT EXISTS types (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL
);

-- Create races table
CREATE TABLE IF NOT EXISTS races (
    id SERIAL PRIMARY KEY,
    race VARCHAR(255) NOT NULL
);

-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    attack INT NOT NULL,
    health INT NOT NULL,
    cost INT NOT NULL,
    text TEXT NOT NULL,
    battlecry_id INT,
    asset_id INT NOT NULL,
    type_id INT NOT NULL,
    FOREIGN KEY (battlecry_id) REFERENCES battlecries(id),
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (type_id) REFERENCES types(id)
);

-- Create card_races junction table
CREATE TABLE IF NOT EXISTS card_races (
    card_id INT NOT NULL,
    race_id INT NOT NULL,
    PRIMARY KEY (card_id, race_id),
    FOREIGN KEY (card_id) REFERENCES cards(id),
    FOREIGN KEY (race_id) REFERENCES races(id)
);

-- Create battlecry_types table
CREATE TABLE IF NOT EXISTS battlecry_types (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL
);

-- Create battlecry_targets table
CREATE TABLE IF NOT EXISTS battlecry_targets (
    id SERIAL PRIMARY KEY,
    target VARCHAR(255) NOT NULL
);

-- Create battlecries table
CREATE TABLE IF NOT EXISTS battlecries (
    id SERIAL PRIMARY KEY,
    amount INT NOT NULL,
    battlecry_type_id INT NOT NULL,
    battlecry_target_id INT NOT NULL,
    FOREIGN KEY (battlecry_type_id) REFERENCES battlecry_types(id),
    FOREIGN KEY (battlecry_target_id) REFERENCES battlecry_targets(id)
);
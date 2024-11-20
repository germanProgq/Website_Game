const client = require('./db');  // Assuming client is your PostgreSQL connection

// SQL schema for creating tables
const createTables = `
  -- Create Users Table
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    items TEXT[] DEFAULT '{}'  -- Array of item IDs that the user owns
  );

  -- Create Items Table
  CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,  -- E.g., weapon, armor, skin, etc.
    description TEXT,
    price INT NOT NULL
  );

  -- Create User Profiles Table
  CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    avatar VARCHAR(255),
    display_name VARCHAR(50),
    level INT DEFAULT 1,
    achievements TEXT[],
    PRIMARY KEY (user_id)
  );

  -- Create Game State Table
  CREATE TABLE IF NOT EXISTS game_state (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    game_id VARCHAR(255) NOT NULL,
    state JSONB,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Execute the schema to create tables
client.query(createTables)
  .then(() => console.log('Tables created successfully'))
  .catch((err) => {
    console.error('Error creating tables:', err);
    process.exit(1);  // Exit if tables creation fails
  });

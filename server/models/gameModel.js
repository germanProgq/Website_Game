const createGameInDB = async (creatorId, gameName, maxPlayers, gameType) => {
  try {
    const createGameQuery = `
      INSERT INTO games (creator_id, game_name, max_players, game_type, game_state)
      VALUES ($1, $2, $3, $4, 'waiting')
      RETURNING *;
    `;
    const result = await client.query(createGameQuery, [creatorId, gameName, maxPlayers, gameType]);
    return result.rows[0];
  } catch (err) {
    throw new Error('Error creating game: ' + err.message);
  }
};

// Join an existing game
const joinGameInDB= async (gameId) => {
  try {
    const gameQuery = 'SELECT * FROM games WHERE id = $1 AND game_state = $2';
    const game = await client.query(gameQuery, [gameId, 'waiting']);
    
    if (game.rows.length === 0) {
      throw new Error('Game not found or already started');
    }

    // Check if the game has space for more players
    if (game.rows[0].current_players >= game.rows[0].max_players) {
      throw new Error('Game is full');
    }

    // Add player to the game
    const updateGameQuery = `
      UPDATE games
      SET current_players = current_players + 1
      WHERE id = $1
      RETURNING *;
    `;
    const updatedGame = await client.query(updateGameQuery, [gameId]);
    return updatedGame.rows[0];
  } catch (err) {
    throw new Error('Error joining game: ' + err.message);
  }
};

// Fetch current game state (e.g., players, scores)
const getGameStateInDB = async (gameId) => {
  try {
    const gameQuery = 'SELECT * FROM games WHERE id = $1';
    const game = await client.query(gameQuery, [gameId]);
    
    if (game.rows.length === 0) {
      throw new Error('Game not found');
    }

    return game.rows[0];
  } catch (err) {
    throw new Error('Error fetching game state: ' + err.message);
  }
};

// Update the game state (e.g., start game, end game, update score)
const updateGameStateInDB = async (gameId, gameState) => {
  try {
    const updateGameStateQuery = `
      UPDATE games
      SET game_state = $1
      WHERE id = $2
      RETURNING *;
    `;
    const updatedGame = await client.query(updateGameStateQuery, [gameState, gameId]);
    return updatedGame.rows[0];
  } catch (err) {
    throw new Error('Error updating game state: ' + err.message);
  }
};

// End the game
const endGame = async (gameId) => {
  try {
    const endGameQuery = `
      UPDATE games
      SET game_state = 'ended'
      WHERE id = $1
      RETURNING *;
    `;
    const result = await client.query(endGameQuery, [gameId]);
    return result.rows[0];
  } catch (err) {
    throw new Error('Error ending game: ' + err.message);
  }
};

// Export the game model methods
module.exports = {
  createGameInDB,
  joinGameInDB,
  getGameStateInDB,
  updateGameStateInDB,
  endGame,
};

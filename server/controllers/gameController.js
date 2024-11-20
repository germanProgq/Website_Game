const gameModel = require('../models/gameModel'); // Import game model to interact with the database

// Create a new game
const createGame = async (req, res) => {
  const { creatorId, gameName, maxPlayers, gameType } = req.body;

  try {
    // Call the model function to create the game in the database
    const newGame = await gameModel.createGameInDB(creatorId, gameName, maxPlayers, gameType);

    // Emit a 'gameCreated' event to notify all clients
    io.emit('gameCreated', newGame);

    // Send a response back to the client with the newly created game data
    res.json({ message: 'Game created successfully', game: newGame });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Join an existing game
const joinGame = async (req, res) => {
  const { gameId, playerId } = req.body;

  try {
    // Call the model function to join the game
    const updatedGame = await gameModel.joinGameInDB(gameId);

    // Emit a 'playerJoined' event to notify other players about the new participant
    io.emit('playerJoined', { gameId, playerId });

    // Send a response back to the client with the updated game data
    res.json({ message: 'Joined game successfully', game: updatedGame });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Fetch current game state (e.g., players, scores)
const getGameState = async (req, res) => {
  const { gameId } = req.params;

  try {
    // Call the model function to fetch the game state from the database
    const gameState = await gameModel.getGameStateInDB(gameId);

    // Send the current game state back to the client
    res.json({ gameState });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update the game state (e.g., start game, end game, update score)
const updateGameState = async (req, res) => {
  const { gameId, gameState } = req.body;

  try {
    // Call the model function to update the game state in the database
    const updatedGame = await gameModel.updateGameStateInDB(gameId, gameState);

    // Emit a 'gameStateUpdated' event to notify all players of the game state update
    io.emit('gameStateUpdated', updatedGame);

    // Send a response back to the client with the updated game data
    res.json({ message: 'Game state updated', game: updatedGame });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// End the game
const endGame = async (req, res) => {
  const { gameId } = req.params;

  try {
    // Call the model function to end the game in the database
    const endedGame = await gameModel.endGame(gameId);

    // Emit an event to notify all players that the game has ended
    io.emit('gameEnded', endedGame);

    // Send a response back to the client with the game status
    res.json({ message: 'Game ended successfully', game: endedGame });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createGame,
  joinGame,
  getGameState,
  updateGameState,
  endGame,
};

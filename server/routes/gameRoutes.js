const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController'); // Import the game controller

// Route for creating a new game
router.post('/create', gameController.createGame);

// Route for a player to join an existing game
router.post('/join', gameController.joinGame);

// Route for fetching the current game state (e.g., players, game progress)
router.get('/state/:gameId', gameController.getGameState);

// Route for updating the game state (e.g., start game, end game, update score)
router.put('/state/:gameId', gameController.updateGameState);

module.exports = router;

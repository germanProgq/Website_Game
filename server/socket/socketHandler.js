const socketIo = require('socket.io');
const { createGame, joinGame, getGameState, updateGameState } = require('../controllers/gameController');

// Initialize socket.io with the HTTP server
const initSocket = (server) => {
  const io = socketIo(server);
  // Handle new connections
  io.on('connection', (socket) => {
    console.log('New player connected:', socket.id);

    // Event for creating a new game
    socket.on('createGame', async (data) => {
      console.log(`Player ${socket.id} creating game...`);
      try {
        const game = await createGame(data);
        socket.emit('gameCreated', game);
      } catch (err) {
        socket.emit('error', 'Failed to create game');
      }
    });

    // Event for joining an existing game
    socket.on('joinGame', async (data) => {
      console.log(`Player ${socket.id} joining game ${data.gameId}...`);
      try {
        const game = await joinGame(data);
        socket.emit('gameJoined', game);
        io.emit('playerJoined', { gameId: data.gameId, playerId: socket.id });
      } catch (err) {
        socket.emit('error', 'Failed to join game');
      }
    });

    // Event for fetching the game state (like player stats, game progress)
    socket.on('getGameState', async (gameId) => {
      try {
        const gameState = await getGameState(gameId);
        socket.emit('gameState', gameState);
      } catch (err) {
        socket.emit('error', 'Failed to fetch game state');
      }
    });

    // Event for updating game state (e.g., starting the game, ending it, etc.)
    socket.on('updateGameState', async (data) => {
      try {
        const updatedGame = await updateGameState(data);
        io.emit('gameStateUpdated', updatedGame);
      } catch (err) {
        socket.emit('error', 'Failed to update game state');
      }
    });

    // Handle disconnections (when a player disconnects from the server)
    socket.on('disconnect', () => {
      console.log(`Player ${socket.id} disconnected`);
    });
  });

  return io;
};

module.exports = { initSocket };
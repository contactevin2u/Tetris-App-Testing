const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const TetrisGame = require('./game/TetrisGame');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

// Store active games by player ID
const games = new Map();

// Game tick interval (milliseconds)
const GAME_TICK_INTERVAL = 1000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tetris backend is running' });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Tetris Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      websocket: 'ws://[host]/game'
    }
  });
});

// WebSocket connection handler
wss.on('connection', (ws) => {
  const playerId = generatePlayerId();
  console.log(`Player ${playerId} connected`);

  // Create a new game for this player
  const game = new TetrisGame();
  games.set(playerId, { game, ws, interval: null });

  // Send initial game state
  ws.send(JSON.stringify({
    type: 'init',
    playerId: playerId,
    state: game.getState()
  }));

  // Handle messages from client
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleGameAction(playerId, data);
    } catch (error) {
      console.error('Error parsing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });

  // Handle disconnection
  ws.on('close', () => {
    console.log(`Player ${playerId} disconnected`);
    const playerGame = games.get(playerId);
    if (playerGame && playerGame.interval) {
      clearInterval(playerGame.interval);
    }
    games.delete(playerId);
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for player ${playerId}:`, error);
  });
});

function handleGameAction(playerId, data) {
  const playerGame = games.get(playerId);
  if (!playerGame) return;

  const { game, ws } = playerGame;

  switch (data.action) {
    case 'start':
      startGame(playerId);
      break;
    case 'move_left':
      game.moveLeft();
      sendGameState(playerId);
      break;
    case 'move_right':
      game.moveRight();
      sendGameState(playerId);
      break;
    case 'move_down':
      game.moveDown();
      sendGameState(playerId);
      break;
    case 'rotate':
      game.rotate();
      sendGameState(playerId);
      break;
    case 'hard_drop':
      game.hardDrop();
      sendGameState(playerId);
      break;
    case 'reset':
      if (playerGame.interval) {
        clearInterval(playerGame.interval);
      }
      game.reset();
      sendGameState(playerId);
      break;
    case 'pause':
      if (playerGame.interval) {
        clearInterval(playerGame.interval);
        playerGame.interval = null;
      }
      ws.send(JSON.stringify({
        type: 'paused'
      }));
      break;
    case 'resume':
      startGame(playerId);
      break;
    default:
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Unknown action'
      }));
  }
}

function startGame(playerId) {
  const playerGame = games.get(playerId);
  if (!playerGame) return;

  // Clear existing interval if any
  if (playerGame.interval) {
    clearInterval(playerGame.interval);
  }

  const { game } = playerGame;

  // Game loop - move piece down automatically
  playerGame.interval = setInterval(() => {
    if (!game.gameOver) {
      game.moveDown();
      sendGameState(playerId);

      if (game.gameOver) {
        clearInterval(playerGame.interval);
        playerGame.ws.send(JSON.stringify({
          type: 'game_over',
          state: game.getState()
        }));
      }
    }
  }, Math.max(200, GAME_TICK_INTERVAL - (game.level - 1) * 100));

  sendGameState(playerId);
}

function sendGameState(playerId) {
  const playerGame = games.get(playerId);
  if (!playerGame) return;

  const { game, ws } = playerGame;

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'state_update',
      state: game.getState()
    }));
  }
}

function generatePlayerId() {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get PORT from environment variable (for Render deployment)
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Tetris server running on port ${PORT}`);
  console.log(`WebSocket server is ready`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

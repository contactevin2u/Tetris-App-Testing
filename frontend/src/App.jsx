import { useState, useEffect, useCallback } from 'react';
import useWebSocket from './hooks/useWebSocket';
import GameBoard from './components/GameBoard';
import InfoPanel from './components/InfoPanel';
import GameControls from './components/GameControls';
import StatusIndicator from './components/StatusIndicator';
import GameOverModal from './components/GameOverModal';
import './App.css';

const WS_URL = import.meta.env.VITE_WS_URL ||
  (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host;

function App() {
  const { isConnected, gameState, isGameOver, sendAction } = useWebSocket(WS_URL);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleStart = useCallback(() => {
    sendAction('start');
    setGameStarted(true);
    setIsPaused(false);
  }, [sendAction]);

  const handlePause = useCallback(() => {
    if (isPaused) {
      sendAction('resume');
      setIsPaused(false);
    } else {
      sendAction('pause');
      setIsPaused(true);
    }
  }, [isPaused, sendAction]);

  const handleReset = useCallback(() => {
    sendAction('reset');
    setGameStarted(false);
    setIsPaused(false);
  }, [sendAction]);

  useEffect(() => {
    if (isGameOver) {
      setGameStarted(false);
    }
  }, [isGameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted || isPaused) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          sendAction('move_left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          sendAction('move_right');
          break;
        case 'ArrowDown':
          e.preventDefault();
          sendAction('move_down');
          break;
        case 'ArrowUp':
        case ' ':
          e.preventDefault();
          sendAction('rotate');
          break;
        case 'Enter':
          e.preventDefault();
          sendAction('hard_drop');
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          handlePause();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, isPaused, sendAction, handlePause]);

  return (
    <div className="app">
      <div className="container">
        <div className="game-section">
          <h1>Tetris</h1>
          <StatusIndicator isConnected={isConnected} />
          <GameBoard gameState={gameState} />
          <GameControls
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            gameStarted={gameStarted}
            isPaused={isPaused}
          />
        </div>
        <InfoPanel gameState={gameState} />
      </div>
      <GameOverModal
        isGameOver={isGameOver}
        finalScore={gameState?.score || 0}
        onPlayAgain={handleReset}
      />
    </div>
  );
}

export default App;

const GameControls = ({ onStart, onPause, onReset, gameStarted, isPaused }) => {
  return (
    <div className="button-group">
      <button onClick={onStart} disabled={gameStarted && !isPaused}>
        Start Game
      </button>
      <button onClick={onPause} disabled={!gameStarted}>
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <button onClick={onReset}>
        Reset
      </button>
    </div>
  );
};

export default GameControls;

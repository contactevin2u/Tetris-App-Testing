const GameOverModal = ({ isGameOver, finalScore, onPlayAgain }) => {
  if (!isGameOver) return null;

  return (
    <div className="game-over show">
      <h2>Game Over!</h2>
      <p className="final-score">Final Score: {finalScore}</p>
      <button onClick={onPlayAgain}>Play Again</button>
    </div>
  );
};

export default GameOverModal;

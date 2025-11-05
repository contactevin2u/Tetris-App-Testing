import NextPiece from './NextPiece';

const InfoPanel = ({ gameState }) => {
  return (
    <div className="info-panel">
      <div className="info-box">
        <h3>Score</h3>
        <p>{gameState?.score || 0}</p>
      </div>
      <div className="info-box">
        <h3>Level</h3>
        <p>{gameState?.level || 1}</p>
      </div>
      <div className="info-box">
        <h3>Lines</h3>
        <p>{gameState?.linesCleared || 0}</p>
      </div>
      <div className="info-box">
        <h3>Next Piece</h3>
        <NextPiece nextPiece={gameState?.nextPiece} />
      </div>
      <div className="controls">
        <h3>Controls</h3>
        <p>← → : Move</p>
        <p>↓ : Soft Drop</p>
        <p>↑ or Space : Rotate</p>
        <p>Enter : Hard Drop</p>
        <p>P : Pause</p>
      </div>
    </div>
  );
};

export default InfoPanel;

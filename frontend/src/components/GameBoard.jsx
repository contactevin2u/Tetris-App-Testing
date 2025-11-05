import { useEffect, useRef } from 'react';

const COLORS = [
  '#000000', // 0 - empty
  '#00f0f0', // 1 - I (cyan)
  '#f0f000', // 2 - O (yellow)
  '#a000f0', // 3 - T (purple)
  '#00f000', // 4 - S (green)
  '#f00000', // 5 - Z (red)
  '#0000f0', // 6 - J (blue)
  '#f0a000'  // 7 - L (orange)
];

const GameBoard = ({ gameState, blockSize = 30 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!gameState || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw board
    for (let y = 0; y < gameState.board.length; y++) {
      for (let x = 0; x < gameState.board[y].length; x++) {
        if (gameState.board[y][x] !== 0) {
          drawBlock(ctx, x, y, COLORS[gameState.board[y][x]], blockSize);
        }
      }
    }

    // Draw current piece
    if (gameState.currentPiece) {
      const piece = gameState.currentPiece;
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            drawBlock(ctx, piece.x + x, piece.y + y, COLORS[piece.color], blockSize);
          }
        }
      }
    }
  }, [gameState, blockSize]);

  const drawBlock = (ctx, x, y, color, blockSize) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
  };

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={600}
      style={{
        border: '3px solid #fff',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        background: '#000'
      }}
    />
  );
};

export default GameBoard;

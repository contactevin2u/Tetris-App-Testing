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

const NextPiece = ({ nextPiece }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!nextPiece || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const blockSize = 30;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Center the piece
    const offsetX = (4 - nextPiece.shape[0].length) / 2;
    const offsetY = (4 - nextPiece.shape.length) / 2;

    for (let y = 0; y < nextPiece.shape.length; y++) {
      for (let x = 0; x < nextPiece.shape[y].length; x++) {
        if (nextPiece.shape[y][x]) {
          const drawX = (offsetX + x) * blockSize;
          const drawY = (offsetY + y) * blockSize;

          ctx.fillStyle = COLORS[nextPiece.color];
          ctx.fillRect(drawX, drawY, blockSize, blockSize);
          ctx.strokeStyle = '#222';
          ctx.lineWidth = 2;
          ctx.strokeRect(drawX, drawY, blockSize, blockSize);
        }
      }
    }
  }, [nextPiece]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={120}
      style={{
        border: '2px solid #fff',
        borderRadius: '5px',
        background: '#000',
        marginTop: '10px'
      }}
    />
  );
};

export default NextPiece;

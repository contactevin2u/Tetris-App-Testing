class TetrisGame {
  constructor(width = 10, height = 20) {
    this.width = width;
    this.height = height;
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
    this.gameOver = false;
    this.currentPiece = null;
    this.nextPiece = null;
    this.generateNewPiece();
  }

  createEmptyBoard() {
    return Array.from({ length: this.height }, () => Array(this.width).fill(0));
  }

  // Tetromino shapes (I, O, T, S, Z, J, L)
  static PIECES = {
    I: [[1, 1, 1, 1]],
    O: [
      [1, 1],
      [1, 1]
    ],
    T: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    S: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    Z: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    J: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    L: [
      [0, 0, 1],
      [1, 1, 1]
    ]
  };

  static PIECE_COLORS = {
    I: 1,
    O: 2,
    T: 3,
    S: 4,
    Z: 5,
    J: 6,
    L: 7
  };

  generateNewPiece() {
    const pieces = Object.keys(TetrisGame.PIECES);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];

    if (this.nextPiece) {
      this.currentPiece = this.nextPiece;
    } else {
      this.currentPiece = {
        shape: TetrisGame.PIECES[randomPiece],
        color: TetrisGame.PIECE_COLORS[randomPiece],
        x: Math.floor(this.width / 2) - 1,
        y: 0,
        type: randomPiece
      };
    }

    const nextRandomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    this.nextPiece = {
      shape: TetrisGame.PIECES[nextRandomPiece],
      color: TetrisGame.PIECE_COLORS[nextRandomPiece],
      x: Math.floor(this.width / 2) - 1,
      y: 0,
      type: nextRandomPiece
    };

    if (this.checkCollision(this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y)) {
      this.gameOver = true;
    }
  }

  checkCollision(shape, x, y) {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;

          if (newX < 0 || newX >= this.width || newY >= this.height) {
            return true;
          }

          if (newY >= 0 && this.board[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  rotate() {
    if (!this.currentPiece || this.gameOver) return false;

    const rotated = this.currentPiece.shape[0].map((_, i) =>
      this.currentPiece.shape.map(row => row[i]).reverse()
    );

    if (!this.checkCollision(rotated, this.currentPiece.x, this.currentPiece.y)) {
      this.currentPiece.shape = rotated;
      return true;
    }
    return false;
  }

  moveLeft() {
    if (!this.currentPiece || this.gameOver) return false;

    if (!this.checkCollision(this.currentPiece.shape, this.currentPiece.x - 1, this.currentPiece.y)) {
      this.currentPiece.x--;
      return true;
    }
    return false;
  }

  moveRight() {
    if (!this.currentPiece || this.gameOver) return false;

    if (!this.checkCollision(this.currentPiece.shape, this.currentPiece.x + 1, this.currentPiece.y)) {
      this.currentPiece.x++;
      return true;
    }
    return false;
  }

  moveDown() {
    if (!this.currentPiece || this.gameOver) return false;

    if (!this.checkCollision(this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y + 1)) {
      this.currentPiece.y++;
      return true;
    } else {
      this.lockPiece();
      return false;
    }
  }

  hardDrop() {
    if (!this.currentPiece || this.gameOver) return;

    while (!this.checkCollision(this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y + 1)) {
      this.currentPiece.y++;
    }
    this.lockPiece();
  }

  lockPiece() {
    const { shape, x, y, color } = this.currentPiece;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const boardY = y + row;
          const boardX = x + col;
          if (boardY >= 0) {
            this.board[boardY][boardX] = color;
          }
        }
      }
    }

    this.clearLines();
    this.generateNewPiece();
  }

  clearLines() {
    let linesCleared = 0;

    for (let row = this.height - 1; row >= 0; row--) {
      if (this.board[row].every(cell => cell !== 0)) {
        this.board.splice(row, 1);
        this.board.unshift(Array(this.width).fill(0));
        linesCleared++;
        row++; // Check the same row again
      }
    }

    if (linesCleared > 0) {
      this.linesCleared += linesCleared;
      this.score += this.calculateScore(linesCleared);
      this.level = Math.floor(this.linesCleared / 10) + 1;
    }
  }

  calculateScore(lines) {
    const baseScores = [0, 100, 300, 500, 800];
    return baseScores[lines] * this.level;
  }

  getState() {
    return {
      board: this.board.map(row => [...row]),
      currentPiece: this.currentPiece ? {
        shape: this.currentPiece.shape,
        x: this.currentPiece.x,
        y: this.currentPiece.y,
        color: this.currentPiece.color,
        type: this.currentPiece.type
      } : null,
      nextPiece: this.nextPiece ? {
        shape: this.nextPiece.shape,
        color: this.nextPiece.color,
        type: this.nextPiece.type
      } : null,
      score: this.score,
      level: this.level,
      linesCleared: this.linesCleared,
      gameOver: this.gameOver
    };
  }

  reset() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
    this.gameOver = false;
    this.currentPiece = null;
    this.nextPiece = null;
    this.generateNewPiece();
  }
}

module.exports = TetrisGame;

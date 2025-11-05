package com.tetris.game

data class GameState(
    val board: Array<IntArray>,
    val currentPiece: Piece?,
    val nextPiece: Piece?,
    val score: Int,
    val level: Int,
    val linesCleared: Int,
    val gameOver: Boolean
)

data class Piece(
    val shape: Array<IntArray>,
    val x: Int,
    val y: Int,
    val color: Int,
    val type: String
)

class TetrisGame(
    private val width: Int = 10,
    private val height: Int = 20
) {
    var board: Array<IntArray> = createEmptyBoard()
        private set

    var score: Int = 0
        private set

    var level: Int = 1
        private set

    var linesCleared: Int = 0
        private set

    var gameOver: Boolean = false
        private set

    var currentPiece: Piece? = null
        private set

    var nextPiece: Piece? = null
        private set

    companion object {
        private val PIECES = mapOf(
            "I" to arrayOf(intArrayOf(1, 1, 1, 1)),
            "O" to arrayOf(
                intArrayOf(1, 1),
                intArrayOf(1, 1)
            ),
            "T" to arrayOf(
                intArrayOf(0, 1, 0),
                intArrayOf(1, 1, 1)
            ),
            "S" to arrayOf(
                intArrayOf(0, 1, 1),
                intArrayOf(1, 1, 0)
            ),
            "Z" to arrayOf(
                intArrayOf(1, 1, 0),
                intArrayOf(0, 1, 1)
            ),
            "J" to arrayOf(
                intArrayOf(1, 0, 0),
                intArrayOf(1, 1, 1)
            ),
            "L" to arrayOf(
                intArrayOf(0, 0, 1),
                intArrayOf(1, 1, 1)
            )
        )

        private val PIECE_COLORS = mapOf(
            "I" to 1, "O" to 2, "T" to 3,
            "S" to 4, "Z" to 5, "J" to 6, "L" to 7
        )
    }

    init {
        generateNewPiece()
    }

    private fun createEmptyBoard(): Array<IntArray> {
        return Array(height) { IntArray(width) { 0 } }
    }

    fun generateNewPiece() {
        val pieces = PIECES.keys.toList()
        val randomPiece = pieces.random()

        if (nextPiece != null) {
            currentPiece = nextPiece
        } else {
            currentPiece = Piece(
                shape = PIECES[randomPiece]!!.map { it.clone() }.toTypedArray(),
                x = width / 2 - 1,
                y = 0,
                color = PIECE_COLORS[randomPiece]!!,
                type = randomPiece
            )
        }

        val nextRandomPiece = pieces.random()
        nextPiece = Piece(
            shape = PIECES[nextRandomPiece]!!.map { it.clone() }.toTypedArray(),
            x = width / 2 - 1,
            y = 0,
            color = PIECE_COLORS[nextRandomPiece]!!,
            type = nextRandomPiece
        )

        currentPiece?.let {
            if (checkCollision(it.shape, it.x, it.y)) {
                gameOver = true
            }
        }
    }

    private fun checkCollision(shape: Array<IntArray>, x: Int, y: Int): Boolean {
        for (row in shape.indices) {
            for (col in shape[row].indices) {
                if (shape[row][col] != 0) {
                    val newX = x + col
                    val newY = y + row

                    if (newX < 0 || newX >= width || newY >= height) {
                        return true
                    }

                    if (newY >= 0 && board[newY][newX] != 0) {
                        return true
                    }
                }
            }
        }
        return false
    }

    fun rotate(): Boolean {
        val piece = currentPiece ?: return false
        if (gameOver) return false

        val rotated = Array(piece.shape[0].size) { i ->
            IntArray(piece.shape.size) { j ->
                piece.shape[piece.shape.size - 1 - j][i]
            }
        }

        if (!checkCollision(rotated, piece.x, piece.y)) {
            currentPiece = piece.copy(shape = rotated)
            return true
        }
        return false
    }

    fun moveLeft(): Boolean {
        val piece = currentPiece ?: return false
        if (gameOver) return false

        if (!checkCollision(piece.shape, piece.x - 1, piece.y)) {
            currentPiece = piece.copy(x = piece.x - 1)
            return true
        }
        return false
    }

    fun moveRight(): Boolean {
        val piece = currentPiece ?: return false
        if (gameOver) return false

        if (!checkCollision(piece.shape, piece.x + 1, piece.y)) {
            currentPiece = piece.copy(x = piece.x + 1)
            return true
        }
        return false
    }

    fun moveDown(): Boolean {
        val piece = currentPiece ?: return false
        if (gameOver) return false

        if (!checkCollision(piece.shape, piece.x, piece.y + 1)) {
            currentPiece = piece.copy(y = piece.y + 1)
            return true
        } else {
            lockPiece()
            return false
        }
    }

    fun hardDrop() {
        val piece = currentPiece ?: return
        if (gameOver) return

        var newY = piece.y
        while (!checkCollision(piece.shape, piece.x, newY + 1)) {
            newY++
        }
        currentPiece = piece.copy(y = newY)
        lockPiece()
    }

    private fun lockPiece() {
        val piece = currentPiece ?: return

        for (row in piece.shape.indices) {
            for (col in piece.shape[row].indices) {
                if (piece.shape[row][col] != 0) {
                    val boardY = piece.y + row
                    val boardX = piece.x + col
                    if (boardY >= 0) {
                        board[boardY][boardX] = piece.color
                    }
                }
            }
        }

        clearLines()
        generateNewPiece()
    }

    private fun clearLines() {
        var cleared = 0

        var row = height - 1
        while (row >= 0) {
            if (board[row].all { it != 0 }) {
                // Remove line and add empty line at top
                val newBoard = Array(height) { IntArray(width) }
                for (i in 0 until row) {
                    newBoard[i + 1] = board[i]
                }
                board = newBoard
                cleared++
            } else {
                row--
            }
        }

        if (cleared > 0) {
            linesCleared += cleared
            score += calculateScore(cleared)
            level = linesCleared / 10 + 1
        }
    }

    private fun calculateScore(lines: Int): Int {
        val baseScores = listOf(0, 100, 300, 500, 800)
        return baseScores[lines] * level
    }

    fun getState(): GameState {
        return GameState(
            board = board.map { it.clone() }.toTypedArray(),
            currentPiece = currentPiece,
            nextPiece = nextPiece,
            score = score,
            level = level,
            linesCleared = linesCleared,
            gameOver = gameOver
        )
    }

    fun reset() {
        board = createEmptyBoard()
        score = 0
        level = 1
        linesCleared = 0
        gameOver = false
        currentPiece = null
        nextPiece = null
        generateNewPiece()
    }
}

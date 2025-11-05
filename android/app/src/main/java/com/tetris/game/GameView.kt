package com.tetris.game

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.RectF
import android.util.AttributeSet
import android.view.View

class GameView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    private var gameState: ServerGameState? = null
    private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val colors = intArrayOf(
        Color.BLACK,           // 0 - empty
        Color.parseColor("#00f0f0"),  // 1 - I (cyan)
        Color.parseColor("#f0f000"),  // 2 - O (yellow)
        Color.parseColor("#a000f0"),  // 3 - T (purple)
        Color.parseColor("#00f000"),  // 4 - S (green)
        Color.parseColor("#f00000"),  // 5 - Z (red)
        Color.parseColor("#0000f0"),  // 6 - J (blue)
        Color.parseColor("#f0a000")   // 7 - L (orange)
    )

    private var blockSize = 0f
    private var boardWidth = 10
    private var boardHeight = 20
    private val gridPaint = Paint().apply {
        color = Color.parseColor("#222222")
        style = Paint.Style.STROKE
        strokeWidth = 2f
    }

    fun updateGameState(state: ServerGameState) {
        gameState = state
        boardWidth = state.board[0].size
        boardHeight = state.board.size
        invalidate()
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        calculateBlockSize()
    }

    private fun calculateBlockSize() {
        val availableWidth = width.toFloat()
        val availableHeight = height.toFloat()

        val blockWidth = availableWidth / boardWidth
        val blockHeight = availableHeight / boardHeight

        blockSize = minOf(blockWidth, blockHeight)
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)

        if (blockSize == 0f) {
            calculateBlockSize()
        }

        val state = gameState ?: return

        // Draw background
        paint.color = Color.BLACK
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), paint)

        // Draw board
        for (y in state.board.indices) {
            for (x in state.board[y].indices) {
                val cell = state.board[y][x]
                if (cell != 0) {
                    drawBlock(canvas, x, y, colors[cell])
                }
            }
        }

        // Draw current piece
        state.currentPiece?.let { piece ->
            for (y in piece.shape.indices) {
                for (x in piece.shape[y].indices) {
                    if (piece.shape[y][x] != 0) {
                        drawBlock(canvas, piece.x + x, piece.y + y, colors[piece.color])
                    }
                }
            }
        }

        // Draw grid
        for (x in 0..boardWidth) {
            canvas.drawLine(
                x * blockSize,
                0f,
                x * blockSize,
                boardHeight * blockSize,
                gridPaint
            )
        }
        for (y in 0..boardHeight) {
            canvas.drawLine(
                0f,
                y * blockSize,
                boardWidth * blockSize,
                y * blockSize,
                gridPaint
            )
        }
    }

    private fun drawBlock(canvas: Canvas, x: Int, y: Int, color: Int) {
        val left = x * blockSize
        val top = y * blockSize
        val right = left + blockSize
        val bottom = top + blockSize

        paint.color = color
        paint.style = Paint.Style.FILL
        canvas.drawRoundRect(
            RectF(left + 2, top + 2, right - 2, bottom - 2),
            4f,
            4f,
            paint
        )

        // Border
        paint.color = Color.parseColor("#333333")
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 2f
        canvas.drawRoundRect(
            RectF(left + 2, top + 2, right - 2, bottom - 2),
            4f,
            4f,
            paint
        )
    }
}

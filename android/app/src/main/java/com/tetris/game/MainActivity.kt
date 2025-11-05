package com.tetris.game

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.firebase.analytics.FirebaseAnalytics
import com.google.firebase.analytics.ktx.analytics
import com.google.firebase.crashlytics.ktx.crashlytics
import com.google.firebase.ktx.Firebase

class MainActivity : AppCompatActivity() {

    private lateinit var gameView: GameView
    private lateinit var scoreText: TextView
    private lateinit var levelText: TextView
    private lateinit var linesText: TextView
    private lateinit var statusText: TextView
    private lateinit var startButton: Button
    private lateinit var pauseButton: Button
    private lateinit var leftButton: Button
    private lateinit var rightButton: Button
    private lateinit var downButton: Button
    private lateinit var rotateButton: Button
    private lateinit var dropButton: Button

    private lateinit var webSocketClient: WebSocketClient
    private lateinit var firebaseAnalytics: FirebaseAnalytics
    private var isPaused = false
    private var isGameStarted = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialize Firebase
        firebaseAnalytics = Firebase.analytics
        Firebase.crashlytics.setCrashlyticsCollectionEnabled(true)

        initializeViews()
        setupWebSocket()
        setupButtons()

        logAnalyticsEvent("app_opened")
    }

    private fun initializeViews() {
        gameView = findViewById(R.id.gameView)
        scoreText = findViewById(R.id.scoreText)
        levelText = findViewById(R.id.levelText)
        linesText = findViewById(R.id.linesText)
        statusText = findViewById(R.id.statusText)
        startButton = findViewById(R.id.startButton)
        pauseButton = findViewById(R.id.pauseButton)
        leftButton = findViewById(R.id.leftButton)
        rightButton = findViewById(R.id.rightButton)
        downButton = findViewById(R.id.downButton)
        rotateButton = findViewById(R.id.rotateButton)
        dropButton = findViewById(R.id.dropButton)

        pauseButton.isEnabled = false
    }

    private fun setupWebSocket() {
        val wsUrl = BuildConfig.WS_URL
        webSocketClient = WebSocketClient(wsUrl, lifecycleScope)

        webSocketClient.onConnected = {
            runOnUiThread {
                statusText.text = "Connected"
                statusText.setBackgroundColor(getColor(android.R.color.holo_green_dark))
                Toast.makeText(this, "Connected to server", Toast.LENGTH_SHORT).show()
            }
        }

        webSocketClient.onDisconnected = {
            runOnUiThread {
                statusText.text = "Disconnected - Reconnecting..."
                statusText.setBackgroundColor(getColor(android.R.color.holo_red_dark))
            }
        }

        webSocketClient.onGameState = { state ->
            runOnUiThread {
                updateGameState(state)
            }
        }

        webSocketClient.onGameOver = { state ->
            runOnUiThread {
                updateGameState(state)
                isGameStarted = false
                pauseButton.isEnabled = false
                startButton.isEnabled = true
                Toast.makeText(this, "Game Over! Score: ${state.score}", Toast.LENGTH_LONG).show()
                logAnalyticsEvent("game_over", "score" to state.score.toString())
            }
        }

        webSocketClient.onError = { error ->
            runOnUiThread {
                Toast.makeText(this, error, Toast.LENGTH_SHORT).show()
            }
        }

        webSocketClient.connect()
    }

    private fun setupButtons() {
        startButton.setOnClickListener {
            webSocketClient.sendAction("start")
            isGameStarted = true
            isPaused = false
            startButton.isEnabled = false
            pauseButton.isEnabled = true
            pauseButton.text = "Pause"
            logAnalyticsEvent("game_started")
        }

        pauseButton.setOnClickListener {
            if (isPaused) {
                webSocketClient.sendAction("resume")
                isPaused = false
                pauseButton.text = "Pause"
                logAnalyticsEvent("game_resumed")
            } else {
                webSocketClient.sendAction("pause")
                isPaused = true
                pauseButton.text = "Resume"
                logAnalyticsEvent("game_paused")
            }
        }

        leftButton.setOnClickListener {
            if (isGameStarted && !isPaused) {
                webSocketClient.sendAction("move_left")
            }
        }

        rightButton.setOnClickListener {
            if (isGameStarted && !isPaused) {
                webSocketClient.sendAction("move_right")
            }
        }

        downButton.setOnClickListener {
            if (isGameStarted && !isPaused) {
                webSocketClient.sendAction("move_down")
            }
        }

        rotateButton.setOnClickListener {
            if (isGameStarted && !isPaused) {
                webSocketClient.sendAction("rotate")
            }
        }

        dropButton.setOnClickListener {
            if (isGameStarted && !isPaused) {
                webSocketClient.sendAction("hard_drop")
            }
        }
    }

    private fun updateGameState(state: ServerGameState) {
        gameView.updateGameState(state)
        scoreText.text = "Score: ${state.score}"
        levelText.text = "Level: ${state.level}"
        linesText.text = "Lines: ${state.linesCleared}"
    }

    private fun logAnalyticsEvent(event: String, vararg params: Pair<String, String>) {
        val bundle = Bundle()
        params.forEach { (key, value) ->
            bundle.putString(key, value)
        }
        firebaseAnalytics.logEvent(event, bundle)
    }

    override fun onDestroy() {
        super.onDestroy()
        webSocketClient.disconnect()
    }

    override fun onPause() {
        super.onPause()
        if (isGameStarted && !isPaused) {
            pauseButton.performClick()
        }
    }
}

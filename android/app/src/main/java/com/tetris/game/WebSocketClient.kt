package com.tetris.game

import android.util.Log
import com.google.gson.Gson
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import java.util.concurrent.TimeUnit

data class ServerMessage(
    val type: String,
    val playerId: String? = null,
    val state: ServerGameState? = null,
    val message: String? = null
)

data class ServerGameState(
    val board: List<List<Int>>,
    val currentPiece: ServerPiece?,
    val nextPiece: ServerPiece?,
    val score: Int,
    val level: Int,
    val linesCleared: Int,
    val gameOver: Boolean
)

data class ServerPiece(
    val shape: List<List<Int>>,
    val x: Int,
    val y: Int,
    val color: Int,
    val type: String
)

data class ClientAction(
    val action: String
)

class WebSocketClient(
    private val url: String,
    private val scope: CoroutineScope
) {
    private var webSocket: WebSocket? = null
    private val client = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .writeTimeout(10, TimeUnit.SECONDS)
        .pingInterval(30, TimeUnit.SECONDS)
        .build()

    private val gson = Gson()
    private var reconnectJob: Job? = null
    private var shouldReconnect = true

    var onConnected: (() -> Unit)? = null
    var onDisconnected: (() -> Unit)? = null
    var onGameState: ((ServerGameState) -> Unit)? = null
    var onGameOver: ((ServerGameState) -> Unit)? = null
    var onError: ((String) -> Unit)? = null

    fun connect() {
        Log.d(TAG, "Connecting to WebSocket: $url")
        shouldReconnect = true

        val request = Request.Builder()
            .url(url)
            .build()

        webSocket = client.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                Log.d(TAG, "WebSocket connected")
                reconnectJob?.cancel()
                scope.launch(Dispatchers.Main) {
                    onConnected?.invoke()
                }
            }

            override fun onMessage(webSocket: WebSocket, text: String) {
                Log.d(TAG, "Received: $text")
                try {
                    val message = gson.fromJson(text, ServerMessage::class.java)
                    handleMessage(message)
                } catch (e: Exception) {
                    Log.e(TAG, "Error parsing message", e)
                    scope.launch(Dispatchers.Main) {
                        onError?.invoke("Error parsing server message: ${e.message}")
                    }
                }
            }

            override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
                Log.d(TAG, "WebSocket closing: $code - $reason")
                webSocket.close(1000, null)
            }

            override fun onClosed(webSocket: WebSocket, code: Int, reason: String) {
                Log.d(TAG, "WebSocket closed: $code - $reason")
                scope.launch(Dispatchers.Main) {
                    onDisconnected?.invoke()
                }
                if (shouldReconnect) {
                    scheduleReconnect()
                }
            }

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                Log.e(TAG, "WebSocket error", t)
                scope.launch(Dispatchers.Main) {
                    onDisconnected?.invoke()
                    onError?.invoke("Connection failed: ${t.message}")
                }
                if (shouldReconnect) {
                    scheduleReconnect()
                }
            }
        })
    }

    private fun handleMessage(message: ServerMessage) {
        scope.launch(Dispatchers.Main) {
            when (message.type) {
                "init" -> {
                    Log.d(TAG, "Game initialized: ${message.playerId}")
                    message.state?.let { onGameState?.invoke(it) }
                }
                "state_update" -> {
                    message.state?.let { onGameState?.invoke(it) }
                }
                "game_over" -> {
                    message.state?.let { onGameOver?.invoke(it) }
                }
                "paused" -> {
                    Log.d(TAG, "Game paused")
                }
                "error" -> {
                    onError?.invoke(message.message ?: "Unknown error")
                }
            }
        }
    }

    private fun scheduleReconnect() {
        reconnectJob?.cancel()
        reconnectJob = scope.launch {
            delay(3000)
            if (shouldReconnect) {
                Log.d(TAG, "Attempting to reconnect...")
                connect()
            }
        }
    }

    fun sendAction(action: String) {
        val clientAction = ClientAction(action)
        val json = gson.toJson(clientAction)
        val success = webSocket?.send(json) ?: false
        if (!success) {
            Log.w(TAG, "Failed to send action: $action")
        } else {
            Log.d(TAG, "Sent action: $action")
        }
    }

    fun disconnect() {
        Log.d(TAG, "Disconnecting WebSocket")
        shouldReconnect = false
        reconnectJob?.cancel()
        webSocket?.close(1000, "User disconnected")
        webSocket = null
    }

    companion object {
        private const val TAG = "WebSocketClient"
    }
}

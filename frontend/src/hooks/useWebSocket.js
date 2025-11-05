import { useState, useEffect, useCallback, useRef } from 'react';

const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to server');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'init':
            setPlayerId(data.playerId);
            setGameState(data.state);
            setIsGameOver(false);
            break;
          case 'state_update':
            setGameState(data.state);
            break;
          case 'game_over':
            setGameState(data.state);
            setIsGameOver(true);
            break;
          case 'paused':
            // Handle pause state if needed
            break;
          case 'error':
            console.error('Server error:', data.message);
            break;
          default:
            console.warn('Unknown message type:', data.type);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from server');
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  const sendAction = useCallback((action) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action }));
    }
  }, []);

  return {
    isConnected,
    gameState,
    playerId,
    isGameOver,
    sendAction
  };
};

export default useWebSocket;

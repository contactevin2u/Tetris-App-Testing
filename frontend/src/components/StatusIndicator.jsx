const StatusIndicator = ({ isConnected }) => {
  return (
    <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
      {isConnected ? 'Connected' : 'Disconnected - Reconnecting...'}
    </div>
  );
};

export default StatusIndicator;

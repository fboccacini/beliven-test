import React from 'react';
import useWebSocket from 'react-use-websocket';

import './App.css';

const WS_URL = 'ws://localhost:8000';

function App() {
  useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    }
  });

  return (
    <div>Quiz!!</div>
  );
}

export default App;
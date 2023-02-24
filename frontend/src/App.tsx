import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';

import './App.css';
import Timer from './components/Timer';
import TextEditor from './components/TextEditor';
import PlayersList from './components/PlayersList';
import JudgeComponent from './components/JudgeComponent';

const WS_URL = process.env.REACT_APP_WS_HOST || 'ws://localhost:8000';

const App = () => {
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState(<div className='status-message'>Inserisci un nome per entrare nel gioco</div>);

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
      syncStatus();
    },
    onMessage: (message) => {
      const data = JSON.parse(message.data);
      
      setStatus(data);
      if (!data.thisPlayer?.inGame) {
        setStatusMessage(<div className='status-message'>Attendi la prossima partita</div>);
      } else {
        switch(data.status) {
          case 'awaiting_master': setStatusMessage(<div className='status-message'>In attesa di un master</div>);
            break;
          case 'awaiting_players': setStatusMessage(<div className='status-message'>In attesa di altri giocatori</div>);
            break;
          case 'awaiting_question': setStatusMessage(<div className='status-message'>In attesa della prossima domanda</div>);
            break;
          case 'awaiting_answer': setStatusMessage(<div className='status-message'>In attesa della risposta</div>);
            break;
          case 'awaiting_judgement': setStatusMessage(<div className='status-message'>Il master sta controllando la risposta</div>);
            break;
          case 'time_running': if (status.isMaster) { 
              setStatusMessage(<div className='status-message'>Attendi che un giocatore prenoti la risposta</div>);
            } else {
              setStatusMessage(<div className='status-message'>Prenota la risposta cliccando sul timer!</div>);
            }
            break;
          case 'game_ended': setStatusMessage(<div className='status-message'>Fine della partita</div>);
            break;
        }
      }
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true,
  });
  
  const takeMastership = () => {
    sendJsonMessage({
      command: 'take_mastership',
    });
  }

  const resetGame = () => {
    sendJsonMessage({
      command: 'reset_game',
    });
  }

  const syncStatus = () => {
    if (status != null) {
      console.log('Syncing status..');
      sendJsonMessage({
        command: 'resync',
        data: status,
      });
    }
  }

  return (
      <div className='game-board'>
        <h2>{ status?.question }</h2>
        <h3>{ status?.answer }</h3>
        <div className='box'>
          {
            status?.thisPlayer == null || status?.thisPlayer?.name?.length <= 0 ?
              <>
                Username
                <TextEditor sendJsonMessage={ sendJsonMessage } command='set_name'/>
              </> : null
          }
          { status?.status === 'awaiting_master' ?
              <button onClick={ takeMastership }>Diventa Master</button> : null
          }
          { status?.status === 'game_ended' ?
              <button onClick={ resetGame }>Nuova partita</button> : null
          }
          { statusMessage }
        </div>
        <div className='box'>
          { status?.status === 'time_running' && status?.thisPlayer?.inGame ? 
            <Timer sendJsonMessage={ sendJsonMessage } timer={ status?.timer } isMaster={ status.isMaster }/> : null 
          }
          { status?.isMaster ? 
              status?.status === 'awaiting_question' ? 
                <>
                  Poni una domanda
                  <TextEditor sendJsonMessage={ sendJsonMessage } command='open_question'/>
                </>
              : status?.status === 'awaiting_judgement' ? <JudgeComponent  sendJsonMessage={ sendJsonMessage }/> : null
             : null
          }
          { status?.isAnswering ? 
            <>
              Rispondi
              <TextEditor sendJsonMessage={ sendJsonMessage } command='send_answer'/>
            </> : null
          }
          <div>{ status?.message }</div>
        </div>
        <div className='box'>
          Master: { status?.master }
          { status == null ? null :
            <PlayersList isMaster={ status?.isMaster } thisPlayer={ status?.thisPlayer } otherPlayers={ status?.otherPlayers }/>
          }
        </div>
      </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  UncontrolledTooltip
} from 'reactstrap';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { DefaultEditor } from 'react-simple-wysiwyg';
import Avatar from 'react-avatar';
import Timer from './components/Timer';

import './App.css';
import TextEditor from './components/TextEditor';
import PlayersList from './components/PlayersList';
import JudgeComponent from './components/JudgeComponent';

const WS_URL = 'ws://localhost:8000';

const App = () => {
  const [status, setStatus] = useState(null);

  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
      syncStatus();
    },
    onMessage: (message) => {
      const data = JSON.parse(message.data);
      console.log(status?.thisPlayer?.id, data);
      setStatus(data);
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
      if (status.thisPlayer?.name != null) {
        sendJsonMessage({
          command: 'set_name',
          data: status.thisPlayer.name,
        });
      }
      if (status.isMaster) {
        sendJsonMessage({
          command: 'take_mastership',
        });
      }
      if (status.question?.name != null) {
        sendJsonMessage({
          command: 'open_question',
          data: status.question,
        });
      }
      if (status.isAnswering) {
        sendJsonMessage({
          command: 'stop_timer',
        });
      }
    }
  }

  return (
      <div>
        <h2>{ status?.question }</h2>
        <h3>{ status?.answer }</h3>
        <div>
          {
            status?.thisPlayer == null || status?.thisPlayer?.name?.length <= 0 ?
              <>
                <Navbar color="light" light>
                  Username
                </Navbar>
                <TextEditor sendJsonMessage={ sendJsonMessage } command='set_name'/>
              </>
              : null
            }
          { status?.status === 'awaiting_master' ?
              <button onClick={takeMastership}>Diventa Master</button> : null
          }
          { status?.status === 'game_ended' ?
              <button onClick={resetGame}>Nuova partita</button> : null
          }
        </div>
          { status?.status }
          { status?.status === 'time_running' && status?.thisPlayer?.inGame ? <Timer sendJsonMessage={ sendJsonMessage } timer={ status?.timer } isMaster={ status.isMaster }/> : null }
          { status?.isMaster ? 
              status?.status === 'awaiting_question' ? 
                <>
                  <Navbar color="light" light>
                    Poni una domanda
                  </Navbar>
                  <TextEditor sendJsonMessage={ sendJsonMessage } command='open_question'/>
                </>
              : status?.status === 'awaiting_judgement' ? <JudgeComponent  sendJsonMessage={ sendJsonMessage }/> : null
             : null
          }
          { status?.isAnswering ? 
            <>
              <Navbar color="light" light>
                Rispondi
              </Navbar>
              <TextEditor sendJsonMessage={ sendJsonMessage } command='send_answer'/>
            </>
             : null
          }
        <div>{ status?.message }</div>
        <div>
          Master: { status?.master }
        </div>
        <div>
          { status == null ? null :
            <PlayersList isMaster={ status?.isMaster } thisPlayer={ status?.thisPlayer } otherPlayers={ status?.otherPlayers }/>
          }
        </div>
      </div>
  );
}

export default App;
// import React, { useState } from 'react';
// import useWebSocket from 'react-use-websocket';

// class WsContext {

// }
// const WS_URL = 'ws://localhost:8000';

// const [status, setStatus] = useState({
//     id: null,
//     name: null,
//     message: null,
//     question: null,
//     answer: null,
//     isMaster: false,
//     isAnswering: false,
//     master: null,
//     points: 0,
//     other_players: [],
//     timer: null,
//     status: 'awaiting_master',
// });
// const [username, setUsername] = useState('');
// const [question, setQuestion] = useState('');
// const [answer, setAnswer] = useState('');

// const changeUsername = () => {
//   sendJsonMessage({
//     command: 'set_name',
//     data: username,
//   });
// }

// const takeMastership = () => {
//   sendJsonMessage({
//     command: 'take_mastership',
//   });
// }

// const openQuestion = () => {
//   sendJsonMessage({
//     command: 'open_question',
//     data: question,
//   });
// }

// const sendAnswer = () => {
//   sendJsonMessage({
//     command: 'send_answer',
//     data: question,
//   });
// }



// const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
//     onOpen: () => {
//       console.log('WebSocket connection established.');
//       if (status.name !== '') {
//         changeUsername();
//       }
//       if (status.isMaster) {
//         takeMastership();
//         if (status.status === 'awaiting_answer') {
//           openQuestion();
//         }
//       }
//     },
//     onMessage: (message) => {
//       const data = JSON.parse(message.data);
//       console.log(status.id, data);
//       setStatus(data);
//     },
//     share: true,
//     filter: () => false,
//     retryOnError: true,
//     shouldReconnect: () => true,
// });

// export const WsContext = React.createContext(null);
